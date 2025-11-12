<template>
	<section class="relative overflow-hidden">
		<div class="absolute inset-0 pointer-events-none">
			<div
				class="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
			></div>
			<div
				class="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
			></div>
		</div>
		<div class="container px-4 py-16 md:py-24 relative">
			<div class="grid md:grid-cols-2 gap-10 items-center">
				<div>
					<div
						class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs text-neutral-600"
					>
						<span class="h-2 w-2 rounded-full bg-emerald-500"></span>
						支持多职业 · 实时评估 · 技能画像
					</div>
					<h1
						class="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-neutral-900"
					>
						用 AI 精准模拟面试<br class="hidden md:block" />
						为任何职业做好万全准备
					</h1>
					<p class="mt-5 text-neutral-600 md:text-lg">
						面试汪结合行业知识库与多轮对话引擎，生成贴合岗位的深度面试场景，
						并给出结构化反馈与提升建议，让你用更少时间拿到更好结果。
					</p>
					<div class="mt-7 flex flex-col sm:flex-row gap-3">
						<UButton size="lg" color="primary" to="/start" class="text-white"
							>开始一场模拟面试</UButton
						>
						<UButton size="lg" color="gray" variant="ghost" to="/#features"
							>看看它如何工作</UButton
						>
					</div>
					<div class="mt-6 flex items-center gap-6 text-xs text-neutral-500">
						<div class="flex items-center gap-2">
							<UIcon name="i-heroicons-sparkles" class="text-emerald-500" />
							生成岗位级题库
						</div>
						<div class="flex items-center gap-2">
							<UIcon name="i-heroicons-chart-bar" class="text-blue-600" />
							实时评分
						</div>
						<div class="flex items-center gap-2">
							<UIcon name="i-heroicons-lock-closed" class="text-neutral-400" />
							隐私安全
						</div>
					</div>
				</div>
				<div class="relative">
					<div
						class="rounded-2xl border border-gray-200 shadow-lg bg-white overflow-hidden"
					>
						<div
							class="px-4 py-3 border-b border-gray-200 flex items-center gap-2"
						>
							<div class="h-3 w-3 rounded-full bg-red-400"></div>
							<div class="h-3 w-3 rounded-full bg-yellow-400"></div>
							<div class="h-3 w-3 rounded-full bg-green-400"></div>
							<span class="ml-2 text-xs text-neutral-500">模拟面试 · 示例</span>
						</div>
						<div class="p-4 md:p-6">
							<div class="space-y-3">
								<div class="flex items-start gap-3">
									<div
										class="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
									>
										<UIcon name="i-heroicons-user" />
									</div>
									<div>
										<p class="text-sm text-neutral-800 font-medium">面试官</p>
										<p class="text-sm text-neutral-600">
											请介绍一个你主导过的性能优化案例，包含指标与落地策略。
										</p>
									</div>
								</div>
								<div class="flex items-start gap-3">
									<div
										class="shrink-0 h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600"
									>
										<UIcon name="i-heroicons-academic-cap" />
									</div>
									<div>
										<p class="text-sm text-neutral-800 font-medium">AI 反馈</p>
										<p class="text-sm text-neutral-600">
											回答结构清晰，但缺少量化指标（如
											P95、错误率）。建议补充对比与数据闭环。
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup></script>

<style scoped></style>
