<template>
	<div class="h-screen bg-slate-50 flex overflow-hidden font-sans">
		<!-- Sidebar -->
		<aside
			class="w-72 lg:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10"
		>
			<!-- Header -->
			<div class="p-6 pb-2">
				<div class="flex items-center gap-3 mb-6">
					<div
						class="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-200"
					>
						<UIcon name="i-heroicons-academic-cap" class="w-6 h-6" />
					</div>
					<div>
						<h1 class="font-bold text-slate-900 text-lg leading-tight">
							AI 模拟面试
						</h1>
						<p class="text-xs text-slate-500">Resume Wang Interview</p>
					</div>
				</div>

				<div class="px-1">
					<h2
						class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4"
					>
						面试流程
					</h2>
				</div>
			</div>

			<!-- Stepper -->
			<nav class="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
				<div
					v-for="(step, index) in steps"
					:key="step.id"
					class="relative pb-8 last:pb-0"
				>
					<!-- Connecting Line -->
					<div
						v-if="index !== steps.length - 1"
						class="absolute top-8 left-4 bottom-0 w-px bg-slate-100 -ml-0.5"
						:class="{ 'bg-primary-100': step.id < currentStep }"
					></div>

					<button
						class="group w-full text-left relative z-10 flex gap-4"
						:class="[
							step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'
						]"
						:disabled="step.id > currentStep"
						@click="navigateToStep(step.id)"
					>
						<!-- Icon/Number -->
						<div
							class="shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 bg-white"
							:class="[
								step.id === currentStep
									? 'border-primary-600 text-primary-600 shadow-md scale-110'
									: step.id < currentStep
									? 'border-primary-200 bg-primary-50 text-primary-600'
									: 'border-slate-200 text-slate-300'
							]"
						>
							<UIcon
								v-if="step.id < currentStep"
								name="i-heroicons-check"
								class="w-4 h-4"
							/>
							<span v-else>{{ step.id }}</span>
						</div>

						<!-- Content -->
						<div class="pt-1">
							<h3
								class="text-sm font-semibold transition-colors duration-200"
								:class="[
									step.id === currentStep
										? 'text-slate-900'
										: step.id < currentStep
										? 'text-slate-700'
										: 'text-slate-400'
								]"
							>
								{{ step.title }}
							</h3>
							<p
								class="text-xs mt-1 transition-colors duration-200 pr-2"
								:class="[
									step.id === currentStep ? 'text-slate-500' : 'text-slate-400'
								]"
							>
								{{ step.summary }}
							</p>
						</div>
					</button>
				</div>
			</nav>

			<!-- Bottom Tips -->
			<div class="p-4 mt-auto">
				<div
					class="rounded-xl bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white shadow-lg relative overflow-hidden group"
				>
					<!-- Decorative elements -->
					<div
						class="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:bg-white/10 transition-colors"
					></div>
					<div
						class="absolute bottom-0 left-0 w-20 h-20 bg-primary-500/20 rounded-full blur-xl transform -translate-x-8 translate-y-8"
					></div>

					<div class="relative z-10">
						<div class="flex items-center gap-2 mb-2 text-primary-300">
							<UIcon name="i-heroicons-light-bulb" class="w-4 h-4" />
							<span class="text-xs font-bold tracking-wider uppercase"
								>Tips</span
							>
						</div>
						<p class="text-sm font-medium leading-relaxed text-white/90">
							通过 AI 面试预演，提前暴露问题并快速迭代。
						</p>
						<div class="mt-3 flex flex-wrap gap-2">
							<span
								class="inline-flex items-center px-2 py-1 rounded bg-white/10 text-[10px] text-white/80 border border-white/10"
							>
								STAR 法则
							</span>
							<span
								class="inline-flex items-center px-2 py-1 rounded bg-white/10 text-[10px] text-white/80 border border-white/10"
							>
								结构化回答
							</span>
						</div>
					</div>
				</div>

				<!-- Footer Info -->
				<div
					class="mt-4 px-2 flex justify-between items-center text-[10px] text-slate-400"
				>
					<span>© Resume Wang</span>
					<span>v1.0.0</span>
				</div>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 min-w-0 bg-slate-50 flex flex-col h-full relative">
			<!-- Top Navigation / Status Bar (Optional, keeps layout clean) -->
			<header
				class="h-16 px-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm flex items-center justify-between shrink-0 sticky top-0 z-20"
			>
				<div class="flex items-center gap-2 text-slate-500 text-sm">
					<NuxtLink
						to="/"
						class="hover:text-primary-600 transition-colors flex items-center gap-1"
					>
						<UIcon name="i-heroicons-home" class="w-4 h-4" />
						首页
					</NuxtLink>
					<span class="text-slate-300">/</span>
					<span class="text-slate-900 font-medium">AI 模拟面试</span>
				</div>

				<div class="flex items-center gap-4">
					<!-- Could put user profile or settings here -->
					<div
						class="text-xs text-slate-400 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200"
					>
						<span
							class="w-2 h-2 rounded-full bg-green-500 animate-pulse"
						></span>
						AI 服务在线
					</div>
				</div>
			</header>

			<!-- Content Area -->
			<div class="flex-1 overflow-hidden relative w-full flex flex-col">
				<div class="flex-1 overflow-hidden px-4 py-6 lg:px-8 lg:py-8">
					<div class="max-w-[1600px] mx-auto h-full w-full">
						<Transition
							enter-active-class="transition duration-300 ease-out"
							enter-from-class="transform translate-y-4 opacity-0"
							enter-to-class="transform translate-y-0 opacity-100"
							leave-active-class="transition duration-200 ease-in"
							leave-from-class="transform translate-y-0 opacity-100"
							leave-to-class="transform translate-y-4 opacity-0"
							mode="out-in"
						>
							<component
								:is="currentStepComponent"
								class="h-full"
								@next="handleStep1Next"
								@complete="handleStep2Complete"
								@restart="handleRestart"
							/>
						</Transition>
					</div>
				</div>
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
	requiresAuth: true,
	layout: false // We are defining our own layout structure here
})

const interviewStore = useInterviewStore()

const steps = [
	{
		id: 1,
		title: '选择岗位与简历',
		summary: '定位目标岗位，导入简历'
	},
	{
		id: 2,
		title: '开始 AI 面试',
		summary: '实时对话，模拟真实场景'
	},
	{
		id: 3,
		title: '查看分析报告',
		summary: '多维度评估与提升计划'
	}
]

const currentStep = computed(() => interviewStore.currentStep)

const currentStepComponent = computed(() => {
	switch (currentStep.value) {
		case 1:
			return InterviewStep1
		case 2:
			return InterviewStep2
		case 3:
			return InterviewStep3
		default:
			return InterviewStep1
	}
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background: #cbd5e1;
	border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #94a3b8;
}
</style>
