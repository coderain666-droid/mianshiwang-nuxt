<template>
	<UApp>
		<div class="min-h-screen flex flex-col">
			<AppHeader />
			<main class="flex-1">
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
	</UApp>
</template>

<script setup>
// const toaster = { position: 'top-right' }
</script>

<style scoped></style>
