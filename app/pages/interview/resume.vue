<template>
	<div class="h-full">我是简历押题</div>
</template>

<script setup>
import { navigateTo } from '#imports'
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
	title: `${serviceHighlights[0].title} - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: serviceHighlights[0].description
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
