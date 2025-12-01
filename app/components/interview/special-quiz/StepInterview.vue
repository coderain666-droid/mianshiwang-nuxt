<template>
	<div class="h-full flex flex-col gap-6">
		<div
			class="grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 flex-1 min-h-0"
		>
			<!-- 左侧：对话区域（占2列） -->
			<AIDialogue />

			<!-- 右侧：3D 数字人（占1列） -->
			<ThreeDDigitalPeople />
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
import { ref, watch, onMounted } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { useGlobalModal } from '@/composables/useGlobalModal'
import ThreeDDigitalPeople from '@/components/interview/3DDigitalPeople.vue'
import AIDialogue from '@/components/interview/AIDialogue.vue'

const emit = defineEmits(['complete', 'cancel'])

const interviewStore = useInterviewStore()

const globalModal = useGlobalModal()

const showCountdown = ref(false)
const countdown = ref(5)

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
