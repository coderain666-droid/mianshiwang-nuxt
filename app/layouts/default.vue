<template>
	<UApp :toaster="toaster">
		<div class="min-h-screen flex flex-col">
			<AppHeader />
			<main class="flex-1 bg-gray-50">
				<slot />
			</main>
			<footer
				class="border-t border-gray-200 py-8 text-center text-sm text-neutral-500"
			>
				<div class="container px-4">
					<p>© {{ new Date().getFullYear() }} 面试汪 · AI 面试平台</p>
					<p class="mt-2">
						<a
							href="https://beian.miit.gov.cn/"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-neutral-700"
						>
							鲁 ICP 备 18025459 号-1
						</a>
					</p>
				</div>
			</footer>
			<BackToTop />
		</div>

		<UModal
			v-model:open="uiStore.authPromptOpen"
			title="请先登录"
			description="该功能需要登录后才能访问"
			prevent-close
			:ui="{ content: 'max-w-md' }"
		>
			<template #body>
				<p class="text-sm text-gray-600 leading-relaxed">
					为了保护账户数据与安全，请先登录账号，再访问该页面。
				</p>
			</template>
			<template #footer>
				<div class="flex justify-end gap-2">
					<UButton color="gray" variant="ghost" @click="handleAuthCancel">
						返回首页
					</UButton>
					<UButton
						color="primary"
						class="text-white"
						@click="handleAuthConfirm"
					>
						立即登录
					</UButton>
				</div>
			</template>
		</UModal>
	</UApp>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { navigateTo } from '#imports'

const toaster = { position: 'top-right' }
const uiStore = useUIStore()

const handleAuthConfirm = () => {
	const redirect = uiStore.authRedirectPath || '/'
	uiStore.hideAuthPrompt()
	navigateTo({
		path: '/login',
		query: { redirect }
	})
}

const handleAuthCancel = () => {
	uiStore.hideAuthPrompt()
	navigateTo('/')
}
</script>

<style scoped></style>
