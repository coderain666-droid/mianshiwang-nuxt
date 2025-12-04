<template>
	<NuxtLayout>
		<NuxtPage />
		<FeedbackButton />
	</NuxtLayout>
	<!-- 全局登录提示弹窗 -->
	<AuthPromptModal />
</template>

<script setup>
import AuthPromptModal from '@/components/AuthPromptModal.vue'
import FeedbackButton from '@/components/feedback-button.vue'
import { useRoute } from '#imports'

const route = useRoute()

console.log('route~~~~~~')
</script>
