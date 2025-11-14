<template>
	<header
		:class="[
			'w-full sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50',
			scrolled ? 'shadow-sm bg-white/80 backdrop-blur' : ''
		]"
	>
		<div class="container px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<ww-svg-icon name="hero" class="h-6 w-6"></ww-svg-icon>
				<NuxtLink to="/" class="font-semibold text-neutral-900"
					>面试汪</NuxtLink
				>
				<span
					class="hidden sm:inline-block text-xs text-neutral-500 translate-y-px"
					>AI 面试平台</span
				>
			</div>
			<nav class="hidden md:flex items-center gap-6 text-sm text-neutral-600">
				<!-- 在新的标签页打开 -->
				<NuxtLink
					to="https://resume.lgdsunday.club/"
					class="hover:text-neutral-900 transition-colors"
					target="_blank"
					>简历制作</NuxtLink
				>
				<NuxtLink
					to="/#features"
					:class="[
						'transition-colors',
						activeNav === 'features'
							? 'text-neutral-900 font-bold'
							: 'hover:text-neutral-900'
					]"
					>功能</NuxtLink
				>
				<NuxtLink
					to="/#steps"
					:class="[
						'transition-colors',
						activeNav === 'steps'
							? 'text-neutral-900 font-bold'
							: 'hover:text-neutral-900'
					]"
					>流程</NuxtLink
				>
				<NuxtLink to="/#faq" class="hover:text-neutral-900 transition-colors"
					>FAQ</NuxtLink
				>
				<NuxtLink
					to="/#contact"
					class="hover:text-neutral-900 transition-colors"
					>联系我们</NuxtLink
				>
			</nav>
			<div class="flex items-center gap-2">
				<template v-if="!userStore.isLogin">
					<UButton color="gray" variant="ghost" to="/login">登录</UButton>
				</template>
				<template v-else>
					<UDropdownMenu
						:items="userMenuItems"
						mode="hover"
						:popper="{ placement: 'bottom-end' }"
					>
						<UButton color="gray" variant="ghost">
							<UAvatar :src="interviewAvatar" size="sm" class="mr-2" />
							{{ userStore.userInfo.username || '未命名用户' }}
							<UIcon name="i-heroicons-chevron-down-20-solid" class="ml-1" />
						</UButton>
					</UDropdownMenu>
				</template>
				<UButton color="primary" class="text-white" to="/start"
					>立即试用</UButton
				>
			</div>
		</div>
	</header>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import interviewAvatar from '@/assets/imgs/interview.png'

const userStore = useUserStore()

const userMenuItems = [
	[{ label: '个人中心', icon: 'i-heroicons-user', to: '/profile' }],
	[
		{
			label: '退出登录',
			icon: 'i-heroicons-arrow-left-on-rectangle',
			click: () => userStore.logout()
		}
	]
]

const scrolled = ref(false)
const activeNav = ref(null)

onMounted(() => {
	// 头部滚动阴影
	const onScroll = () => {
		scrolled.value = window.scrollY > 8
	}
	onScroll()
	window.addEventListener('scroll', onScroll, { passive: true })

	// 滚动高亮逻辑（首页锚点）
	let observer = null
	const features = document.getElementById('features')
	const steps = document.getElementById('steps')
	const targets = [features, steps].filter(Boolean)
	if (targets.length) {
		observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort(
						(a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
					)[0]
				if (visible) {
					const id = visible.target.id
					if (id === 'features') activeNav.value = 'features'
					else if (id === 'steps') activeNav.value = 'steps'
				}
			},
			{ rootMargin: '0px 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
		)
		if (observer) targets.forEach((t) => observer.observe(t))
	}

	onUnmounted(() => {
		window.removeEventListener('scroll', onScroll)
		if (observer) observer.disconnect()
	})
})
</script>

<style scoped></style>
