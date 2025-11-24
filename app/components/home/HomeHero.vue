<template>
	<section class="relative overflow-hidden bg-white">
		<div class="absolute inset-0 pointer-events-none overflow-hidden">
			<div
				class="absolute -top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary-400/20 to-purple-400/20 blur-3xl opacity-60"
			></div>
			<div
				class="absolute top-[20%] -left-[10%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-emerald-400/20 to-sky-400/20 blur-3xl opacity-60"
			></div>
		</div>
		<div class="container px-4 py-10 md:py-32 relative">
			<div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				<div class="max-w-2xl">
					<div
						class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium text-primary-700 mb-6"
					>
						<span class="relative flex h-2 w-2">
							<span
								class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"
							></span>
							<span
								class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"
							></span>
						</span>
						支持多职业 · 实时评估 · 技能画像
					</div>
					<h1
						class="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.15]"
					>
						用 AI 精准模拟面试<br />
						<span
							class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-600"
							>为你的求职保驾护航</span
						>
					</h1>
					<p class="mt-6 text-lg text-neutral-600 leading-relaxed">
						面试汪通过 AI
						智能模拟面试，根据你的简历，快速模拟真实面试场景。帮助你在短时间内提升面试命中率超
						<span class="text-emerald-600 font-bold">80%</span
						>，极简流程，立刻见效。
					</p>
					<div class="mt-8 flex flex-col sm:flex-row gap-4">
						<UButton
							size="xl"
							color="primary"
							to="/start"
							class="px-8 font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all"
							>开始一场模拟面试</UButton
						>
						<UButton
							size="xl"
							color="gray"
							variant="ghost"
							to="/#features"
							class="px-8 font-medium hover:bg-neutral-100"
							>看看它如何工作</UButton
						>
					</div>
					<div
						class="mt-10 pt-8 border-t border-neutral-100 flex items-center gap-8 text-sm font-medium text-neutral-500"
					>
						<div class="flex items-center gap-2">
							<div class="p-1 rounded bg-emerald-100/50 text-emerald-600">
								<UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
							</div>
							生成岗位级题库
						</div>
						<div class="flex items-center gap-2">
							<div class="p-1 rounded bg-blue-100/50 text-blue-600">
								<UIcon name="i-heroicons-chart-bar" class="w-4 h-4" />
							</div>
							实时评分
						</div>
						<div class="flex items-center gap-2">
							<div class="p-1 rounded bg-neutral-100 text-neutral-600">
								<UIcon name="i-heroicons-lock-closed" class="w-4 h-4" />
							</div>
							隐私安全
						</div>
					</div>
				</div>
				<div class="relative lg:h-[600px] flex items-center justify-center">
					<!-- Decorative background elements -->
					<div
						class="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white rounded-[2rem] transform rotate-3 scale-95 border border-gray-100"
					></div>

					<div
						class="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl shadow-neutral-200/50 overflow-hidden ring-1 ring-neutral-900/5"
					>
						<div
							class="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-white/50"
						>
							<div class="flex items-center gap-2">
								<div class="h-3 w-3 rounded-full bg-red-400"></div>
								<div class="h-3 w-3 rounded-full bg-amber-400"></div>
								<div class="h-3 w-3 rounded-full bg-emerald-400"></div>
							</div>
							<span class="text-xs font-medium text-neutral-400"
								>模拟面试 · 示例</span
							>
						</div>
						<div class="p-6 space-y-6">
							<!-- Interviewer Message -->
							<div class="flex items-start gap-4">
								<div
									class="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-600 ring-2 ring-white shadow-sm"
								>
									<UIcon name="i-heroicons-user" class="w-5 h-5" />
								</div>
								<div class="flex-1 space-y-1">
									<div class="flex items-center gap-2">
										<span class="text-sm font-semibold text-neutral-900"
											>面试官</span
										>
										<span class="text-xs text-neutral-400">刚刚</span>
									</div>
									<div
										class="p-4 rounded-2xl rounded-tl-none bg-white border border-neutral-100 shadow-sm text-neutral-700 text-sm leading-relaxed"
									>
										请介绍一个你主导过的性能优化案例，包含指标与落地策略。
									</div>
								</div>
							</div>

							<!-- AI Analysis Message -->
							<div class="flex items-start gap-4">
								<div
									class="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 ring-2 ring-white shadow-sm"
								>
									<UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
								</div>
								<div class="flex-1 space-y-1">
									<div class="flex items-center gap-2">
										<span class="text-sm font-semibold text-neutral-900"
											>AI 面试助手</span
										>
										<span
											class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700"
											>评分 85</span
										>
									</div>
									<div
										class="p-4 rounded-2xl rounded-tl-none bg-emerald-50/50 border border-emerald-100/50 text-neutral-700 text-sm leading-relaxed"
									>
										<p>
											<span class="font-medium text-emerald-800"
												>分析反馈：</span
											>
											回答结构清晰，采用了 STAR 原则。但缺少量化指标（如
											P95、错误率下降百分比）。
										</p>
										<div class="mt-3 flex gap-2">
											<span
												class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-emerald-600 border border-emerald-100"
												>建议补充数据</span
											>
											<span
												class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-emerald-600 border border-emerald-100"
												>增加对比</span
											>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- Input placeholder -->
						<div class="p-4 border-t border-neutral-50 bg-neutral-50/50">
							<div
								class="h-10 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center px-4 text-sm text-neutral-400"
							>
								输入你的回答...
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
