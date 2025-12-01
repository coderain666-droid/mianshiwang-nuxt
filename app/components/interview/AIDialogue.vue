<template>
	<div
		class="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-0"
	>
		<!-- 对话消息列表 -->
		<div
			ref="messagesContainerRef"
			class="flex-1 overflow-y-auto p-6 space-y-4"
		>
			<div
				v-if="interviewStore.messages.length === 0"
				class="flex items-center justify-center h-full"
			>
				<div class="text-center">
					<UIcon
						name="i-heroicons-chat-bubble-left-right"
						class="w-16 h-16 text-gray-300 mx-auto mb-4"
					/>
					<p class="text-neutral-500">面试即将开始...</p>
				</div>
			</div>

			<div
				v-for="(message, index) in interviewStore.messages"
				:key="index"
				:class="[
					'flex gap-4',
					message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
				]"
			>
				<!-- 头像 -->
				<div
					class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
					:class="
						message.role === 'user'
							? 'bg-primary-100'
							: 'bg-linear-to-br from-indigo-500 to-purple-600 shadow-sm'
					"
				>
					<UIcon
						v-if="message.role === 'user'"
						name="i-heroicons-user"
						class="w-6 h-6 text-primary-600"
					/>
					<UIcon
						v-else
						name="i-heroicons-sparkles"
						class="w-6 h-6 text-white"
					/>
				</div>

				<!-- 消息气泡 -->
				<div
					:class="[
						'max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed',
						message.role === 'user'
							? 'bg-primary-600 text-white rounded-tr-none'
							: 'bg-white border border-gray-100 text-neutral-800 rounded-tl-none'
					]"
				>
					<div class="whitespace-pre-wrap wrap-break-word">
						{{ message.content }}
					</div>
				</div>
			</div>

			<!-- 正在输入指示器 -->
			<div v-if="isStreaming" class="flex gap-4">
				<div
					class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 shadow-sm"
				>
					<UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-white" />
				</div>
				<div
					class="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-3"
				>
					<div class="flex gap-1">
						<div
							class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
							style="animation-delay: 0s"
						></div>
						<div
							class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
							style="animation-delay: 0.2s"
						></div>
						<div
							class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
							style="animation-delay: 0.4s"
						></div>
					</div>
					<span class="text-xs text-gray-400 font-medium">AI 思考中...</span>
				</div>
			</div>
		</div>

		<!-- 输入区域 -->
		<div class="border-t border-gray-100 p-6 bg-white rounded-b-2xl">
			<div class="relative">
				<UTextarea
					v-model="inputMessage"
					placeholder="请输入您的回答..."
					:rows="3"
					:maxrows="6"
					resize
					autoresize
					:disabled="!canSendMessage"
					class="w-full"
					:ui="{
						wrapper: 'relative',
						base: 'pr-24 py-3 pl-4 rounded-xl border-gray-200 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 focus:bg-white transition-colors duration-200',
						placeholder: 'text-gray-400'
					}"
					@keydown.enter.exact.prevent="handleEnterKey"
					@compositionstart="handleCompositionStart"
					@compositionend="handleCompositionEnd"
				/>
				<div class="absolute bottom-3 right-3 flex items-center gap-2">
					<UButton
						color="primary"
						:disabled="!canSendMessage || !inputMessage.trim()"
						:ui="{ rounded: 'rounded-lg' }"
						@click="handleSendMessage"
					>
						发送
						<UIcon name="i-heroicons-paper-airplane" class="w-4 h-4 ml-1" />
					</UButton>
				</div>
			</div>
			<div
				class="flex items-center justify-between mt-3 text-xs text-neutral-400 px-1"
			>
				<span class="flex items-center gap-1">
					<UKbd size="xs">Enter</UKbd> 发送
					<span class="mx-1">|</span>
					<UKbd size="xs">Shift + Enter</UKbd> 换行
				</span>
				<div class="flex items-center gap-3">
					<UButton
						v-if="interviewStore.interviewStatus === 'ended'"
						color="green"
						variant="soft"
						size="xs"
						icon="i-heroicons-document-text"
						@click="handleComplete"
					>
						查看报告
					</UButton>
					<UButton
						v-else-if="
							interviewStore.interviewStatus === 'starting' ||
							interviewStore.interviewStatus === 'in_progress'
						"
						color="warning"
						size="xs"
						variant="soft"
						icon="i-heroicons-pause"
						@click="suspendInterview"
					>
						暂停面试
					</UButton>
					<UButton
						v-else-if="interviewStore.interviewStatus === 'suspended'"
						color="warning"
						size="xs"
						variant="soft"
						icon="i-heroicons-play"
						@click="restartInterview"
					>
						继续面试
					</UButton>
					<UButton
						color="error"
						variant="ghost"
						size="xs"
						icon="i-heroicons-stop-circle"
						@click="endInterview"
					>
						结束面试
					</UButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useInterviewStore } from '@/stores/interview'
