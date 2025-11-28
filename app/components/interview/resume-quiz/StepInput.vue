<template>
	<div
		class="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden"
	>
		<!-- 顶部装饰条 -->
		<div
			class="h-1.5 bg-linear-to-r from-primary-400 via-purple-400 to-primary-400 bg-size-[200%_100%] animate-[gradient_3s_ease-in-out_infinite]"
		></div>

		<div class="p-8 space-y-8">
			<!-- 顶部提示 -->
			<div
				class="bg-primary-50/40 rounded-xl p-4 flex gap-4 border border-primary-100/50"
			>
				<div class="shrink-0">
					<div
						class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center"
					>
						<UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-primary-600" />
					</div>
				</div>
				<div class="text-sm text-neutral-600 leading-relaxed flex-1">
					<p class="font-bold text-neutral-900 mb-1 flex items-center gap-2">
						开启 AI 精准押题
						<span
							class="text-[10px] text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full border border-primary-100"
							>采用 Ultra 级模型</span
						>
					</p>
					<p class="text-neutral-500 text-xs mb-2">
						请输入目标岗位的详细信息，AI
						面试官将为您生成专属的预测题库与高分回答思路。
					</p>
					<ul class="grid sm:grid-cols-2 gap-2 text-xs text-neutral-500">
						<li class="flex items-center gap-1.5">
							<UIcon
								name="i-heroicons-check-circle"
								class="w-3.5 h-3.5 text-green-500"
							/>
							<span>分析公司面试风格</span>
						</li>
						<li class="flex items-center gap-1.5">
							<UIcon
								name="i-heroicons-check-circle"
								class="w-3.5 h-3.5 text-green-500"
							/>
							<span>结合岗位核心职责</span>
						</li>
					</ul>
				</div>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				<!-- 公司名称 -->
				<div class="space-y-2.5 group">
					<label
						class="flex items-center justify-between text-sm font-semibold text-neutral-700"
					>
						<span class="flex items-center gap-1.5">
							<UIcon
								name="i-heroicons-building-office-2"
								class="w-4 h-4 text-neutral-400 group-focus-within:text-primary-500 transition-colors"
							/>
							目标公司
						</span>
					</label>
					<UInput
						:model-value="selectedPosition.company"
						@update:model-value="$emit('update:selectedPosition', { ...selectedPosition, company: $event })"
						class="w-full text-sm"
						placeholder="请输入公司全称，如：字节跳动"
						size="lg"
						:ui="{
							base: 'pl-4',
							rounded: 'rounded-xl',
							color: {
								white: {
									outline:
										'shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-gray-200 bg-gray-50/30 hover:bg-white focus:bg-white transition-all duration-200'
								}
							}
						}"
					/>
				</div>

				<!-- 岗位名称 -->
				<div class="space-y-2.5 group">
					<label
						class="flex items-center justify-between text-sm font-semibold text-neutral-700"
					>
						<span class="flex items-center gap-1.5">
							<UIcon
								name="i-heroicons-building-office-2"
								class="w-4 h-4 text-neutral-400 group-focus-within:text-primary-500 transition-colors"
							/>
							岗位名称
						</span>
					</label>
					<UInput
						:model-value="selectedPosition.positionName"
						@update:model-value="$emit('update:selectedPosition', { ...selectedPosition, positionName: $event })"
						class="w-full text-sm"
						placeholder="请输入岗位名称，如：前端开发工程师"
						size="lg"
						:ui="{
							base: 'pl-4',
							rounded: 'rounded-xl',
							color: {
								white: {
									outline:
										'shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-gray-200 bg-gray-50/30 hover:bg-white focus:bg-white transition-all duration-200'
								}
							}
						}"
					/>
				</div>

				<!-- 薪资范围 -->
				<div class="space-y-2.5 group">
					<label
						class="flex items-center justify-between text-sm font-semibold text-neutral-700"
					>
						<span class="flex items-center gap-1.5">
							<UIcon
								name="i-heroicons-currency-yen"
								class="w-4 h-4 text-neutral-400 group-focus-within:text-primary-500 transition-colors"
							/>
							薪资范围
						</span>
					</label>
					<div class="flex items-center gap-3">
						<div class="relative flex-1">
							<UInput
								:model-value="selectedPosition.minSalary"
								@update:model-value="$emit('update:selectedPosition', { ...selectedPosition, minSalary: $event })"
								class="w-full"
								placeholder="最低 (k)"
								size="lg"
								type="number"
							>
								<template #trailing>
									<span class="text-xs text-neutral-400">k/月</span>
								</template>
							</UInput>
						</div>
						<div class="shrink-0 text-neutral-400">
							<UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
						</div>
						<div class="relative flex-1">
							<UInput
								:model-value="selectedPosition.maxSalary"
								@update:model-value="$emit('update:selectedPosition', { ...selectedPosition, maxSalary: $event })"
								class="w-full"
								placeholder="最高 (k)"
								size="lg"
								type="number"
							>
								<template #trailing>
									<span class="text-xs text-neutral-400">k/月</span>
								</template>
							</UInput>
						</div>
					</div>
				</div>
			</div>

			<!-- 岗位职责 (JD) -->
			<div class="space-y-3 group">
				<div class="flex items-center justify-between">
					<label
						class="flex items-center gap-1.5 text-sm font-semibold text-neutral-700"
					>
						<UIcon
							name="i-heroicons-document-text"
							class="w-4 h-4 text-neutral-400 group-focus-within:text-primary-500 transition-colors"
						/>
						岗位职责 (JD)
						<span
							class="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100"
							>必填</span
						>
						<span class="text-xs text-neutral-400">50 ~ 800 字</span>
					</label>
					<div class="flex items-center gap-2">
						<transition
							enter-active-class="transition duration-200 ease-out"
							enter-from-class="transform scale-95 opacity-0"
							enter-to-class="transform scale-100 opacity-100"
							leave-active-class="transition duration-75 ease-in"
							leave-from-class="transform scale-100 opacity-100"
							leave-to-class="transform scale-95 opacity-0"
						>
							<span
								v-if="selectedPosition?.jd?.length > 0"
								class="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"
							>
								<UIcon name="i-heroicons-check" class="w-3 h-3" />
								内容已输入
							</span>
						</transition>
						<span
							class="text-xs text-neutral-400 font-mono"
							:class="{
								'text-primary-600 font-medium': selectedPosition?.jd?.length > 0
							}"
						>
							{{ selectedPosition?.jd?.length || 0 }} 字
						</span>
					</div>
				</div>
				<div class="relative">
					<UTextarea
						class="w-full"
						:model-value="selectedPosition.jd"
						@update:model-value="$emit('update:selectedPosition', { ...selectedPosition, jd: $event })"
						minlength="50"
						maxlength="800"
						placeholder="请直接粘贴目标岗位的职位描述（JD）...

