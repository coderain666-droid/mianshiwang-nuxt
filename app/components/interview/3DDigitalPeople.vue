<template>
	<div
		class="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-0 overflow-hidden"
	>
		<div class="p-5 border-b border-gray-100 flex items-center justify-between">
			<div>
				<h3 class="font-bold text-neutral-900">AI 面试官</h3>
				<p class="text-xs text-neutral-500 mt-0.5">
					{{ interviewStore.selectedPosition?.positionName || '通用岗位' }}
				</p>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="relative flex h-2.5 w-2.5">
					<span
						v-if="interviewStore.interviewStatus === 'in_progress'"
						class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
					></span>
					<span
						class="relative inline-flex rounded-full h-2.5 w-2.5"
						:class="
							interviewStore.interviewStatus === 'in_progress'
								? 'bg-green-500'
								: 'bg-gray-300'
						"
					></span>
				</span>
				<span
					class="text-xs font-medium"
					:class="
						interviewStore.interviewStatus === 'in_progress'
							? 'text-green-600'
							: 'text-neutral-400'
					"
				>
					{{
						interviewStore.interviewStatus === 'in_progress' ? '在线' : '离线'
					}}
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
						<UIcon name="i-heroicons-user" class="w-20 h-20 text-indigo-300" />
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
						interviewStore.isStreaming
							? '正在分析您的回答...'
							: interviewStore.interviewStatus === 'in_progress'
							? '正在倾听...'
							: '准备就绪'
					}}
				</p>
			</div>
		</div>

		<!-- 底部提示 -->
		<InterviewTip :range-time="60" />
	</div>
</template>

<script setup>
import InterviewTip from '@/components/interview/interviewTip.vue'
import { useInterviewStore } from '@/stores/interview'

const interviewStore = useInterviewStore()

// const statusMeta = computed(() => {
// 	const map = {
// 		idle: {
// 			step: 0,
// 			label: '待开始',
// 			color: 'gray',
// 			description: '已完成岗位与简历选择，点击开始面试即可建立实时连接。'
// 		},
// 		starting: {
// 			step: 1,
// 			label: '准备中',
// 			color: 'amber',
// 			description: 'AI 面试官正在唤醒，请保持网络稳定，稍后即可开始对话。'
// 		},
// 		in_progress: {
// 			step: 2,
// 			label: '进行中',
// 			color: 'primary',
// 			description: 'AI 正在实时倾听你的回答，并根据内容生成追问与反馈。'
// 		},
// 		suspended: {
// 			step: 3,
// 			label: '已暂停',
// 			color: 'warning',
// 			description: '面试已暂停，点击「继续面试」即可恢复。'
// 		},
// 		ended: {
// 			step: 4,
// 			label: '已完成',
// 			color: 'green',
// 			description: '面试结束，点击查看报告即可获取表现分析与强化计划。'
// 		}
// 	}
// 	return map[interviewStore.interviewStatus] || map.idle
// })
// const conversationStats = computed(() => {
// 	const assistantMessages = messages.value.filter(
// 		(message) => message.role === 'assistant'
// 	)
// 	const userMessages = messages.value.filter(
// 		(message) => message.role === 'user'
// 	)

// 	const userAvgLength = userMessages.length
// 		? Math.round(
// 				userMessages.reduce((sum, msg) => sum + msg.content.length, 0) /
// 					userMessages.length
// 		  )
// 		: 0

// 	return {
// 		total: messages.value.length,
// 		assistantCount: assistantMessages.length,
// 		userCount: userMessages.length,
// 		userAvgLength
// 	}
// })
</script>
