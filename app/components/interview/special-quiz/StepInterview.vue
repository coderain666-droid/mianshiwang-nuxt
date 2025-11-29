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
			<div class="text-xs text-neutral-500 flex items-center gap-2">
				<UIcon name="i-heroicons-clock" class="w-4 h-4 text-primary-500" />
				平均面试时长 60 分钟
			</div>
		</div>

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
							<div
								class="whitespace-pre-wrap wrap-break-word"
								v-html="formatMessage(message.content)"
							></div>
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
								v-if="interviewStatus === 'ended'"
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
									interviewStatus === 'idle' || interviewStatus === 'starting'
								"
								color="primary"
								size="xs"
								variant="soft"
								:loading="interviewStatus === 'starting'"
								icon="i-heroicons-play"
								@click="startInterview"
							>
								开始面试
							</UButton>
							<UButton
								v-else
								color="red"
								variant="ghost"
								size="xs"
								icon="i-heroicons-stop"
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
				class="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-0 overflow-hidden"
			>
				<div
					class="p-5 border-b border-gray-100 flex items-center justify-between"
				>
					<div>
						<h3 class="font-bold text-neutral-900">AI 面试官</h3>
						<p class="text-xs text-neutral-500 mt-0.5">
							{{ interviewStore.selectedPosition?.name || '通用岗位' }}
						</p>
					</div>
					<div class="flex items-center gap-1.5">
						<span class="relative flex h-2.5 w-2.5">
							<span
								v-if="interviewStatus === 'in_progress'"
								class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
							></span>
							<span
								class="relative inline-flex rounded-full h-2.5 w-2.5"
								:class="
									interviewStatus === 'in_progress'
										? 'bg-green-500'
										: 'bg-gray-300'
								"
							></span>
						</span>
						<span
							class="text-xs font-medium"
							:class="
								interviewStatus === 'in_progress'
									? 'text-green-600'
									: 'text-neutral-400'
							"
						>
							{{ interviewStatus === 'in_progress' ? '在线' : '离线' }}
						</span>
					</div>
				</div>

				<!-- 3D 数字人容器 -->
				<div
					class="flex-1 flex items-center justify-center bg-linear-to-b from-gray-50 to-white relative overflow-hidden group"
				>
					<!-- 背景装饰 -->
					<div
						class="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-indigo-50/50 to-transparent"
					></div>

					<!-- 占位符：实际应该集成 3D 数字人 -->
					<div class="text-center relative z-10">
						<div class="relative inline-block">
							<div
								class="w-40 h-40 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-inner mb-6 mx-auto transform transition-transform duration-700 group-hover:scale-105"
							>
								<UIcon
									name="i-heroicons-user"
									class="w-20 h-20 text-indigo-300"
								/>
							</div>
							<!-- 语音波纹效果 (模拟) -->
							<div
								v-if="isStreaming"
								class="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8"
							>
								<div
									class="w-1 bg-indigo-400 rounded-full animate-pulse"
									style="height: 40%; animation-duration: 0.8s"
								></div>
								<div
									class="w-1 bg-indigo-400 rounded-full animate-pulse"
									style="height: 70%; animation-duration: 1.1s"
								></div>
								<div
									class="w-1 bg-indigo-400 rounded-full animate-pulse"
									style="height: 100%; animation-duration: 0.9s"
								></div>
								<div
									class="w-1 bg-indigo-400 rounded-full animate-pulse"
									style="height: 60%; animation-duration: 1.2s"
								></div>
								<div
									class="w-1 bg-indigo-400 rounded-full animate-pulse"
									style="height: 30%; animation-duration: 1s"
								></div>
							</div>
						</div>
						<h4 class="text-neutral-900 font-medium text-lg">数字面试官</h4>
						<p
							class="text-sm text-neutral-500 mt-2 max-w-[200px] mx-auto leading-relaxed"
						>
							{{
								isStreaming
									? '正在分析您的回答...'
									: interviewStatus === 'in_progress'
									? '正在倾听...'
									: '准备就绪'
							}}
						</p>
					</div>
				</div>

				<!-- 底部提示 -->
				<div class="p-5 border-t border-gray-100 bg-gray-50/50">
					<div class="space-y-3">
						<div
							class="flex items-center gap-2 text-neutral-800 font-medium text-sm"
						>
							<UIcon
								name="i-heroicons-light-bulb"
								class="w-4 h-4 text-amber-500"
							/>
							面试小贴士
						</div>
						<div
							class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-xs text-neutral-600 space-y-2"
						>
							<div class="flex gap-2 items-start">
								<span
									class="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"
								></span>
								<p>回答问题时请尽量清晰、有条理</p>
							</div>
							<div class="flex gap-2 items-start">
								<span
									class="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"
								></span>
								<p>
									推荐使用
									<StarMethodModal />
									法则来描述您的经历
								</p>
							</div>
							<div class="flex gap-2 items-start">
								<span
									class="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"
								></span>
								<p>保持自信，像真实的面试一样交流</p>
							</div>
						</div>
					</div>
				</div>
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
import SpecialInterviewConfirm from '@/components/interview/SpecialInterviewConfirm.vue'