import {
	startMockInterviewAPI,
	answerInterviewQuestionAPI
} from '@/api/interview'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from '#imports'

const interviewStore = useInterviewStore()

const userStore = useUserStore()
const toast = useToast()

const inputMessage = ref('')
const messagesContainerRef = ref(null)
const isComposing = ref(false) // 是否正在使用输入法组合输入
/**
 * 是否正在流式输出（AI 正在说话）
 */
const isStreaming = computed(() => {
	return (
		interviewStore.interviewEventType === 'question' ||
		interviewStore.interviewEventType === 'thinking' ||
		interviewStore.interviewEventType === 'start'
	)
})

// 监听消息变化，自动滚动
watch(
	interviewStore.messages,
	() => {
		scrollToBottom()
	},
	{ deep: true }
)

onMounted(() => {
	// 如果面试已开始，恢复 SSE 连接
	if (
		interviewStore.sessionId &&
		interviewStore.interviewStatus === 'in_progress'
	) {
		startInterview()
		// TODO：重新进入，设置为 waiting 状态
		interviewStore.interviewEventType = 'waiting'
	}
})

// 开始面试
const startInterview = async () => {
	try {
		const params = {
			interviewType: 'special',
			resumeId: interviewStore.resumeId,
			resumeContent: interviewStore.resumeText,
			company: interviewStore.selectedPosition.company || '',
			positionName: interviewStore.selectedPosition.positionName || '',
			minSalary: interviewStore.selectedPosition.minSalary || '',
			maxSalary: interviewStore.selectedPosition.maxSalary || '',
			jd: interviewStore.selectedPosition.jd || ''
		}

		// 获取配置
		const config = useRuntimeConfig()

		const { close } = startMockInterviewAPI(params, {
			token: userStore.token,
			baseURL: config.public.apiBase,
			callbacks: {
				onMessage: (data) => {
					console.log('SSE Message:', data)

					const { type, content } = data

					// 面试开始，包含开场白（流式输出）
					if (type === 'start') {
						interviewStore.interviewEventType = 'start'
						interviewStore.sessionId = data.sessionId
						interviewStore.interviewerName = data.interviewerName

						// 开始流式消息（创建占位消息）
						// interviewStore.startStreamingMessage('interviewer')
						// 更新消息内容（流式追加）
						interviewStore.updateLastMessage(content, 'interviewer')
						scrollToBottom()
					}
					// 等待候选人回答
					else if (type === 'waiting') {
						interviewStore.interviewEventType = 'waiting'
					}
					// 面试结束
					else if (type === 'end') {
						interviewStore.interviewEventType = 'end'
						interviewStore.interviewStatus = 'ended'
					}
					// 发生错误
					else if (type === 'error') {
						interviewStore.interviewEventType = 'error'
						toast.add({
							title: '面试出错',
							description: content || '请稍后重试',
							color: 'error'
						})
					}
				},
				onError: (error) => {
					console.error('SSE Error:', error)
					interviewStore.interviewEventType = 'error'
					toast.add({
						title: '面试启动失败',
						description: error.message || '网络错误，请稍后重试',
						color: 'error'
					})
				}
			}
		})
		// 改变状态标记
		interviewStore.interviewStatus = 'in_progress'
	} catch (error) {
		interviewStore.interviewEventType = 'error'
		toast.add({
			title: '启动失败',
			description: error.message || '请稍后重试',
			color: 'error'
		})
		interviewStore.interviewStatus = 'idle'
	}
}

