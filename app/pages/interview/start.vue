<template>
	<div class="h-screen bg-slate-50 flex overflow-hidden font-sans">
		<!-- Sidebar -->
		<InterviewSidebar />

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
						<InterviewStep1 class="h-full" />
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup>
import InterviewStep1 from '@/components/interview/InterviewStep1.vue'
import InterviewSidebar from '@/components/interview/InterviewSidebar.vue'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'

definePageMeta({
	requiresAuth: true,
	middleware: 'auth',
	layout: false // We are defining our own layout structure here
})

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
