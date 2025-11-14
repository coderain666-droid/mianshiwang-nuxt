<template>
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-6">
			<h1 class="text-2xl font-bold text-neutral-900 mb-2">AI 模拟面试</h1>
			<p class="text-neutral-600">
				与 AI 面试官对话，展示你的专业能力和沟通技巧
			</p>
		</div>

		<div class="grid lg:grid-cols-3 gap-6">
			<!-- 左侧：对话区域（占2列） -->
			<div
				class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
				style="height: calc(100vh - 250px)"
			>
				<!-- 对话消息列表 -->
				<div
					ref="messagesContainerRef"
					class="flex-1 overflow-y-auto p-6 space-y-4"
				>
					<div
						v-if="messages.length === 0"
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
						v-for="(message, index) in messages"
						:key="index"
						:class="[
							'flex',
							message.role === 'user' ? 'justify-end' : 'justify-start'
						]"
					>
						<div
							:class="[
								'max-w-[80%] rounded-lg px-4 py-3',
								message.role === 'user'
									? 'bg-primary-600 text-white'
									: 'bg-gray-100 text-neutral-900'
							]"
						>
							<div
								class="whitespace-pre-wrap break-words"
								v-html="formatMessage(message.content)"
							></div>
						</div>
					</div>

					<!-- 正在输入指示器 -->
					<div v-if="isStreaming" class="flex justify-start">
						<div class="bg-gray-100 rounded-lg px-4 py-3">
							<div class="flex items-center gap-2">
								<div class="flex gap-1">
									<div
										class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style="animation-delay: 0s"
									></div>
									<div
										class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style="animation-delay: 0.2s"
									></div>
									<div
										class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style="animation-delay: 0.4s"
									></div>
								</div>
								<span class="text-sm text-gray-500">AI 正在输入...</span>
							</div>
						</div>
					</div>
				</div>

				<!-- 输入区域 -->
				<div class="border-t border-gray-200 p-4">
					<div class="flex gap-3">
						<UTextarea
							v-model="inputMessage"
							placeholder="输入你的回答..."
							rows="2"
							:disabled="!canSendMessage"
							class="flex-1"
							@keydown.enter.exact.prevent="handleSendMessage"
						/>
						<UButton
							color="primary"
							:disabled="!canSendMessage || !inputMessage.trim()"
							icon="i-heroicons-paper-airplane"
							@click="handleSendMessage"
						>
							发送
						</UButton>
					</div>
					<div
						class="flex items-center justify-between mt-2 text-xs text-neutral-500"
					>
						<span>按 Enter 发送，Shift + Enter 换行</span>
						<div class="flex items-center gap-4">
							<UButton
								v-if="interviewStatus === 'ended'"
								color="green"
								variant="ghost"
								size="sm"
								@click="handleComplete"
							>
								查看报告
							</UButton>
							<UButton
								v-else-if="
									interviewStatus === 'idle' || interviewStatus === 'starting'
								"
								color="primary"
								size="sm"
								:loading="interviewStatus === 'starting'"
								@click="startInterview"
							>
								开始面试
							</UButton>
							<UButton
								v-else
								color="red"
								variant="ghost"
								size="sm"
								@click="endInterview"
							>
								结束面试
							</UButton>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧：3D 数字人（占1列） -->
			<div
				class="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
				style="height: calc(100vh - 250px)"
			>
				<div class="p-4 border-b border-gray-200">
					<h3 class="font-semibold text-neutral-900">AI 面试官</h3>
					<p class="text-sm text-neutral-500 mt-1">
						{{ interviewStore.selectedPosition?.name || '面试官' }}
					</p>
				</div>

				<!-- 3D 数字人容器 -->
				<div
					class="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden"
				>
					<!-- 占位符：实际应该集成 3D 数字人（如 Ready Player Me、VRoid 等） -->
					<div class="text-center">
						<UIcon
							name="i-heroicons-user-circle"
							class="w-32 h-32 text-gray-300 mx-auto mb-4"
						/>
						<p class="text-sm text-neutral-500">3D 数字人</p>
						<p class="text-xs text-neutral-400 mt-1">正在倾听你的回答...</p>
					</div>

					<!-- 状态指示器 -->
					<div
						v-if="interviewStatus === 'in_progress'"
						class="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium"
					>
						<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						正在面试
					</div>
				</div>

				<!-- 底部提示 -->
				<div class="p-4 border-t border-gray-200 bg-gray-50">
					<div class="text-xs text-neutral-600 space-y-1">
						<p class="font-medium mb-2">面试提示：</p>
						<ul class="list-disc list-inside space-y-1 text-neutral-500">
							<li>清晰表达你的观点</li>
							<li>
                            使用
                            <UModal title="STAR 法则" description="结构化回答行为类面试题的方法">
                                <span class="cursor-pointer text-emerald-500 font-bold underline decoration-dotted">
                                    STAR
                                </span>
                                <template #body>
                                    <div class="space-y-3 text-sm text-neutral-700">
                                        <p>
                                            STAR 是回答行为类问题的通用框架，通过清晰的情境、任务、行动、结果来展示你的能力与影响力。
                                        </p>
                                        <ul class="list-disc list-inside space-y-1">
                                            <li>
                                                <span class="font-semibold text-neutral-900">S · Situation（情境）</span>：交代背景与环境，说明当时的场景与限制。
                                            </li>
                                            <li>
                                                <span class="font-semibold text-neutral-900">T · Task（任务）</span>：明确你的目标或职责，为何必须解决这个问题。
                                            </li>
                                            <li>
                                                <span class="font-semibold text-neutral-900">A · Action（行动）</span>：具体描述你采取了哪些措施、方法与思考过程。
                                            </li>
                                            <li>
                                                <span class="font-semibold text-neutral-900">R · Result（结果）</span>：量化成果与影响，总结复盘与经验。
                                            </li>
                                        </ul>
                                        <p class="text-xs text-neutral-500">
                                            小提示：尽量量化结果（如提升 30% 效率），并突出个人贡献与协作方式。
                                        </p>
                                    </div>
                                </template>
                            </UModal>
                            方法回答问题
							</li>
							<li>保持自信和积极的态度</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { useToast } from '#imports'

