<template>
	<div class="h-full flex flex-col gap-6 w-full">
		<!-- 第一步：输入信息 -->
		<StepInput
			v-if="step === 'input'"
			service-type="resume"
			:is-processing="step === 'processing'"
			@submit="handlePredictClick"
		/>

		<!-- 第二步：进度条展示 -->
		<StepProgress
			v-if="step === 'progress'"
			ref="stepProgressRef"
			:current-progress-step="currentProgressStep"
			:unique-progress-steps="uniqueProgressSteps"
		/>

		<!-- 第三步：押题结果 -->
		<StepComplete
			v-if="step === 'complete'"
			:prediction-results="predictionResults"
			:prediction-summary="predictionSummary"
			@next-step="handleNextStep"
			@navigate-history="navigateTo('/history')"
		/>

		<!-- 第四步：押题失败 -->
		<StepError v-if="step === 'error'" />
	</div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch, nextTick, onMounted } from 'vue'
import { navigateTo } from '#imports'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'
import { serviceHighlights } from '@/constants/vip'
import { useInterviewStore } from '@/stores/interview'
import { useGlobalModal } from '@/composables/useGlobalModal'
import SpecialInterviewConfirm from '@/components/interview/SpecialInterviewConfirm.vue'
import { useUserStore } from '@/stores/user'
import {
	generateResumeQuizSSE,
	getInterviewResultDetailAPI
} from '@/api/interview'
import { useToast } from '#imports'
import { v4 as uuidv4 } from 'uuid'
import { useRoute } from 'vue-router'

// 导入新创建的步骤组件
import StepInput from '@/components/interview/resume-quiz/StepInput.vue'
import StepProgress from '@/components/interview/resume-quiz/StepProgress.vue'
import StepComplete from '@/components/interview/resume-quiz/StepComplete.vue'
import StepError from '@/components/interview/resume-quiz/StepError.vue'
import { MIN_JD_LENGTH, MAX_JD_LENGTH } from '../../constants'

// TODO：处理在押题过程中可能出现的其他问题，比如：用户刷新页面、点击了跳转其他页面的按钮 等

