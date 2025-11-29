<template>
	<div class="h-full">
		<!-- input 输入 -->
		<StepInput
			v-if="step === 'input'"
			service-type="special"
			@submit="handleComplete"
		/>
		<!-- 专项面试 -->
		<StepInterview
			v-else-if="step === 'interview'"
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

// 步骤
const step = ref('input') // input | interview

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
				step.value = 'interview'
			}
		},
		buttons: [],
		preventClose: true
	})
}
</script>
