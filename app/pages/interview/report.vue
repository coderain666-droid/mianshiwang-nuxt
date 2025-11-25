<template>
	<div class="h-full">
		<InterviewStep3 @restart="handleRestart" />
	</div>
</template>

<script setup>
import { onMounted } from 'vue'
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

const interviewStore = useInterviewStore()

// 检查是否已完成面试
onMounted(() => {
	// 如果没有报告数据，重定向回面试页面
	if (!interviewStore.report || !interviewStore.reportGenerated) {
		navigateTo('/interview/special')
		return
	}
})

const handleRestart = () => {
	interviewStore.reset()
	navigateTo('/interview/start')
}

useHead({
	title: `面试报告 - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: '查看 AI 面试评估报告，获取多维度分析与提升建议'
		}
	]
})
</script>
