<template>
	<div class="h-full flex flex-col gap-6">
		<div
			class="grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 flex-1 min-h-0"
		>
			<!-- 左侧：对话区域（占2列） -->
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
					<div v-if="interviewStore.isStreaming" class="flex gap-4">
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
							<span class="text-xs text-gray-400 font-medium"
								>AI 思考中...</span
							>
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
							@keydown.enter.exact.prevent="handleSendMessage"
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

			<!-- 右侧：3D 数字人（占1列） -->
			<ThreeDDigitalPeople :interviewer-name="interviewerName" />
		</div>

		<!-- 倒计时遮罩 -->
		<div
			v-if="showCountdown"
			class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white"
		>
			<div class="text-9xl font-bold mb-12 animate-pulse text-primary-400">
				{{ countdown }}
			</div>
			<div class="text-3xl font-medium tracking-wider animate-bounce">
				请做好准备，面试即将开始
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { useUserStore } from '@/stores/user'
import { useToast } from '#imports'
import { useGlobalModal } from '@/composables/useGlobalModal'
import ThreeDDigitalPeople from '@/components/interview/3DDigitalPeople.vue'
import { startMockInterviewAPI } from '@/api/interview'

const emit = defineEmits(['complete', 'cancel'])

const interviewStore = useInterviewStore()
const userStore = useUserStore()
const toast = useToast()
const globalModal = useGlobalModal()

const showCountdown = ref(false)
const countdown = ref(5)

const inputMessage = ref('')
const messagesContainerRef = ref(null)
let closeMockInterview = null

const canSendMessage = computed(() => {
	return (
		interviewStore.interviewStatus === 'in_progress' &&
		!interviewStore.isStreaming.value
	)
})

// 滚动到底部
const scrollToBottom = () => {
	nextTick(() => {
		if (messagesContainerRef.value) {
			messagesContainerRef.value.scrollTop =
				messagesContainerRef.value.scrollHeight
		}
	})
}

// 监听消息变化，自动滚动
watch(
	interviewStore.messages,
	() => {
		scrollToBottom()
	},
	{ deep: true }
)

// 面试的链接 ID
const sessionId = ref(null)
// 面试官名称
const interviewerName = ref(null)
// 开始面试
const startInterview = async () => {
	try {
		// TODO: 调用 API 开始面试，返回关闭链接的 方法

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

					const { type } = data
					// 面试开始，包含开场白
					if (type === 'start') {
						sessionId.value = data.sessionId
						interviewerName.value = data.interviewerName
						interviewStore.messages.push({
							...data,
							role: 'interviewer'
						})
					}
					// 等待候选人回答
					else if (type === 'waiting') {
					}
					// 发生错误
					else if (type === 'error') {
					}
				},
				onError: (error) => {
					console.error('SSE Error:', error)

					toast.add({
						title: '面试启动失败',
						description: error.message || '网络错误，请稍后重试',
						color: 'error'
					})
				}
			}
		})
		closeMockInterview = close
		// 改变状态标记
		interviewStore.interviewStatus = 'in_progress'
	} catch (error) {
		toast.add({
			title: '启动失败',
			description: error.message || '请稍后重试',
			color: 'error'
		})
		interviewStore.interviewStatus = 'idle'
	}
}

// 连接 SSE 流式输出
const connectSSE = (interviewId) => {
	// 关闭旧的连接
	if (closeMockInterview) {
		closeMockInterview()
	}

	startInterview()
}

// 模拟流式输出
const simulateStreaming = (fullText) => {
	let index = 0
	interviewStore.addMessage('assistant', '')

	const interval = setInterval(() => {
		if (index < fullText.length) {
			const chunk = fullText.substring(0, index + 1)
			interviewStore.updateLastMessage(chunk)
			index++
			scrollToBottom()
		} else {
			clearInterval(interval)
			interviewStore.setStreaming(false)
		}
	}, 30) // 每 30ms 输出一个字符
}

