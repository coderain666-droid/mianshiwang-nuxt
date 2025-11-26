<template>
	<div class="h-full">我是简历押题</div>
</template>

<script setup>
import { navigateTo } from '#imports'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'
import { serviceHighlights } from '@/constants/vip'
import { useInterviewStore } from '@/stores/interview'
import { onMounted, computed } from 'vue'
import { useGlobalModal } from '@/composables/useGlobalModal'
import SpecialInterviewConfirm from '@/components/interview/SpecialInterviewConfirm.vue'
import { useUserStore } from '@/stores/user'

definePageMeta({
	requiresAuth: true,
	middleware: 'auth',
	layout: 'interview'
})
useHead({
	title: `${serviceHighlights[0].title} - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: serviceHighlights[0].description
		}
	]
})

const globalModal = useGlobalModal()
const interviewStore = useInterviewStore()
// 确定当前为 第二步
interviewStore.currentStep = 2
const userStore = useUserStore()

const positionName = computed(
	() => interviewStore.selectedPosition?.name || '通用岗位'
)

const resumeBalance = computed(
	() => userStore.userInfo?.resumeRemainingCount ?? 0
)

onMounted(() => {
	globalModal.showModal({
		title: '准备开始简历押题',
		description: '请确认以下信息后再开始押题流程',
		contentComponent: SpecialInterviewConfirm,
		contentProps: {
			positionName: positionName.value,
			company: interviewStore.targetCompany,
			remainingCount: resumeBalance.value,
			onCompanyUpdate: () => {},
			onConfirm: () => {}
		},
		buttons: [],
		preventClose: true
	})
})

const handleComplete = () => {
	navigateTo('/interview/report')
}
</script>
