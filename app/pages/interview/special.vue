<template>
	<div class="h-full">
		<InterviewStep2 @complete="handleComplete" />
	</div>
</template>

<script setup>
import { navigateTo } from '#imports'
import { onMounted, computed } from 'vue'
import InterviewStep2 from '@/components/interview/InterviewStep2.vue'
import SpecialInterviewConfirm from '@/components/interview/SpecialInterviewConfirm.vue'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'
import { serviceHighlights } from '@/constants/vip'
import { useInterviewStore } from '@/stores/interview'
import { useUserStore } from '@/stores/user'
import { useGlobalModal } from '@/composables/useGlobalModal'

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

const globalModal = useGlobalModal()
const interviewStore = useInterviewStore()
const userStore = useUserStore()

// 确定当前为 第二步
interviewStore.currentStep = 2

const positionName = computed(
	() => interviewStore.selectedPosition?.name || '通用岗位'
)

const specialBalance = computed(
	() => userStore.userInfo?.specialRemainingCount ?? 0
)

onMounted(() => {
	globalModal.showModal({
		title: '准备开始专项面试',
		description: '请确认以下信息后再开始面试',
		contentComponent: SpecialInterviewConfirm,
		contentProps: {
			serviceType: 'special',
			positionName: positionName.value,
			company: interviewStore.targetCompany,
			remainingCount: specialBalance.value,
			onCompanyUpdate: (company) => {
				interviewStore.setTargetCompany(company)
			},
			onConfirm: () => {
				globalModal.closeModal()
				// TODO: 开始专项面试流程
				console.log('开始专项面试')
			}
		},
		buttons: [],
		preventClose: true
	})
})

const handleComplete = () => {
	navigateTo('/interview/report')
}
</script>