const emit = defineEmits(['complete'])

const interviewStore = useInterviewStore()
const userStore = useUserStore()
const toast = useToast()
const globalModal = useGlobalModal()

const inputMessage = ref('')
const messagesContainerRef = ref(null)
const eventSource = ref(null)
const entryModalShown = ref(false)

const messages = computed(() => interviewStore.messages)
const isStreaming = computed(() => interviewStore.isStreaming)
const interviewStatus = computed(() => interviewStore.interviewStatus)
const positionName = computed(
	() => interviewStore.selectedPosition?.name || '通用岗位'
)
const statusMeta = computed(() => {
	const map = {
		idle: {
			label: '待开始',
			color: 'gray',
			description: '已完成岗位与简历选择，点击开始面试即可建立实时连接。'
		},
		starting: {
			label: '准备中',
			color: 'amber',
			description: 'AI 面试官正在唤醒，请保持网络稳定，稍后即可开始对话。'
		},
		in_progress: {
			label: '进行中',
			color: 'primary',
			description: 'AI 正在实时倾听你的回答，并根据内容生成追问与反馈。'
		},
		ended: {
			label: '已完成',
			color: 'green',
			description: '面试结束，点击查看报告即可获取表现分析与强化计划。'
		}
	}
	return map[interviewStatus.value] || map.idle
})
const resumeMeta = computed(() => {
	if (interviewStore.resumeText) {
		return {
			label: '简历解析完成',
			icon: 'i-heroicons-check-circle',
			textClass: 'text-green-600'
		}
	}
	if (interviewStore.resumeUrl) {
		return {
			label: '简历已上传',
			icon: 'i-heroicons-check-circle',
			textClass: 'text-emerald-500'
		}
	}
	return {
		label: '尚未上传简历',
		icon: 'i-heroicons-exclamation-triangle',
		textClass: 'text-amber-600'
	}
})
const conversationStats = computed(() => {
	const assistantMessages = messages.value.filter(
		(message) => message.role === 'assistant'
	)
	const userMessages = messages.value.filter(
		(message) => message.role === 'user'
	)

	const userAvgLength = userMessages.length
		? Math.round(
				userMessages.reduce((sum, msg) => sum + msg.content.length, 0) /
					userMessages.length
		  )
		: 0

	return {
		total: messages.value.length,
		assistantCount: assistantMessages.length,
		userCount: userMessages.length,
		userAvgLength
	}
})
const heroStats = computed(() => [
	{
		label: '对话轮次',
		value: conversationStats.value.total || 0,
		suffix: '轮',
		hint:
			conversationStats.value.total > 0
				? '保持稳定的问答节奏'
				: '开始面试即可记录每一轮'
	},
	{
		label: '候选人回答',
		value: conversationStats.value.userCount || 0,
		suffix: '次',
		hint:
			conversationStats.value.userCount > 0
				? '尽量覆盖项目与技能亮点'
				: '积极作答有助于 AI 深度评估'
	},
	{
		label: '平均回答长度',
		value:
			conversationStats.value.userCount > 0
				? conversationStats.value.userAvgLength
				: '--',
		suffix: conversationStats.value.userCount > 0 ? '字' : '',
		hint: '建议控制在 80-150 字之间'
	}
])
const canSendMessage = computed(() => {
	return interviewStatus.value === 'in_progress' && !isStreaming.value
})

const specialBalance = computed(
	() => userStore.userInfo?.specialRemainingCount ?? 0
)

const showEntryConfirmModal = () => {
	if (entryModalShown.value) return
	entryModalShown.value = true

	let controller = null

	const handleConfirm = () => {
		controller?.close('confirmed')
	}

	const handleCompanyUpdate = (value) => {
		interviewStore.setTargetCompany(value)
	}

	controller = globalModal.showModal({
		title: '准备开始专项面试',
		description: '请确认以下信息后再开始面试流程',
		contentComponent: SpecialInterviewConfirm,
		contentProps: {
			positionName: positionName.value,
			company: interviewStore.targetCompany,
			remainingCount: specialBalance.value,
			onCompanyUpdate: handleCompanyUpdate,
			onConfirm: handleConfirm
		},
		buttons: [],
		preventClose: true
	})
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

onMounted(() => {
	// 如果面试已开始，恢复 SSE 连接
	if (interviewStore.interviewId && interviewStatus.value === 'in_progress') {
		connectSSE(interviewStore.interviewId)
	} else {
		showEntryConfirmModal()
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