const emit = defineEmits(['complete'])

const interviewStore = useInterviewStore()
const toast = useToast()

const inputMessage = ref('')
const messagesContainerRef = ref(null)
const eventSource = ref(null)

const messages = computed(() => interviewStore.messages)
const isStreaming = computed(() => interviewStore.isStreaming)
const interviewStatus = computed(() => interviewStore.interviewStatus)
const canSendMessage = computed(() => {
	return interviewStatus.value === 'in_progress' && !isStreaming.value
})

// 格式化消息内容
const formatMessage = (content) => {
	if (!content) return ''
	// 将换行符转换为 <br>
	return content.replace(/\n/g, '<br>')
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

// 监听消息变化，自动滚动
watch(
	messages,
	() => {
		scrollToBottom()
	},
	{ deep: true }
)

// 开始面试
const startInterview = async () => {
	try {
		interviewStore.interviewStatus = 'starting'

		// TODO: 调用 API 开始面试
		// const response = await $api('/interview/start', {
		// 	method: 'POST',
		// 	body: {
		// 		positionId: interviewStore.selectedPosition.id,
		// 		resumeUrl: interviewStore.resumeUrl,
		// 		resumeText: interviewStore.resumeText
		// 	}
		// })

		// 模拟 API 响应
		const interviewId = `interview_${Date.now()}`
		interviewStore.startInterview(interviewId)

		// 开始 SSE 连接
		connectSSE(interviewId)

		toast.add({
			title: '面试开始',
			color: 'success'
		})
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
	if (eventSource.value) {
		eventSource.value.close()
	}

	// TODO: 实际 SSE 连接地址
	// const sseUrl = `/api/interview/${interviewId}/stream`

	// 模拟 SSE 连接（实际应使用 EventSource）
	// eventSource.value = new EventSource(sseUrl, {
	// 	withCredentials: true
	// })

	// 模拟流式输出（实际应从 SSE 接收数据）
	setTimeout(() => {
		const welcomeMessage = `你好！我是今天的 AI 面试官。我看到你申请的是 ${interviewStore.selectedPosition?.name} 岗位。让我们开始今天的面试吧。

首先，请你简单介绍一下自己，并说明为什么对这个岗位感兴趣？`

		interviewStore.setStreaming(true)
		simulateStreaming(welcomeMessage)
	}, 1000)

	// 实际 SSE 事件处理
	// eventSource.value.onmessage = (event) => {
	// 	const data = JSON.parse(event.data)
	// 	if (data.type === 'message') {
	// 		interviewStore.updateLastMessage(data.content)
	// 	} else if (data.type === 'done') {
	// 		interviewStore.setStreaming(false)
	// 	}
	// }

	// eventSource.value.onerror = (error) => {
	// 	console.error('SSE error:', error)
	// 	eventSource.value.close()
	// }
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

// 结束面试
const endInterview = async () => {
	try {
		// TODO: 调用 API 结束面试
		// await $api(`/interview/${interviewStore.interviewId}/end`, {
		// 	method: 'POST'
		// })

		interviewStore.endInterview()

		// 关闭 SSE 连接
		if (eventSource.value) {
			eventSource.value.close()
			eventSource.value = null
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

onMounted(() => {
	// 如果面试已开始，恢复 SSE 连接
	if (interviewStore.interviewId && interviewStatus.value === 'in_progress') {
		connectSSE(interviewStore.interviewId)
	}
})

onUnmounted(() => {
	// 清理 SSE 连接
	if (eventSource.value) {
		eventSource.value.close()
		eventSource.value = null
	}
})
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
