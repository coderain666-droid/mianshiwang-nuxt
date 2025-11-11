<template>
	<header
		class="w-full border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50"
	>
		<div class="container px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<ww-svg-icon name="hero" class="h-6 w-6 rounded"></ww-svg-icon>
				<NuxtLink to="/" class="font-semibold text-neutral-900"
					>面试汪</NuxtLink
				>
				<span
					class="hidden sm:inline-block text-xs text-neutral-500 translate-y-px"
					>AI 面试平台</span
				>
			</div>
			<nav class="hidden md:flex items-center gap-6 text-sm text-neutral-600">
				<NuxtLink
					to="/#features"
					class="hover:text-neutral-900 transition-colors"
					>功能</NuxtLink
				>
				<NuxtLink to="/#steps" class="hover:text-neutral-900 transition-colors"
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
				<UButton color="gray" variant="ghost" to="/login">登录</UButton>
				<UButton color="primary" to="/start">立即试用</UButton>
			</div>
		</div>
	</header>
</template>

<script setup></script>

<style scoped></style>
