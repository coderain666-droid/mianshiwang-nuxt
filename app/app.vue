<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<!-- 全局登录提示弹窗 -->
	<AuthPromptModal />
</template>

<script setup>
import AuthPromptModal from '@/components/AuthPromptModal.vue'
</script>
