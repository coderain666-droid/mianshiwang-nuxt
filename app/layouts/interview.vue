<template>
	<UApp :toaster="{ position: 'top-right' }">
		<div class="h-screen bg-slate-50 flex overflow-hidden font-sans">
			<!-- Sidebar -->
			<InterviewSidebar />
			<!-- Main Content -->
			<main class="flex-1 min-w-0 bg-slate-50 flex flex-col h-full relative">
				<!-- Top Navigation / Status Bar -->
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
						<NuxtLink
							to="/interview/start"
							class="hover:text-primary-600 transition-colors flex items-center gap-1"
						>
							开始专项服务
						</NuxtLink>
						<span class="text-slate-300">/</span>
						<span class="text-slate-900 font-medium">{{ pageTitle }}</span>
					</div>

					<div class="flex items-center gap-4">
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
							<slot />
						</div>
					</div>
				</div>
			</main>
		</div>
	</UApp>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, navigateTo } from '#imports'
import { useInterviewStore } from '@/stores/interview'
import { useUserStore } from '@/stores/user'
import { SERVICE_TAGS, serviceHighlights } from '@/constants/vip'
import InterviewSidebar from '@/components/interview/InterviewSidebar.vue'
import { getUserInfoAPI } from '@/api/user'

const route = useRoute()
const interviewStore = useInterviewStore()
const userStore = useUserStore()
const { $api } = useNuxtApp()

// 页面标题映射
const pageTitle = computed(() => {
	const titleMap = {
		'/interview/resume': serviceHighlights[0].title,
		'/interview/special': serviceHighlights[1].title,
		'/interview/behavior': serviceHighlights[2].title,
		'/interview/report': '面试报告'
	}
	return titleMap[route.path] || '面试'
})

// 服务路径与服务类型的映射
const serviceRouteMap = {
	'/interview/special': SERVICE_TAGS.SPECIAL,
	'/interview/resume': SERVICE_TAGS.RESUME,
	'/interview/behavior': SERVICE_TAGS.BEHAVIOR
}

// 获取用户信息
const fetchUserInfo = async () => {
	try {
		const userInfo = await getUserInfoAPI($api)
		userStore.updateUserInfo(userInfo)
		console.log('用户信息已更新:', userInfo)
	} catch (error) {
		console.error('获取用户信息失败:', error)
	}
}

// 统一的路由守卫逻辑
onMounted(() => {
	const currentPath = route.path

	// 获取用户信息
	fetchUserInfo()

	// 报告页面守卫
	if (currentPath === '/interview/report') {
		// 检查是否已生成报告
		if (!interviewStore.report || !interviewStore.reportGenerated) {
			// 根据当前选择的服务跳转到对应的面试页面
			const serviceTypeMap = {
				[SERVICE_TAGS.SPECIAL]: '/interview/special',
				[SERVICE_TAGS.RESUME]: '/interview/resume',
				[SERVICE_TAGS.BEHAVIOR]: '/interview/behavior'
			}
			const targetPath =
				serviceTypeMap[interviewStore.selectedService] || '/interview/start'
			navigateTo(targetPath)
			return
		}
	}

	// 服务页面守卫（special/resume/behavior）
	const requiredService = serviceRouteMap[currentPath]
	if (requiredService) {
		// 检查是否已选择岗位
		if (!interviewStore.selectedPosition) {
			navigateTo('/interview/start')
			return
		}

		// 检查服务类型是否匹配
		if (interviewStore.selectedService !== requiredService) {
			navigateTo('/interview/start')
			return
		}
	}
})

// 监听路由变化，每次跳转都获取用户信息
watch(
	() => route.path,
	(newPath, oldPath) => {
		// 只在 interview 路径下的跳转才获取
		if (newPath.startsWith('/interview/') && newPath !== oldPath) {
			console.log(`路由从 ${oldPath} 跳转到 ${newPath}，获取用户信息`)
			fetchUserInfo()
		}
	}
)
</script>

<style scoped></style>
