<template>
	<div class="h-full">
		<InterviewStep3 @restart="handleRestart" />
	</div>
</template>

<script setup>
import { useInterviewStore } from '@/stores/interview'
import { navigateTo } from '#imports'
import InterviewStep3 from '@/components/interview/InterviewStep3.vue'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'

definePageMeta({
	requiresAuth: true,
	middleware: 'auth',
	layout: 'interview'
})

useHead({
	title: `面试报告 - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: '查看 AI 面试评估报告，获取多维度分析与提升建议'
		}
	]
})

const interviewStore = useInterviewStore()
// 确定当前为 第三步
interviewStore.currentStep = 3

const handleRestart = () => {
	interviewStore.reset()
	navigateTo('/interview/start')
}
</script>
