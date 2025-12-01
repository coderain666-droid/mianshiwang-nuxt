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
							@click="onGoHome"
							class="hover:text-primary-600 transition-colors flex items-center gap-1"
						>
							<UIcon name="i-heroicons-home" class="w-4 h-4" />
							首页
						</NuxtLink>
						<span class="text-slate-300">/</span>
						<NuxtLink
							@click="onGoStart"
							class="hover:text-primary-600 transition-colors flex items-center gap-1"
						>
							{{ route.query.resultId ? '服务记录' : '开始专项服务' }}
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
					<div class="flex-1 overflow-hidden px-4 py-2 lg:px-8 lg:py-2">
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
import { useRoute, navigateTo, useToast } from '#imports'
import { useInterviewStore } from '@/stores/interview'
import { useUserStore } from '@/stores/user'
import { SERVICE_TAGS, serviceHighlights } from '@/constants/vip'
import InterviewSidebar from '@/components/interview/InterviewSidebar.vue'
import { getUserInfoAPI } from '@/api/user'
import { isEmpty } from '@/utils'

const route = useRoute()
const toast = useToast()
const interviewStore = useInterviewStore()
const userStore = useUserStore()
const { $api } = useNuxtApp()

// 页面标题映射
const pageTitle = computed(() => {
	// 处理查看历史报告 标题展示
	if (route.query.resultId) {
		return '历史服务报告'
	}

	const titleMap = {
		'/interview/start': '选择岗位与简历',
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

	// 请求包含 resultId 时，表示为查看历史记录，不需要执行守卫
	if (route.query.resultId) {
		return
	}

	// 根据当前面试的状态，来决定后续跳转的逻辑。
	// 如果当前面试处于 进行中 ｜｜ 暂停中 的状态，则表示面试尚未结束，那么此时需要跳转到面试页面
	if (isInterviewing.value) {
		// 面试分为 专项面试 和 综合面试 两种，需要根据不同的状态进行跳转
		if (interviewStore.selectedService === SERVICE_TAGS.SPECIAL) {
			navigateTo('/interview/special')
		} else if (interviewStore.selectedService === SERVICE_TAGS.BEHAVIOR) {
			navigateTo('/interview/behavior')
		}
	}

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
		if (isEmpty(interviewStore.selectedPosition)) {
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

const isInterviewing = computed(() => {
	return (
		interviewStore.interviewStatus === 'starting' ||
		interviewStore.interviewStatus === 'in_progress' ||
		interviewStore.interviewStatus === 'suspend'
	)
})

const onGoHome = () => {
	if (isInterviewing.value) {
		toast.add({
			title: '温馨提示',
			description: '您当前正在面试中，请先完成面试后再进行切换',
			color: 'warning',
			icon: 'i-heroicons-lock-closed'
		})
		return
	}
	navigateTo('/')
}

const onGoStart = () => {
	if (isInterviewing.value) {
		toast.add({
			title: '温馨提示',
			description: '您当前正在面试中，请先完成面试后再进行切换',
			color: 'warning',
			icon: 'i-heroicons-lock-closed'
		})
		return
	}
	const targetPath = route.query.resultId ? '/history' : '/interview/start'
	navigateTo(targetPath)
}
</script>

<style scoped></style>
