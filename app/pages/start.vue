<template>
	<div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
		<!-- 步骤指示器 -->
		<div
			class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200"
		>
			<div class="container px-4 py-4">
				<div class="flex items-center justify-between max-w-4xl mx-auto">
					<!-- 步骤1 -->
					<div class="flex items-center justify-center gap-3 flex-1">
						<div
							:class="[
								'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
								currentStep >= 1
									? 'bg-primary-600 text-white'
									: 'bg-gray-200 text-gray-500'
							]"
						>
							<span v-if="currentStep > 1">✓</span>
							<span v-else>1</span>
						</div>
						<div class="hidden sm:block">
							<div
								:class="[
									'text-sm font-medium',
									currentStep >= 1 ? 'text-neutral-900' : 'text-gray-500'
								]"
							>
								选择岗位和简历
							</div>
						</div>
					</div>

					<!-- 连接线 -->
					<div
						:class="[
							'flex-1 h-0.5 mx-2 transition-colors',
							currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'
						]"
					></div>

					<!-- 步骤2 -->
					<div class="flex items-center justify-center gap-3 flex-1">
						<div
							:class="[
								'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
								currentStep >= 2
									? 'bg-primary-600 text-white'
									: 'bg-gray-200 text-gray-500'
							]"
						>
							<span v-if="currentStep > 2">✓</span>
							<span v-else>2</span>
						</div>
						<div class="hidden sm:block">
							<div
								:class="[
									'text-sm font-medium',
									currentStep >= 2 ? 'text-neutral-900' : 'text-gray-500'
								]"
							>
								开始面试
							</div>
						</div>
					</div>

					<!-- 连接线 -->
					<div
						:class="[
							'flex-1 h-0.5 mx-2 transition-colors',
							currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-200'
						]"
					></div>

					<!-- 步骤3 -->
					<div class="flex items-center justify-center gap-3 flex-1">
						<div
							:class="[
								'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
								currentStep >= 3
									? 'bg-primary-600 text-white'
									: 'bg-gray-200 text-gray-500'
							]"
						>
							3
						</div>
						<div class="hidden sm:block">
							<div
								:class="[
									'text-sm font-medium',
									currentStep >= 3 ? 'text-neutral-900' : 'text-gray-500'
								]"
							>
								查看报告
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 内容区域 -->
		<div class="container px-4 py-8">
			<!-- 步骤1：选择岗位和简历 -->
			<InterviewStep1 v-if="currentStep === 1" @next="handleStep1Next" />

			<!-- 步骤2：开始面试 -->
			<InterviewStep2
				v-else-if="currentStep === 2"
				@complete="handleStep2Complete"
			/>

			<!-- 步骤3：查看报告 -->
			<InterviewStep3 v-else-if="currentStep === 3" @restart="handleRestart" />
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import InterviewStep1 from '@/components/interview/InterviewStep1.vue'
import InterviewStep2 from '@/components/interview/InterviewStep2.vue'
import InterviewStep3 from '@/components/interview/InterviewStep3.vue'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'

definePageMeta({
	requiresAuth: true
})

const interviewStore = useInterviewStore()

const currentStep = computed(() => interviewStore.currentStep)

const handleStep1Next = () => {
	interviewStore.setCurrentStep(2)
}

const handleStep2Complete = () => {
	interviewStore.setCurrentStep(3)
}

const handleRestart = () => {
	interviewStore.reset()
}

useHead({
	title: `开始 AI 面试 - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: '开始你的 AI 面试训练，选择岗位、上传简历，开始模拟面试'
		}
	]
})
</script>

<style scoped></style>
