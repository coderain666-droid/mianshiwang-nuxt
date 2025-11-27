<template>
	<div class="h-full flex flex-col gap-6 w-full">
		<!-- 第一步：输入信息 -->
		<div
			v-if="step === 'input'"
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
							<UIcon
								name="i-heroicons-sparkles"
								class="w-5 h-5 text-primary-600"
							/>
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

				<!-- TODO：隐私安全提示 -->
				<!-- <div
					class="flex items-start gap-2 bg-green-50/50 p-3 rounded-lg border border-green-100/50"
				>
					<UIcon
						name="i-heroicons-shield-check"
						class="w-4 h-4 text-green-600 mt-0.5 shrink-0"
					/>
					<p class="text-xs text-green-700 leading-relaxed">
						我们会为您所有的隐私数据（包括但不局限于：手机号、身份证、邮箱、姓名）进行<span
							class="font-bold"
							>加密或脱敏处理</span
						>，请放心使用。
					</p>
				</div> -->

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
							v-model="interviewStore.selectedPosition.company"
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
							v-model="interviewStore.selectedPosition.positionName"
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
									v-model="interviewStore.selectedPosition.minSalary"
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
									v-model="interviewStore.selectedPosition.maxSalary"
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
							<span class="text-xs text-neutral-400">50 ~ 2000 字</span>
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
									v-if="interviewStore.selectedPosition?.jd?.length > 0"
									class="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"
								>
									<UIcon name="i-heroicons-check" class="w-3 h-3" />
									内容已输入
								</span>
							</transition>
							<span
								class="text-xs text-neutral-400 font-mono"
								:class="{
									'text-primary-600 font-medium':
										interviewStore.selectedPosition?.jd?.length > 0
								}"
							>
								{{ interviewStore.selectedPosition?.jd?.length }} 字
							</span>
						</div>
					</div>
					<div class="relative">
						<UTextarea
							class="w-full"
							v-model="interviewStore.selectedPosition.jd"
							minlength="50"
							maxlength="2000"
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
							:class="
								interviewStore.selectedPosition.jd?.length > 0
									? 'opacity-0'
									: 'opacity-100'
							"
						>
							<UIcon
								name="i-heroicons-pencil-square"
								class="w-12 h-12 text-gray-100"
							/>
						</div>
					</div>
				</div>

				<div
					class="pt-4 border-t border-gray-100 flex items-center justify-between"
				>
					<div class="text-xs text-neutral-400 hidden sm:block">
						* 点击按钮即表示消耗 1 次押题权益
					</div>
					<UButton
						size="xl"
						color="primary"
						class="w-full sm:w-auto px-12 hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
						:loading="step === 'processing'"
						@click="handlePredictClick"
						:ui="{ rounded: 'rounded-xl' }"
					>
						<span class="font-bold text-base">立即押题</span>
						<template #trailing>
							<UIcon
								name="i-heroicons-sparkles"
								class="w-5 h-5 animate-pulse"
							/>
						</template>
					</UButton>
				</div>
			</div>
		</div>

		<!-- 第二步：进度条展示 -->
		<div
			v-if="step === 'progress'"
			class="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
		>
			<div class="w-full max-w-md space-y-8 text-center">
				<div class="relative">
					<div
						class="w-24 h-24 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-6 relative z-10"
					>
						<UIcon
							name="i-heroicons-cpu-chip"
							class="w-12 h-12 text-primary-500 animate-pulse"
						/>
					</div>
					<!-- 脉冲波纹动画 -->
					<div
						class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary-400/20 rounded-full animate-ping"
					></div>
				</div>

				<h2 class="text-xl font-bold text-neutral-900">
					{{ currentProgressStep.label }}
				</h2>

				<div class="space-y-2">
					<UProgress
						:value="currentProgressStep.progress"
						color="primary"
						indicator
					/>
					<p class="text-xs text-neutral-500 text-right">
						已完成 {{ currentProgressStep.progress.toFixed(2) }}%
					</p>
				</div>

				<!-- 步骤列表：只显示去重后的关键步骤 -->
				<div
					ref="progressStepsContainer"
					class="flex flex-col gap-3 pt-4 h-[260px] overflow-y-auto custom-scrollbar scroll-smooth"
				>
					<div
						v-for="(s, index) in uniqueProgressSteps"
						:key="index"
						class="flex items-center gap-3 text-sm transition-colors duration-300"
						:class="
							index < uniqueProgressSteps.length - 1
								? 'text-neutral-700'
								: 'text-primary-600'
						"
					>
						<div
							class="w-6 h-6 rounded-full flex items-center justify-center border text-xs shrink-0"
							:class="
								index < uniqueProgressSteps.length - 1
									? 'bg-primary-500 border-primary-500 text-white'
									: 'border-primary-500 text-primary-600 bg-white animate-pulse'
							"
						>
							<UIcon
								v-if="index < uniqueProgressSteps.length - 1"
								name="i-heroicons-check"
								class="w-3.5 h-3.5"
							/>
							<span v-else>
								<UIcon
									name="i-heroicons-arrow-path"
									class="w-3.5 h-3.5 animate-spin"
								/>
							</span>
						</div>
						<span class="text-left">{{ s.label }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 第三步：押题结果 -->
		<div v-if="step === 'complete'" class="space-y-6 pb-12">
			<!-- 顶部操作栏 -->
			<div
				class="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-4 z-20"
			>
				<div class="flex items-center gap-2 text-sm text-neutral-600">
					<UIcon
						name="i-heroicons-check-circle"
						class="w-5 h-5 text-green-500"
					/>
					<span>押题完成，共生成 {{ predictionResults.length }} 道预测题</span>
					<span
						class="text-xs text-success-500 cursor-pointer underline hover:text-success-600 transition-colors"
						@click="navigateTo('/history')"
						>后续可在「历史记录」中查看</span
					>
				</div>
				<div class="flex items-center gap-3 w-full sm:w-auto">
					<UButton
						color="gray"
						variant="ghost"
						icon="i-heroicons-arrow-path"
						class="flex-1 sm:flex-none"
						@click="handleRetry"
					>
						重新押题
					</UButton>
					<!-- TODO：暂时移除 PDF 下载功能 -->
					<!-- <UButton
						color="white"
						variant="solid"
						icon="i-heroicons-arrow-down-tray"
						class="flex-1 sm:flex-none"
						@click="handleDownloadPdf"
					>
						下载 PDF
					</UButton> -->
					<UButton
						color="primary"
						variant="solid"
						class="flex-1 sm:flex-none"
						@click="handleNextStep"
					>
						下一步：查看提升计划
						<UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
					</UButton>
				</div>
			</div>

			<div
				class="overflow-y-auto max-h-[calc(100vh-200px)] pb-10 custom-scrollbar"
			>
				<!-- 押题总结 -->
				<div
					v-if="predictionSummary"
					class="bg-linear-to-br from-primary-50 to-white rounded-2xl p-6 border border-primary-100 shadow-sm"
				>
					<div class="flex gap-3">
						<div class="shrink-0 mt-1">
							<div
								class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center"
							>
								<UIcon
									name="i-heroicons-sparkles"
									class="w-5 h-5 text-primary-600"
								/>
							</div>
						</div>
						<div class="space-y-2">
							<h3 class="font-bold text-neutral-900">AI 押题分析总结</h3>
							<p
								class="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap"
							>
								{{ predictionSummary }}
							</p>
						</div>
					</div>
				</div>

				<!-- 题目列表 -->
				<div class="space-y-6 mt-2" id="prediction-results">
					<div
						v-for="(item, index) in predictionResults"
						:key="index"
						class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
					>
						<!-- 题目头部 -->
						<div class="p-5 border-b border-gray-100 bg-gray-50/30">
							<div class="flex flex-col gap-3">
								<!-- 标签行 -->
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2 flex-wrap">
										<span
											class="shrink-0 px-2.5 py-1 rounded-md bg-primary-100 text-primary-700 text-sm font-bold"
										>
											Q{{ index + 1 }}
										</span>
										<UBadge
											v-if="item.category"
											color="secondary"
											variant="soft"
											size="sm"
											class="capitalize"
										>
											考察类型：{{ getCategoryName(item.category) }}
										</UBadge>
										<UBadge
											v-if="item.difficulty"
											:color="getDifficultyConfig(item.difficulty).color"
											variant="subtle"
											size="sm"
											class="capitalize"
										>
											题目难度：{{ getDifficultyConfig(item.difficulty).label }}
										</UBadge>
										<UBadge
											v-for="(keyword, kIndex) in item.keywords"
											:key="kIndex"
											color="white"
											variant="solid"
											size="sm"
											class="text-neutral-500 border border-gray-200 font-normal"
										>
											# {{ keyword }}
										</UBadge>
									</div>
									<!-- 预留操作区：收藏/练习 -->
									<div class="flex gap-2">
										<UButton
											color="neutral"
											variant="outline"
											:icon="
												item.isOpen
													? 'i-heroicons-chevron-up'
													: 'i-heroicons-chevron-down'
											"
											size="xs"
											@click="item.isOpen = !item.isOpen"
											>{{ item.isOpen ? '折叠' : '展开' }}</UButton
										>
									</div>
								</div>

								<!-- 题目内容 -->
								<h3
									class="text-lg font-medium text-neutral-900 leading-relaxed cursor-pointer hover:text-primary-600 transition-colors"
									@click="item.isOpen = !item.isOpen"
								>
									{{ item.question }}
								</h3>

								<!-- 考察意图 -->
								<div
									v-if="item.reasoning"
									class="flex items-start gap-2 text-xs text-neutral-500 bg-gray-100/50 p-2 rounded-lg"
									v-show="item.isOpen"
								>
									<UIcon
										name="i-heroicons-eye"
										class="w-4 h-4 shrink-0 mt-0.5"
									/>
									<span
										><span class="font-medium">考察意图：</span
										>{{ item.reasoning }}</span
									>
								</div>
							</div>
						</div>

						<!-- 题目内容主体 -->
						<div class="p-6 space-y-5" v-show="item.isOpen">
							<!-- 回答要点 Tips -->
							<div v-if="item.tips" class="space-y-2">
								<div
									class="flex items-center gap-2 text-sm font-semibold text-amber-600"
								>
									<UIcon name="i-heroicons-light-bulb" class="w-4 h-4" />
									<span>回答要点</span>
								</div>
								<div
									class="pl-6 text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap bg-amber-50/50 p-3 rounded-xl border border-amber-100/50"
								>
									{{ item.tips }}
								</div>
							</div>

							<!-- 参考回答 -->
							<div class="space-y-2">
								<div
									class="flex items-center gap-2 text-sm font-semibold text-primary-600"
								>
									<UIcon
										name="i-heroicons-chat-bubble-bottom-center-text"
										class="w-4 h-4"
									/>
									<span>参考回答思路</span>
								</div>
								<div
									class="pl-6 text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap"
								>
									{{ item.answer }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 押题失败的展示 -->
		<div
			v-if="step === 'error'"
			class="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
		>
			<div class="w-full max-w-md text-center space-y-6">
				<!-- 错误图标 -->
				<div class="relative inline-block">
					<div
						class="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center relative z-10"
					>
						<UIcon
							name="i-heroicons-exclamation-triangle"
							class="w-12 h-12 text-red-500"
						/>
					</div>
					<!-- 装饰光晕 -->
					<div
						class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-400/20 rounded-full animate-pulse"
					></div>
				</div>

				<div class="space-y-2">
					<h2 class="text-xl font-bold text-neutral-900">服务器压力过大</h2>
					<p class="text-neutral-600">
						AI 正在处理大量请求，暂时无法响应。<br />
						<span class="text-green-600 font-medium"
							>本次押题消费已自动返还</span
						>，请稍后再试。
					</p>
				</div>

				<div class="pt-4">
					<UButton
						size="xl"
						color="primary"
						class="px-8 shadow-lg shadow-primary-500/20"
						@click="handleRetry"
					>
						<UIcon name="i-heroicons-arrow-path" class="w-5 h-5 mr-2" />
						重新押题
					</UButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch, nextTick } from 'vue'
import { navigateTo } from '#imports'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'
import { serviceHighlights } from '@/constants/vip'
import { useInterviewStore } from '@/stores/interview'
import { useGlobalModal } from '@/composables/useGlobalModal'
import SpecialInterviewConfirm from '@/components/interview/SpecialInterviewConfirm.vue'
import { useUserStore } from '@/stores/user'
import { generateResumeQuizSSE } from '@/api/interview'
import { useToast } from '#imports'
import { v4 as uuidv4 } from 'uuid'

// TODO：处理在押题过程中可能出现的其他问题，比如：用户刷新页面、点击了跳转其他页面的按钮 等

definePageMeta({
	requiresAuth: true,
	middleware: 'auth',
	layout: 'interview'
})
useHead({
	title: `简历押题 - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content: 'AI 智能简历押题，精准预测面试问题'
		}
	]
})

const globalModal = useGlobalModal()
const interviewStore = useInterviewStore()
const toast = useToast()
// 确定当前为 第二步
interviewStore.currentStep = 2

const userStore = useUserStore()

// 状态管理
const step = ref('input') // input | progress | complete | error
const sseController = ref(null) // SSE 连接控制器

const resumeBalance = computed(
	() => userStore.userInfo?.resumeRemainingCount ?? 0
)

// 进度条配置
const currentProgressStep = ref({
	progress: 0,
	label: '正在解析岗位信息...',
	stage: 'prepare'
})
// 记录所有的进度步骤
const progressSteps = ref([])

// 计算去重后的步骤列表（只显示 label 不同的步骤）
const uniqueProgressSteps = computed(() => {
	const unique = []
	const seenLabels = new Set()

	for (const step of progressSteps.value) {
		if (!seenLabels.has(step.label)) {
			seenLabels.add(step.label)
			unique.push(step)
		}
	}

	return unique
})

// 进度步骤容器的引用
const progressStepsContainer = ref(null)

// 监听步骤变化，自动滚动到底部
watch(uniqueProgressSteps, async () => {
	await nextTick()
	if (progressStepsContainer.value) {
		progressStepsContainer.value.scrollTop =
			progressStepsContainer.value.scrollHeight
	}
})

// 预测结果数据
const predictionResults = ref([])
// 预测的总结
const predictionSummary = ref('')

// 难度映射
const difficultyMap = {
	hard: { label: '困难', color: 'error' },
	medium: { label: '中等', color: 'warning' },
	easy: { label: '简单', color: 'success' }
}

// 题目类型映射
const categoryMap = {
	project: '项目经验',
	technical: '技术深度',
	basic: '基础知识',
	scenario: '场景设计',
	algorithm: '算法数据结构',
	framework: '框架原理',
	performance: '性能优化',
	architecture: '系统架构',
	management: '团队管理',
	behavior: '行为面试',
	'problem-solving': '问题解决',
	'soft-skill': '软技能',
	other: '其他'
}

// 获取难度配置
const getDifficultyConfig = (difficulty) => {
	return difficultyMap[difficulty?.toLowerCase()] || difficultyMap.easy
}

// 获取类型名称
const getCategoryName = (category) => {
	if (!category) return '综合'
	return categoryMap[category?.toLowerCase()] || category
}

// 点击押题按钮
const handlePredictClick = () => {
	// JD 字数判断 50 ~ 2000 字之间
	if (
		interviewStore.selectedPosition.jd?.trim().length < 50 ||
		interviewStore.selectedPosition.jd?.trim().length > 2000
	) {
		toast.add({
			title: '请填写更加详细的岗位职责（JD）',
			description: '以便生成更加准确的押题数据（最少 50 字）',
			color: 'error'
		})
		return
	}

	// 生成本次提交的唯一请求ID（用于幂等性控制）
	// 在用户确认前生成，确保同一次确认操作使用相同的 requestId
	const requestId = uuidv4()

	// 显示确认弹窗
	globalModal.showModal({
		title: '准备开始简历押题',
		description: '请确认以下信息后再开始押题流程',
		contentComponent: SpecialInterviewConfirm,
		contentProps: {
			serviceType: 'resume',
			positionName: interviewStore.selectedPosition.positionName || '通用岗位',
			company: interviewStore.selectedPosition.company, // 传入表单中的公司
			remainingCount: resumeBalance.value,
			onCompanyUpdate: (company) => {
				interviewStore.selectedPosition.company = company
				interviewStore.setTargetCompany(company)
			},
			onConfirm: () => {
				// 验证是否有面试押题剩余次数
				if (resumeBalance.value < 1) {
					globalModal.closeModal()
					globalModal.showModal({
						title: '面试押题次数不足，请先充值',
						description: '当前剩余次数：' + resumeBalance.value,
						buttons: [
							{
								label: '去充值',
								onClick: () => {
									navigateTo('/profile')
								}
							}
						]
					})
					return
				}

				globalModal.closeModal()
				// 传递 requestId 到处理函数
				startPredictionProcess(requestId)
			}
		},
		buttons: [],
		preventClose: true
	})
}

// 开始预测流程
const startPredictionProcess = async (requestId) => {
	// 标记当前状态
	step.value = 'progress'
	// 初始化进度条
	currentProgressStep.value = {
		progress: 0,
		label: '正在准备...',
		stage: 'prepare'
	}
	// 初始化进度记录（清空数组）
	progressSteps.value = []
	// 初始化预测结果
	predictionResults.value = []
	// 初始化总结
	predictionSummary.value = ''

	// 准备请求参数
	const params = {
		resumeId: interviewStore.resumeId,
		resumeContent: interviewStore.resumeText,
		company: interviewStore.selectedPosition.company || '',
		positionName: interviewStore.selectedPosition.positionName || '',
		minSalary: interviewStore.selectedPosition.minSalary || '',
		maxSalary: interviewStore.selectedPosition.maxSalary || '',
		jd: interviewStore.selectedPosition.jd || '',
		requestId // 使用传入的 requestId（在确认时生成），确保幂等性
	}
	// 获取配置
	const config = useRuntimeConfig()

	// 启动 SSE 连接
	sseController.value = generateResumeQuizSSE(params, {
		token: userStore.token,
		baseURL: config.public.apiBase,
		callbacks: {
			onMessage: (data) => {
				console.log('SSE Message:', data)

				// 处理进度更新
				// 服务端返回格式：{"type":"progress","progress":0,"label":"📄 正在读取简历文档...","message":"📄 正在读取简历文档...","stage":"prepare"}
				if (data.type === 'progress') {
					// 更新当前进度
					currentProgressStep.value = {
						progress: data.progress || 0,
						label: data.label || data.message || '处理中...',
						stage: data.stage || 'processing'
					}
					// 记录所有进度步骤（后续会去重显示）
					progressSteps.value.push(currentProgressStep.value)
					// 确保状态为 progress
					step.value = 'progress'
				}
				// 处理题目数据
				else if (data.type === 'complete') {
					// 标记状态
					step.value = 'complete'
					// 兼容旧结构，如果 data.data.questions 存在则使用它
					if (data.data?.questions) {
						predictionResults.value = data.data.questions.map((item) => ({
							question: item.question,
							answer: item.answer,
							category: item.category,
							difficulty: item.difficulty,
							tips: item.tips,
							keywords: item.keywords,
							reasoning: item.reasoning,
							isOpen: true
						}))
					}
					// 总结
					if (data.data?.summary) {
						predictionSummary.value = data.data.summary
					}
				}
				// 实时接收题目数据（兼容流式返回单个题目）
				else if (data.type === 'question') {
					const question = data.question || data.data?.question
					const answer = data.answer || data.data?.answer

					if (question && answer) {
						const category = data.category || data.data?.category
						const difficulty = data.difficulty || data.data?.difficulty
						const tips = data.tips || data.data?.tips
						const keywords = data.keywords || data.data?.keywords
						const reasoning = data.reasoning || data.data?.reasoning

						predictionResults.value.push({
							question,
							answer,
							category,
							difficulty,
							tips,
							keywords,
							reasoning,
							isOpen: true
						})
					}
				}
				// 实时接收总结数据（兼容流式返回总结）
				else if (data.type === 'summary') {
					const summary = data.summary || data.data?.summary
					if (summary) {
						predictionSummary.value = summary
					}
				} else if (data.type === 'error') {
					console.error('SSE Error:', data.error)
					step.value = 'error'
					toast.add({
						title: '押题失败',
						description: data.error.message || '网络错误，请稍后重试',
						color: 'error'
					})
				}
			},
			onError: (error) => {
				step.value = 'error'
				console.error('SSE Error:', error)

				toast.add({
					title: '押题失败',
					description: error.message || '网络错误，请稍后重试',
					color: 'error'
				})
			}
			// onComplete: () => {
			// 	console.log('SSE Complete')
			// 	// 错误不需要管，直接展示错误结果
			// 	if (step.value === 'error') {
			// 		return
			// 	}
			// 	// 完成处理动画即可
			// 	if (step.value === 'complete') {

			// 	}
			// }
		}
	})
}

// 重新押题
const handleRetry = () => {
	// 关闭现有的 SSE 连接
	if (sseController.value) {
		sseController.value.close()
		sseController.value = null
	}

	step.value = 'input'
	// 清空之前的结果
	predictionResults.value = []
	predictionSummary.value = ''
	// 重置进度
	currentProgressStep.value = {
		progress: 0,
		label: '正在准备...',
		stage: 'prepare'
	}
	progressSteps.value = []
}

// 组件卸载时清理 SSE 连接
onUnmounted(() => {
	if (sseController.value) {
		sseController.value.close()
		sseController.value = null
	}
})

// 下载 PDF
const handleDownloadPdf = () => {
	// 这里可以集成 html2pdf.js 或使用简单的打印
	window.print()
}

// 下一步
const handleNextStep = () => {
	// 假设跳转到报告页面或其他逻辑
	navigateTo('/interview/report') // 或者是 /interview/resume/report 如果有的话
}
</script>

<style scoped>
/* 打印样式优化 */
@media print {
	:deep(.no-print) {
		display: none;
	}
	/* 使用 :global 隐藏布局中的侧边栏和头部 */
	:global(aside),
	:global(header),
	:global(nav),
	:global(.sidebar),
	:global(.header) {
		display: none !important;
	}
	/* 隐藏页面内的按钮 */
	button,
	.no-print {
		display: none !important;
	}
	/* 确保结果可见且布局正常 */
	#prediction-results {
		display: block !important;
	}
	/* 重置页面背景和高度，防止被截断 */
	:global(body),
	:global(html),
	:global(#__nuxt),
	:global(.h-screen) {
		height: auto !important;
		overflow: visible !important;
		background: white !important;
	}
	/* 调整主容器宽度 */
	:global(main) {
		width: 100% !important;
		margin: 0 !important;
		padding: 0 !important;
		overflow: visible !important;
	}
}
</style>
