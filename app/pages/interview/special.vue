<template>
	<div class="h-full">
		<!-- input 输入 -->
		<StepInput
			v-if="interviewStore.interviewStatus === 'idle'"
			service-type="special"
			@submit="handleComplete"
		/>
		<!-- 专项面试 -->
		<StepInterview
			v-else-if="
				interviewStore.interviewStatus === 'starting' ||
				interviewStore.interviewStatus === 'in_progress' ||
				interviewStore.interviewStatus === 'suspend'
			"
			@cancel="handleCancel"
			@complete="handleComplete"
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
import { useToast } from '#imports'

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

const toast = useToast()
const globalModal = useGlobalModal()
const interviewStore = useInterviewStore()
// 确定当前为 第二步
interviewStore.currentStep = 2
const userStore = useUserStore()

const positionName = computed(
	() => interviewStore.selectedPosition?.name || '通用岗位'
)

const specialBalance = computed(
	() => userStore.userInfo?.specialRemainingCount ?? 0
)

onMounted(() => {})

const handleComplete = () => {
	globalModal.showModal({
		title: '准备开始专项面试',
		description: '请确认以下信息后再开始面试流程',
		contentComponent: SpecialInterviewConfirm,
		contentProps: {
			serviceType: 'special',
			remainingCount: specialBalance.value,
			onConfirm: () => {
				// 验证是否有专项面试剩余次数
				if (specialBalance.value < 1) {
					globalModal.closeModal()
					globalModal.showModal({
						title: '面试押题次数不足，请先充值',
						description: '当前剩余次数：' + specialBalance.value,
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
				// 开始专项面试流程
				interviewStore.interviewStatus = 'starting'
			}
		},
		buttons: [],
		preventClose: true
	})
}

const handleCancel = () => {
	interviewStore.interviewStatus = 'idle'

	toast.add({
		title: '面试已取消',
		description: '面试次数已返还至账户',
		color: 'error'
	})
}
</script>
