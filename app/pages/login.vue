<template>
	<section class="h-screen relative overflow-hidden py-16 sm:py-20">
		<div
			class="pointer-events-none absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800"
		></div>
		<div class="absolute inset-x-0 top-24 flex justify-center blur-3xl">
			<div class="h-64 w-[480px] rounded-full bg-primary/20"></div>
		</div>

		<div class="relative">
			<div class="container">
				<div class="mb-12 flex items-center justify-between text-white/80">
					<NuxtLink
						to="/"
						class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
					>
						<UIcon name="i-heroicons-arrow-left" />
						返回面试汪
					</NuxtLink>
					<div
						class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs md:flex"
					>
						<UIcon name="i-heroicons-shield-check" class="text-emerald-300" />
						<span>微信官方授权 · 安全登录</span>
					</div>
				</div>
				<div
					class="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
				>
					<div class="flex flex-col gap-8">
						<LoginPitch />
						<LoginFlowCard />
					</div>
					<div class="relative">
						<div
							class="absolute -top-6 -left-8 hidden h-24 w-24 rounded-full border border-white/10 lg:block"
						></div>
						<div
							class="absolute -bottom-6 -right-6 hidden h-20 w-20 rounded-full border border-white/10 lg:block"
						></div>
						<LoginWeChatPanel
							@request-quick-login="handleQuickLogin"
							@refresh-qr="handleQrRefresh"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useHead, useSeoMeta, useToast } from '#imports'

definePageMeta({
	layout: 'auth'
})

useHead({
	title: '登录面试汪 - AI 面试平台',
	bodyAttrs: {
		class: 'bg-neutral-900'
	}
})

useSeoMeta({
	title: '登录面试汪 - AI 面试平台',
	description:
		'通过微信扫码或微信快速登录面试汪，继续你的 AI 模拟面试训练，获取针对岗位的实时反馈与结构化评估。'
})

const toast = useToast()

const handleQuickLogin = () => {
	toast.add({
		title: '已发起微信授权',
		description: '请在手机上确认授权，完成后将自动跳转回面试汪。',
		color: 'primary'
	})
}

const handleQrRefresh = () => {
	toast.add({
		title: '二维码已更新',
		description: '请使用微信「扫一扫」再次尝试登录。',
		color: 'primary'
	})
}
</script>

<style scoped></style>