// 滚动到底部
const scrollToBottom = () => {
	nextTick(() => {
		if (messagesContainerRef.value) {
			messagesContainerRef.value.scrollTop =
				messagesContainerRef.value.scrollHeight
		}
	})
}

/**
 * 是否可以发送消息
 * 1. 面试状态为进行中
 * 2. 面试进度类型为等待候选人回答
 */
const canSendMessage = computed(() => {
	return (
		interviewStore.interviewStatus === 'in_progress' &&
		interviewStore.interviewEventType === 'waiting'
	)
})

// 处理输入法组合开始
const handleCompositionStart = () => {
	isComposing.value = true
}

// 处理输入法组合结束
const handleCompositionEnd = () => {
	isComposing.value = false
}

// 处理回车键
const handleEnterKey = (event) => {
	// 如果正在使用输入法组合输入，不发送消息
	if (isComposing.value) {
		return
	}

	// 否则发送消息
	handleSendMessage()
}

// 发送消息
const handleSendMessage = async () => {
	if (!inputMessage.value.trim() || !canSendMessage.value) return

	const userMessage = inputMessage.value.trim()
	interviewStore.addMessage('user', userMessage)
	inputMessage.value = ''

	scrollToBottom()

	try {
		const params = {
			sessionId: interviewStore.sessionId,
			answer: userMessage
		}

		// 获取配置
		const config = useRuntimeConfig()

		answerInterviewQuestionAPI(params, {
			token: userStore.token,
			baseURL: config.public.apiBase,
			callbacks: {
				onMessage: (data) => {
					console.log('SSE Message:', data)
					const { type, content } = data
					// 面试官提问（流式输出）
					if (type === 'question') {
						interviewStore.interviewEventType = 'question'

						// 更新最后一条面试官消息（流式追加）
						interviewStore.updateLastMessage(content, 'interviewer')
						scrollToBottom()
					}
					// 等待候选人回答
					else if (type === 'waiting') {
						interviewStore.interviewEventType = 'waiting'
					}
					// 面试结束
					else if (type === 'end') {
						interviewStore.interviewEventType = 'end'
						interviewStore.interviewStatus = 'ended'
					}
					// 发生错误
					else if (type === 'error') {
						interviewStore.interviewEventType = 'error'
						toast.add({
							title: '回答失败',
							description: content || '请稍后重试',
							color: 'error'
						})
					}
				},
				onError: (error) => {
					console.error('SSE Error:', error)
					interviewStore.interviewEventType = 'error'
					toast.add({
						title: '网络错误',
						description: error.message || '请检查网络连接',
						color: 'error'
					})
				}
			}
		})
	} catch (error) {
		toast.add({
			title: '发送失败',
			description: error.message || '请稍后重试',
			color: 'error'
		})
		interviewStore.interviewEventType = 'waiting'
	}
}

/**
 * 暂停面试
 */
const suspendInterview = () => {
	// TODO：暂停面试的流程
	interviewStore.interviewStatus = 'suspend'
}

/**
 * 恢复面试
 */
const restartInterview = () => {
	// TODO：恢复面试的流程
	interviewStore.interviewStatus = 'in_progress'
}

/**
 * 结束面试
 */
const endInterview = () => {
	globalModal.showModal({
		title: '提示',
		description: '确定要主动结束当前面试吗？结束后将生成面试报告。',
		buttons: [
			{
				label: '取消',
				color: 'gray',
				variant: 'ghost',
				onClick: () => {}
			},
			{
				label: '确定',
				color: 'error',
				onClick: () => {
					try {
						interviewStore.endInterview()

						toast.add({
							title: '面试已结束',
							description: '正在生成评估报告...',
							color: 'info'
						})

						// 自动生成报告
						setTimeout(() => {
							handleComplete()
						}, 1500)
					} catch (error) {
						toast.add({
							title: '结束失败',
							description: error.message || '请稍后重试',
							color: 'error'
						})
					}
				}
			}
		]
	})
}
</script>
