<template>
	<div class="h-full">
		<StepInput
			:selected-position="interviewStore.selectedPosition"
			service-type="special"
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
	navigateTo('/interview/report')
}
</script>
