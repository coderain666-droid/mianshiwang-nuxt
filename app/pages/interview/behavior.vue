<template>
	<div class="h-full">我是 HR 面试</div>
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

definePageMeta({
	requiresAuth: true,
	middleware: 'auth',
	layout: 'interview'
})

useHead({
	title: `${serviceHighlights[2].title} - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: serviceHighlights[2].description
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

const behaviorBalance = computed(
	() => userStore.userInfo?.behaviorRemainingCount ?? 0
)

onMounted(() => {
	globalModal.showModal({
		title: '准备开始综合面试',
		description: '请确认以下信息后再开始面试',
		contentComponent: SpecialInterviewConfirm,
		contentProps: {
			serviceType: 'behavior',
			positionName: positionName.value,
			company: interviewStore.targetCompany,
			remainingCount: behaviorBalance.value,
			onCompanyUpdate: (company) => {
				interviewStore.setTargetCompany(company)
			},
			onConfirm: () => {
				globalModal.closeModal()
				// TODO: 开始综合面试流程
				console.log('开始综合面试')
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
