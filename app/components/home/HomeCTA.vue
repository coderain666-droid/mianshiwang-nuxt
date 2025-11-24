<template>
	<section class="py-10 md:py-32 bg-white">
		<div class="container px-4">
			<div
				class="relative rounded-3xl overflow-hidden bg-neutral-900 px-6 py-16 sm:px-12 sm:py-20 lg:px-16"
			>
				<div class="relative mx-auto max-w-2xl text-center z-10">
					<h3 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
						准备好用 AI 提升你的面试胜率了吗？
					</h3>
					<p class="mx-auto mt-6 text-lg leading-8 text-neutral-300">
						现在开始免费试用，5 分钟内完成首次评估，获得个性化建议。
					</p>
					<div class="mt-10 flex items-center justify-center gap-x-6">
						<UButton
							size="xl"
							color="primary"
							to="/start"
							class="px-8 font-semibold shadow-lg shadow-primary-500/20"
							>免费开始</UButton
						>
						<UButton
							size="xl"
							color="white"
							variant="ghost"
							to="/contact"
							class="px-8 font-medium text-white hover:bg-white/10"
							>联系我们</UButton
						>
					</div>
				</div>
				<!-- Decorative gradients -->
				<div
					class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/50 rounded-full blur-3xl opacity-50"
				></div>
				<div
					class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-900/30 rounded-full blur-3xl opacity-50"
				></div>
			</div>
		</div>
	</section>
</template>

<script setup></script>

<style scoped></style>