// 发送消息
const handleSendMessage = async () => {
	if (!inputMessage.value.trim() || !canSendMessage.value) return

	const userMessage = inputMessage.value.trim()
	interviewStore.addMessage('user', userMessage)
	inputMessage.value = ''

	scrollToBottom()

	try {
		interviewStore.setStreaming(true)

		// TODO: 调用 API 发送消息
		// const response = await $api(`/interview/${interviewStore.interviewId}/message`, {
		// 	method: 'POST',
		// 	body: { message: userMessage }
		// })

		// 模拟 AI 回复
		setTimeout(() => {
			const aiResponse = `这是一个模拟的 AI 回复。在实际应用中，这里会通过 SSE 流式返回 AI 的回答。

你对这个问题有什么具体的经验或案例可以分享吗？`
			simulateStreaming(aiResponse)
		}, 500)
	} catch (error) {
		toast.add({
			title: '发送失败',
			description: error.message || '请稍后重试',
			color: 'error'
		})
		interviewStore.setStreaming(false)
	}
}

// 完成并查看报告
const handleComplete = async () => {
	// TODO: 调用 API 生成报告
	// const response = await $api(`/interview/${interviewStore.interviewId}/report`, {
	// 	method: 'GET'
	// })

	// 模拟报告数据
	const mockReport = {
		overall: {
			score: 85,
			level: '良好',
			summary: '整体表现良好，建议在技术深度方面进一步强化'
		},
		star: {
			score: 80,
			feedback: '能够使用 STAR 方法，但情境描述可以更具体'
		},
		skills: [
			{ name: '技术能力', score: 90 },
			{ name: '沟通表达', score: 85 },
			{ name: '逻辑思维', score: 80 },
			{ name: '项目经验', score: 75 }
		],
		risks: ['部分回答缺乏具体数据支撑', '对某些技术细节的理解不够深入'],
		suggestions: [
			'建议准备更多具体的项目案例和数据',
			'加强技术知识的系统化学习'
		]
	}

	const mockPlan = {
		days: Array.from({ length: 7 }, (_, i) => ({
			day: i + 1,
			date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
			tasks: [`第${i + 1}天的学习任务 1`, `第${i + 1}天的学习任务 2`]
		}))
	}

	interviewStore.setReport(mockReport, mockPlan)
	emit('complete')
}

const startCountdown = () => {
	showCountdown.value = true
	countdown.value = 5
	const timer = setInterval(() => {
		countdown.value--
		if (countdown.value <= 0) {
			clearInterval(timer)
			showCountdown.value = false
			startInterview()
		}
	}, 1000)
}

onMounted(() => {
	// 如果面试已开始，恢复 SSE 连接
	if (
		interviewStore.interviewId &&
		interviewStore.interviewStatus === 'in_progress'
	) {
		connectSSE(interviewStore.interviewId)
	}
	// 只有空闲状态才需要进行这样的提示
	if (interviewStore.interviewStatus === 'starting') {
		globalModal.showModal({
			title: '提示',
			description:
				'面试中请保持网络稳定，如遇网络波动导致面试中断，可刷新页面继续进行面试',
			content: '点击确定按钮，面试将在「5秒」后开始。点击取消按钮，返回上一步',
			dismissible: false,
			preventClose: true,
			close: false,
			buttons: [
				{
					label: '取消面试，返回上层',
					color: 'error',
					variant: 'ghost',
					onClick: () => {
						emit('cancel')
					}
				},
				{
					label: '我知道了，开始面试',
					color: 'success',
					onClick: () => {
						// 改变面试的状态标记
						interviewStore.interviewStatus = 'starting'
						// 开始倒计时
						startCountdown()
					}
				}
			]
		})
	}
})

onUnmounted(() => {
	// 清理 SSE 连接
	if (closeMockInterview) {
		closeMockInterview()
		closeMockInterview = null
	}
})

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
					// TODO：结束面试

					try {
						// TODO: 调用 API 结束面试
						// await $api(`/interview/${interviewStore.interviewId}/end`, {
						// 	method: 'POST'
						// })

						interviewStore.endInterview()

						// 关闭 SSE 连接
						if (closeMockInterview) {
							closeMockInterview()
							closeMockInterview = null
						}

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

<style scoped>
@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}
</style>