definePageMeta({
	requiresAuth: true,
	middleware: 'auth',
	layout: 'interview'
})
useHead({
	title: `简历押题 - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: 'AI 智能简历押题，精准预测面试问题'
		}
	]
})

const globalModal = useGlobalModal()
const interviewStore = useInterviewStore()
const toast = useToast()
// 确定当前为 第二步
interviewStore.currentStep = 2

const userStore = useUserStore()

// 会话 ID
let resultId = ''
// 状态管理
const step = ref('input') // input | progress | complete | error
const sseController = ref(null) // SSE 连接控制器

const resumeBalance = computed(
	() => userStore.userInfo?.resumeRemainingCount ?? 0
)

// 进度条配置
const currentProgressStep = ref({
	progress: 0,
	label: '正在解析岗位信息...',
	stage: 'prepare'
})
// 记录所有的进度步骤
const progressSteps = ref([])

// 计算去重后的步骤列表（只显示 label 不同的步骤）
const uniqueProgressSteps = computed(() => {
	const unique = []
	const seenLabels = new Set()

	for (const step of progressSteps.value) {
		if (!seenLabels.has(step.label)) {
			seenLabels.add(step.label)
			unique.push(step)
		}
	}

	return unique
})

// 进度步骤容器的引用（通过 StepProgress 组件暴露）
const stepProgressRef = ref(null)
const progressStepsContainer = computed(
	() => stepProgressRef.value?.progressStepsContainer
)

// 监听步骤变化，自动滚动到底部
watch(uniqueProgressSteps, async () => {
	await nextTick()
	const container = progressStepsContainer.value
	if (container) {
		container.scrollTop = container.scrollHeight
	}
})

// 预测结果数据
const predictionResults = ref([])
// 预测的总结
const predictionSummary = ref('')

// 难度映射
const difficultyMap = {
	hard: { label: '困难', color: 'error' },
	medium: { label: '中等', color: 'warning' },
	easy: { label: '简单', color: 'success' }
}

// 题目类型映射
const categoryMap = {
	project: '项目经验',
	technical: '技术深度',
	basic: '基础知识',
	scenario: '场景设计',
	algorithm: '算法数据结构',
	framework: '框架原理',
	performance: '性能优化',
	architecture: '系统架构',
	management: '团队管理',
	behavior: '行为面试',
	'problem-solving': '问题解决',
	'soft-skill': '软技能',
	other: '其他'
}

// 获取难度配置
const getDifficultyConfig = (difficulty) => {
	return difficultyMap[difficulty?.toLowerCase()] || difficultyMap.easy
}

// 获取类型名称
const getCategoryName = (category) => {
	if (!category) return '综合'
	return categoryMap[category?.toLowerCase()] || category
}

// 点击押题按钮
const handlePredictClick = () => {
	// 生成本次提交的唯一请求ID（用于幂等性控制）
	// 在用户确认前生成，确保同一次确认操作使用相同的 requestId
	const requestId = uuidv4()

	// 显示确认弹窗
	globalModal.showModal({
		title: '准备开始简历押题',
		description: '请确认以下信息后再开始押题流程',
		contentComponent: SpecialInterviewConfirm,
		contentProps: {
			serviceType: 'resume',
			remainingCount: resumeBalance.value,
			onConfirm: () => {
				// 验证是否有面试押题剩余次数
				if (resumeBalance.value < 1) {
					globalModal.closeModal()
					globalModal.showModal({
						title: '面试押题次数不足，请先充值',
						description: '当前剩余次数：' + resumeBalance.value,
						buttons: [
							{
								label: '去充值',
								onClick: () => {
									navigateTo('/profile')
								}
							}
						]
					})
					return
				}

				globalModal.closeModal()
				// 传递 requestId 到处理函数
				startPredictionProcess(requestId)
			}
		},
		buttons: [],
		preventClose: true
	})
}

// 开始预测流程
const startPredictionProcess = async (requestId) => {
	// 标记当前状态
	step.value = 'progress'
	// 初始化进度条
	currentProgressStep.value = {
		progress: 0,
		label: '正在准备...',
		stage: 'prepare'
	}
	// 初始化进度记录（清空数组）
	progressSteps.value = []
	// 初始化预测结果
	predictionResults.value = []
	// 初始化总结
	predictionSummary.value = ''

	// 准备请求参数
	const params = {
		resumeId: interviewStore.resumeId,
		resumeContent: interviewStore.resumeText,
		company: interviewStore.selectedPosition.company || '',
		positionName: interviewStore.selectedPosition.positionName || '',
		minSalary: interviewStore.selectedPosition.minSalary || '',
		maxSalary: interviewStore.selectedPosition.maxSalary || '',
		jd: interviewStore.selectedPosition.jd || '',
		requestId // 使用传入的 requestId（在确认时生成），确保幂等性
	}
	// 获取配置
	const config = useRuntimeConfig()

	// 启动 SSE 连接
	sseController.value = generateResumeQuizSSE(params, {
		token: userStore.token,
		baseURL: config.public.apiBase,
		callbacks: {
			onMessage: (data) => {
				console.log('SSE Message:', data)

				// 处理进度更新
				// 服务端返回格式：{"type":"progress","progress":0,"label":"📄 正在读取简历文档...","message":"📄 正在读取简历文档...","stage":"prepare"}
				if (data.type === 'progress') {
					// 更新当前进度
					currentProgressStep.value = {
						progress: data.progress || 0,
						label: data.label || data.message || '处理中...',
						stage: data.stage || 'processing'
					}
					// 记录所有进度步骤（后续会去重显示）
					progressSteps.value.push(currentProgressStep.value)
					// 确保状态为 progress
					step.value = 'progress'
				}
				// 处理题目数据
				else if (data.type === 'complete') {
					// 标记状态
					step.value = 'complete'
					// 获取当前会话的 ID
					resultId = data.data.resultId
					// 兼容旧结构，如果 data.data.questions 存在则使用它
					if (data.data?.questions) {
						predictionResults.value = data.data.questions.map((item) => ({
							...item,
							isOpen: true
						}))
					}
					// 总结
					if (data.data?.summary) {
						predictionSummary.value = data.data.summary
					}
				} else if (data.type === 'error') {
					console.error('SSE Error:', data.error)
					step.value = 'error'
					toast.add({
						title: '押题失败',
						description: data.error.message || '网络错误，请稍后重试',
						color: 'error'
					})
				}
			},
			onError: (error) => {
				step.value = 'error'
				console.error('SSE Error:', error)

				toast.add({
					title: '押题失败',
					description: error.message || '网络错误，请稍后重试',
					color: 'error'
				})
			}
		}
	})
}

// // 重新押题
// const handleRetry = () => {
// 	// 关闭现有的 SSE 连接
// 	if (sseController.value) {
// 		sseController.value.close()
// 		sseController.value = null
// 	}

// 	step.value = 'input'
// 	// 清空之前的结果
// 	predictionResults.value = []
// 	predictionSummary.value = ''
// 	// 重置进度
// 	currentProgressStep.value = {
// 		progress: 0,
// 		label: '正在准备...',
// 		stage: 'prepare'
// 	}
// 	progressSteps.value = []

// 	// 清空选择的所有内容
// 	interviewStore.reset()
// 	// 跳转到选择岗位页面
// 	navigateTo('/interview/start')
// }

const route = useRoute()
const { $api } = useNuxtApp()
onMounted(async () => {
	// 判断 url 中是否存在 resultId，如果存在则表示为 查看历史记录
	resultId = route.query.resultId
	if (resultId) {
		step.value = 'complete'
		// 根据 resultId 获取面试押题详情
		const res = await getInterviewResultDetailAPI($api, resultId)

		predictionResults.value = res.questions.map((item) => ({
			...item,
			isOpen: true
		}))
		predictionSummary.value = res.summary
	} else {
		step.value = 'input'
	}
})

// 组件卸载时清理 SSE 连接
onUnmounted(() => {
	if (sseController.value) {
		sseController.value.close()
		sseController.value = null
	}
})

// 下一步
const handleNextStep = () => {
	// 跳转到报告页面
	navigateTo(`/interview/report?resultId=${resultId}`)
}
</script>

<style scoped></style>
