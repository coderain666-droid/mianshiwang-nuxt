<template>
	<div class="h-full">
		<InterviewStep2 @complete="handleComplete" />
	</div>
</template>

<script setup>
import { navigateTo } from '#imports'
import InterviewStep2 from '@/components/interview/InterviewStep2.vue'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'
import { serviceHighlights } from '@/constants/vip'
import { useInterviewStore } from '@/stores/interview'
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

const interviewStore = useInterviewStore()
// 确定当前为 第二步
interviewStore.currentStep = 2

const handleComplete = () => {
	navigateTo('/interview/report')
}
</script>
