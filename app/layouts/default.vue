<template>
	<UApp>
		<div class="min-h-screen flex flex-col">
			<AppHeader />
			<main class="flex-1">
				<slot />
			</main>
			<footer class="border-t border-gray-200 py-8 text-center text-sm text-neutral-500">
				<div class="container px-4">
					<p>© {{ new Date().getFullYear() }} 面试汪 · AI 面试平台</p>
				</div>
			</footer>
		</div>
	</UApp>
	</template>

<script setup>
</script>

<style scoped>
</style>


