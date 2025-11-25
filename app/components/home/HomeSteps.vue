<template>
	<section id="steps" class="py-10 md:py-32 overflow-hidden">
		<div class="container px-4">
			<div class="mx-auto max-w-2xl text-center mb-16">
				<h2
					class="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight"
				>
					3 步开启你的 AI 面试
				</h2>
				<p class="mt-4 text-lg text-neutral-600">
					用最短路径积累真正有效的面试经验。
				</p>
			</div>
			<div class="relative mt-12">
				<!-- Connecting line for desktop -->
				<div
					class="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-neutral-100 -translate-y-1/2 z-0"
				></div>

				<div class="grid md:grid-cols-3 gap-8 relative z-10">
					<div
						class="group bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300"
					>
						<div
							class="w-12 h-12 rounded-full bg-primary-50 text-primary-600 font-bold text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-4 ring-white"
						>
							1
						</div>
						<h3 class="text-xl font-semibold text-neutral-900 mb-3">
							选择岗位与目标
						</h3>
						<p class="text-neutral-600 leading-relaxed">
							设置目标岗位/公司，并导入简历，系统自动生成专属题集。
						</p>
					</div>
					<div
						class="group bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300"
					>
						<div
							class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 font-bold text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-4 ring-white"
						>
							2
						</div>
						<h3 class="text-xl font-semibold text-neutral-900 mb-3">
							开启多轮模拟面试
						</h3>
						<p class="text-neutral-600 leading-relaxed">
							模拟 HR/技术/业务面，支持多轮追问、反问与沟通演练。
						</p>
					</div>
					<div
						class="group bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300"
					>
						<div
							class="w-12 h-12 rounded-full bg-amber-50 text-amber-600 font-bold text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-4 ring-white"
						>
							3
						</div>
						<h3 class="text-xl font-semibold text-neutral-900 mb-3">
							获得评估与计划
						</h3>
						<p class="text-neutral-600 leading-relaxed">
							查看结构化报告与提升建议，生成 7 天强化练习计划。
						</p>
					</div>
				</div>
			</div>
			<div class="mt-16 text-center">
				<UButton
					color="primary"
					size="xl"
					to="/interview/start"
					class="px-8 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all font-semibold"
					>立即开始 · 免费体验</UButton
				>
			</div>
		</div>
	</section>
</template>

<script setup></script>

<style scoped></style>
