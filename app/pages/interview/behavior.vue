<template>
	<div class="h-full">
		<!-- input 输入 -->
		<StepInput
			v-if="interviewStore.interviewStatus === 'idle'"
			service-type="behavior"
			@submit="handleComplete"
		/>
		<!-- 专项面试 -->
		<StepInterview
			v-else-if="
				interviewStore.interviewStatus === 'starting' ||
				interviewStore.interviewStatus === 'in_progress' ||
				interviewStore.interviewStatus === 'suspend'
			"
			service-type="behavior"
			@endInterview="handleEndInterview"
		/>

		<StepComplete
			v-else
			service-type="behavior"
			:prediction-results="predictionResults"
			@next-step="handleNextStep"
			@navigate-history="navigateTo('/history')"
		/>
	</div>
</template>

<script setup>
import { navigateTo } from '#imports'
import { onMounted, computed } from 'vue'
import SpecialInterviewConfirm from '@/components/interview/SpecialInterviewConfirm.vue'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'
import { serviceHighlights } from '@/constants/vip'
import { useInterviewStore } from '@/stores/interview'
import { useUserStore } from '@/stores/user'
import { useGlobalModal } from '@/composables/useGlobalModal'
import StepInput from '@/components/interview/resume-quiz/StepInput.vue'
import StepInterview from '@/components/interview/special-quiz/StepInterview.vue'
import StepComplete from '@/components/interview/resume-quiz/StepComplete.vue'
import {
	getMockInterviewQAResultAPI,
	getAnalysisReportAPI
} from '@/api/interview'
import { useToast } from '#imports'
import { useRoute } from 'vue-router'

definePageMeta({
	requiresAuth: true,
	middleware: 'auth',
	layout: 'interview'
})

useHead({
	title: `${serviceHighlights[1].title} - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: serviceHighlights[1].description
		}
	]
})

const route = useRoute()
const toast = useToast()
const { $api } = useNuxtApp()
const globalModal = useGlobalModal()
const interviewStore = useInterviewStore()
// 确定当前为 第二步
interviewStore.currentStep = 2
const userStore = useUserStore()

const behaviorBalance = computed(
	() => userStore.userInfo?.behaviorRemainingCount ?? 0
)

onMounted(() => {
	// 如果包含 resultId，则请求下面试记录的接口
	const resultId = route.query.resultId
	if (resultId) {
		handleEndInterview(resultId)
	}
})

const handleComplete = () => {
	globalModal.showModal({
		title: '准备开始专项面试',
		description: '请确认以下信息后再开始面试流程',
		contentComponent: SpecialInterviewConfirm,
		contentProps: {
			serviceType: 'behavior',
			remainingCount: behaviorBalance.value,
			onConfirm: () => {
				globalModal.closeModal()
				// 开始专项面试流程
				interviewStore.interviewStatus = 'starting'
			}
		},
		buttons: [],
		preventClose: true
	})
}

// 初始化预测结果
const predictionResults = ref([])
// 初始化总结
// const predictionSummary = ref('')
const handleEndInterview = async (resultId) => {
	const res = await getMockInterviewQAResultAPI($api, resultId)
	predictionResults.value = res.questions
}

const handleNextStep = async (resultId) => {
	if (!resultId) {
		resultId = route.query.resultId
	}

	try {
		// 接口生成需要等待 1 ～ 2 分钟的时间
		await getAnalysisReportAPI($api, route.query.resultId)
		// 确定接口数据可以获取到之后，再进行跳转，否则给出提示
		navigateTo(`/interview/report?resultId=${resultId}`)
	} catch (error) {
		// toast.add({
		// 	title: '获取报告失败',
		// 	description: error.message,
		// 	color: 'warning'
		// })
	}
}
</script>
