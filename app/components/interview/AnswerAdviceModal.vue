<template>
	<div class="space-y-4">
		<div
			class="rounded-lg border border-gray-100 bg-gray-50 max-h-72 overflow-auto"
		>
			<pre
				class="text-sm leading-relaxed whitespace-pre-wrap text-neutral-700"
				>{{ markdown }}</pre
			>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	markdown: { type: String, required: true }
})
</script>

<style scoped></style>
