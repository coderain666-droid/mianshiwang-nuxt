<template>
	<div class="h-full flex flex-col gap-6">
		<div
			class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
		>
			<div>
				<h1 class="text-2xl font-bold text-neutral-900">AI 模拟面试</h1>
				<p class="text-neutral-600 text-sm mt-1">
					与 AI 面试官实时对话，展示你的专业能力和沟通技巧
				</p>
			</div>
			<div class="flex items-center gap-4">
				<div class="text-xs text-neutral-500 flex items-center gap-2">
					<UIcon name="i-heroicons-clock" class="w-4 h-4 text-primary-500" />
					平均面试时长 10-15 分钟
				</div>
				<!-- 一键沉浸按钮 -->
				<UButton
					v-if="interviewStatus !== 'idle'"
					color="primary"
					variant="soft"
					size="sm"
					:icon="
						isImmersiveMode
							? 'i-heroicons-arrows-pointing-in'
							: 'i-heroicons-arrows-pointing-out'
					"
					@click="toggleImmersiveMode"
					class="immersive-btn"
				>
					{{ isImmersiveMode ? '退出沉浸' : '一键沉浸' }}
				</UButton>
			</div>
		</div>

		<!-- 沉浸模式遮罩 -->
		<Transition name="fade">
			<div
				v-if="isImmersiveMode"
				class="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10 backdrop-blur-sm z-40"
				@click="toggleImmersiveMode"
			></div>
		</Transition>

		<div
			:class="[
				'flex-1 min-h-0 transition-all duration-500 ease-in-out',
				isImmersiveMode
					? 'fixed inset-4 lg:inset-8 z-50 flex items-center justify-center'
					: 'grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6'
			]"
		>
			<!-- 左侧：对话区域（占2列） -->
			<div
				:class="[
					'bg-white rounded-2xl border shadow-sm flex flex-col min-h-0 transition-all duration-500',
					isImmersiveMode
						? 'w-full max-w-5xl h-full border-primary-200 shadow-2xl shadow-primary-500/20'
						: 'border-gray-200'
				]"
			>
				<!-- 沉浸模式指示器 -->
				<div
					v-if="isImmersiveMode"
					class="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-primary-500/10 backdrop-blur-md rounded-full border border-primary-300/30 flex items-center gap-2 text-sm text-primary-700 font-medium shadow-lg animate-fade-in"
				>
					<UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
					沉浸模式已开启
					<button
						@click.stop="toggleImmersiveMode"
						class="ml-2 text-xs text-primary-600 hover:text-primary-800 underline"
					>
						ESC 退出
					</button>
				</div>

				<!-- 对话消息列表 -->
				<div
					ref="messagesContainerRef"
					:class="[
						'flex-1 overflow-y-auto p-6 space-y-4',
						isImmersiveMode && 'pt-20'
					]"
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
								'rounded-lg px-4 py-3 transition-all duration-300',
								isImmersiveMode ? 'max-w-[85%]' : 'max-w-[80%]',
								message.role === 'user'
									? isImmersiveMode
										? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
										: 'bg-primary-600 text-white'
									: isImmersiveMode
									? 'bg-gray-100 text-neutral-900 shadow-md'
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
				<div
					:class="[
						'border-t p-4 transition-all duration-300',
						isImmersiveMode
							? 'border-primary-200/50 bg-gradient-to-t from-gray-50 to-transparent'
							: 'border-gray-200'
					]"
				>
					<div class="flex gap-3">
						<UTextarea
							v-model="inputMessage"
							:placeholder="
								isImmersiveMode
									? '沉浸式回答中... 专注表达你的想法'
									: '输入你的回答...'
							"
							:rows="isImmersiveMode ? 3 : 2"
							:disabled="!canSendMessage"
							class="flex-1 transition-all duration-300"
							@keydown.enter.exact.prevent="handleSendMessage"
						/>
						<UButton
							color="primary"
							:disabled="!canSendMessage || !inputMessage.trim()"
							icon="i-heroicons-paper-airplane"
							:size="isImmersiveMode ? 'lg' : 'md'"
							@click="handleSendMessage"
							:class="isImmersiveMode && 'shadow-lg'"
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

			<!-- 右侧：3D 数字人（占1列） - 沉浸模式下隐藏 -->
			<Transition name="slide-fade">
				<div
					v-if="!isImmersiveMode"
					class="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-0"
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
							<div
								class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
							></div>
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
									<StarMethodModal />
									法则回答问题
								</li>
								<li>保持自信和积极的态度</li>
							</ul>
						</div>
					</div>
				</div>
			</Transition>
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
const isImmersiveMode = ref(false)

const messages = computed(() => interviewStore.messages)
const isStreaming = computed(() => interviewStore.isStreaming)
const interviewStatus = computed(() => interviewStore.interviewStatus)
const canSendMessage = computed(() => {
	return interviewStatus.value === 'in_progress' && !isStreaming.value
})

// 切换沉浸模式
const toggleImmersiveMode = () => {
	isImmersiveMode.value = !isImmersiveMode.value

	// 沉浸模式下，滚动到最新消息
	if (isImmersiveMode.value) {
		nextTick(() => {
			scrollToBottom()
		})
	}
}

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

// ESC 键退出沉浸模式
const handleKeyDown = (event) => {
	if (event.key === 'Escape' && isImmersiveMode.value) {
		toggleImmersiveMode()
	}
}

onMounted(() => {
	// 如果面试已开始，恢复 SSE 连接
	if (interviewStore.interviewId && interviewStatus.value === 'in_progress') {
		connectSSE(interviewStore.interviewId)
	}

	// 监听键盘事件
	window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
	// 清理 SSE 连接
	if (eventSource.value) {
		eventSource.value.close()
		eventSource.value = null
	}

	// 移除键盘监听
	window.removeEventListener('keydown', handleKeyDown)
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

@keyframes fade-in {
	from {
		opacity: 0;
		transform: translate(-50%, -10px);
	}
	to {
		opacity: 1;
		transform: translate(-50%, 0);
	}
}

/* 沉浸模式按钮动画 */
.immersive-btn {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
}

.immersive-btn:hover {
	transform: scale(1.05);
}

.immersive-btn::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	transform: translate(-50%, -50%);
	transition: width 0.6s, height 0.6s;
}

.immersive-btn:hover::before {
	width: 300px;
	height: 300px;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* 滑动淡入淡出动画 */
.slide-fade-enter-active {
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from {
	transform: translateX(20px);
	opacity: 0;
}

.slide-fade-leave-to {
	transform: translateX(20px);
	opacity: 0;
}

/* 沉浸模式指示器动画 */
.animate-fade-in {
	animation: fade-in 0.5s ease-out;
}
</style>