💡 提示：越详细的 JD（包含任职要求、技术栈、加分项），生成的押题越准确，最少 50 字，最大 2000 字。

示例：
1. 负责前端核心业务功能的开发与维护
2. 熟练掌握 Vue3、TypeScript 等技术栈
3. 具备良好的跨部门沟通协作能力"
						:rows="15"
						size="lg"
						:ui="{
							rounded: 'rounded-xl',
							color: {
								white: {
									outline:
										'shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-gray-200 bg-gray-50/30 hover:bg-white focus:bg-white transition-all duration-200'
								}
							},
							padding: { xl: 'p-4' }
						}"
						required
					/>
					<!-- 装饰角标 -->
					<div
						class="absolute bottom-4 right-4 pointer-events-none transition-opacity duration-300"
						:class="selectedPosition.jd?.length > 0 ? 'opacity-0' : 'opacity-100'"
					>
						<UIcon name="i-heroicons-pencil-square" class="w-12 h-12 text-gray-100" />
					</div>
				</div>
			</div>

			<div class="pt-4 border-t border-gray-100 flex items-center justify-between">
				<div class="text-xs text-neutral-400 hidden sm:block">
					* 点击按钮即表示消耗 1 次押题权益
				</div>
				<UButton
					size="xl"
					color="primary"
					class="w-full sm:w-auto px-12 hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
					:loading="isProcessing"
					@click="$emit('submit')"
					:ui="{ rounded: 'rounded-xl' }"
				>
					<span class="font-bold text-base">立即押题</span>
					<template #trailing>
						<UIcon name="i-heroicons-sparkles" class="w-5 h-5 animate-pulse" />
					</template>
				</UButton>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	selectedPosition: {
		type: Object,
		required: true
	},
	isProcessing: {
		type: Boolean,
		default: false
	}
})

defineEmits(['submit', 'update:selectedPosition'])
</script>

