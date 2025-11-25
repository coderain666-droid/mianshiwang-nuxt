<template>
	<div class="h-full">我是 HR 面试</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { navigateTo } from '#imports'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'
import { SERVICE_TAGS, serviceHighlights } from '@/constants/vip'

definePageMeta({
	requiresAuth: true,
	middleware: 'auth',
	layout: 'interview'
})

const interviewStore = useInterviewStore()

// 检查是否已选择岗位和简历
onMounted(() => {
	// 如果没有选择岗位，重定向回 /start
	if (!interviewStore.selectedPosition) {
		navigateTo('/interview/start')
		return
	}

	// 如果选择的服务不是，重定向回 /start
	if (interviewStore.selectedService !== SERVICE_TAGS.BEHAVIOR) {
		navigateTo('/interview/start')
		return
	}
})

const handleComplete = () => {
	navigateTo('/interview/report')
}

useHead({
	title: `${serviceHighlights[2].title} - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: serviceHighlights[2].description
		}
	]
})
</script>
