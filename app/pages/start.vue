<template>
	<div
		class="h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex flex-col overflow-hidden"
	>
		<header class="shrink-0 border-b border-white/40 bg-white/70 backdrop-blur">
			<div
				class="max-w-6xl mx-auto w-full px-6 py-4 flex items-center justify-between gap-6"
			>
				<div>
					<p class="text-xs font-semibold tracking-[0.3em] text-primary-500 mb-1">
						AI INTERVIEW LAB
					</p>
					<h1 class="text-2xl font-bold text-neutral-900 flex items-center gap-3">
						智能面试训练室
						<span
							class="hidden sm:inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700"
						>
							{{ currentStepInfo.title }}
						</span>
					</h1>
					<p class="text-sm text-neutral-500 mt-1">
						{{ currentStepInfo.description }}
					</p>
				</div>
				<div class="flex items-center gap-6 shrink-0">
					<div class="hidden md:flex flex-col items-end">
						<span class="text-xs text-gray-500">完成度</span>
						<div class="flex items-center gap-2">
							<div class="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
								<div
									class="h-full bg-primary-500 rounded-full transition-all"
									:style="{ width: `${progress}%` }"
								></div>
							</div>
							<span class="text-sm font-semibold text-neutral-900">
								{{ Math.round(progress) }}%
							</span>
						</div>
					</div>
					<UButton
						v-if="currentStep > 1"
						color="gray"
						variant="ghost"
						icon="i-heroicons-arrow-uturn-left"
						@click="handleRestart"
					>
						重置流程
					</UButton>
				</div>
			</div>
		</header>

		<main class="flex-1 overflow-hidden">
			<div
				class="max-w-6xl mx-auto h-full px-4 lg:px-6 py-4 lg:py-6 flex gap-6"
			>
				<aside
					class="hidden lg:flex w-72 h-full flex-col rounded-3xl border border-white/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden"
				>
					<div class="p-6 border-b border-gray-100">
						<p class="text-sm font-semibold text-neutral-900 mb-2">流程导航</p>
						<p class="text-sm text-neutral-500">
							保持专注，按照步骤完成即可开始面试
						</p>
					</div>
					<div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
						<div v-for="step in steps" :key="step.id" class="space-y-2">
							<button
								class="flex items-start gap-3 w-full text-left group"
								:class="[
									step.id <= currentStep
										? 'text-neutral-900'
										: 'text-neutral-400 pointer-events-none'
								]"
								@click="navigateToStep(step.id)"
							>
								<div
									:class="[
										'w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all',
										step.id === currentStep
											? 'bg-primary-600 text-white shadow-lg shadow-primary-500/40'
											: step.id < currentStep
												? 'bg-green-100 text-green-700'
												: 'bg-gray-100 text-gray-400'
									]"
								>
									<span v-if="step.id < currentStep">✓</span>
									<span v-else>{{ step.id }}</span>
								</div>
								<div>
									<div class="text-base font-semibold">{{ step.title }}</div>
									<p class="text-sm text-neutral-500 leading-relaxed">
										{{ step.summary }}
									</p>
								</div>
							</button>
							<div
								v-if="step.id !== steps.length"
								:class="[
									'h-10 w-px ml-5',
									step.id < currentStep ? 'bg-primary-200' : 'bg-gray-100'
								]"
							></div>
						</div>
					</div>
					<div class="p-6 bg-gradient-to-br from-primary-600 to-blue-600 text-white">
						<p class="text-sm uppercase tracking-[0.2em] mb-2 text-white/70">
							TIPS
						</p>
						<p class="text-lg font-semibold leading-snug">
							通过 AI 面试预演，提前暴露问题并快速迭代
						</p>
						<ul class="mt-3 space-y-2 text-sm text-white/80">
							<li>· 准备好典型项目案例</li>
							<li>· 构建结构化回答</li>
							<li>· 关注语速和逻辑</li>
						</ul>
					</div>
				</aside>

				<section
					class="flex-1 h-full rounded-3xl border border-white/60 bg-white/90 shadow-xl shadow-primary-100/70 p-3"
				>
					<div class="w-full h-full rounded-2xl bg-white border border-gray-100">
						<InterviewStep1
							v-if="currentStep === 1"
							class="h-full"
							@next="handleStep1Next"
						/>
						<InterviewStep2
							v-else-if="currentStep === 2"
							class="h-full"
							@complete="handleStep2Complete"
						/>
						<InterviewStep3
							v-else
							class="h-full"
							@restart="handleRestart"
						/>
					</div>
				</section>
			</div>
		</main>
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

const steps = [
	{
		id: 1,
		title: '选择岗位与简历',
		description: '挑选目标岗位并导入简历，生成个性化题库',
		summary: '快速定位岗位、上传或粘贴你的简历内容'
	},
	{
		id: 2,
		title: '开始 AI 面试',
		description: '与 AI 面试官实时对话，获得即时反馈',
		summary: '进入面试室，完成模拟问答并实时记录表现'
	},
	{
		id: 3,
		title: '查看分析报告',
		description: '获取多维度评估与 7 天强化计划',
		summary: '复盘表现、识别风险点并生成提升路径'
	}
]

const currentStep = computed(() => interviewStore.currentStep)

const currentStepInfo = computed(() => {
	return steps.find((step) => step.id === currentStep.value) ?? steps[0]
})

const progress = computed(() => {
	if (steps.length <= 1) return 100
	const ratio = (currentStep.value - 1) / (steps.length - 1)
	return Math.min(Math.max(ratio * 100, 0), 100)
})

const handleStep1Next = () => {
	interviewStore.setCurrentStep(2)
}

const handleStep2Complete = () => {
	interviewStore.setCurrentStep(3)
}

const handleRestart = () => {
	interviewStore.reset()
}

const navigateToStep = (targetStep) => {
	if (targetStep < currentStep.value) {
		interviewStore.setCurrentStep(targetStep)
	}
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

