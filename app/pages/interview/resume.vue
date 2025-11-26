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
			v-if="step === 'processing'"
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
					<UProgress :value="progressPercentage" color="primary" indicator />
					<p class="text-xs text-neutral-500 text-right">
						已完成 {{ progressPercentage }}%
					</p>
				</div>

				<div class="flex flex-col gap-3 pt-4">
					<div
						v-for="(s, index) in progressSteps"
						:key="index"
						class="flex items-center gap-3 text-sm transition-colors duration-300"
						:class="
							index <= currentProgressStepIndex
								? 'text-neutral-700'
								: 'text-neutral-300'
						"
					>
						<div
							class="w-6 h-6 rounded-full flex items-center justify-center border text-xs"
							:class="
								index < currentProgressStepIndex
									? 'bg-primary-500 border-primary-500 text-white'
									: index === currentProgressStepIndex
									? 'border-primary-500 text-primary-600 bg-white'
									: 'border-gray-200 bg-gray-50'
							"
						>
							<UIcon
								v-if="index < currentProgressStepIndex"
								name="i-heroicons-check"
								class="w-3.5 h-3.5"
							/>
							<span v-else>{{ index + 1 }}</span>
						</div>
						<span>{{ s.label }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 第三步：押题结果 -->
		<div v-if="step === 'result'" class="space-y-6 pb-12">
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
					<UButton
						color="white"
						variant="solid"
						icon="i-heroicons-arrow-down-tray"
						class="flex-1 sm:flex-none"
						@click="handleDownloadPdf"
					>
						下载 PDF
					</UButton>
					<UButton
						color="primary"
						variant="solid"
						class="flex-1 sm:flex-none"
						@click="handleNextStep"
					>
						下一步：岗位维度分析
						<UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
					</UButton>
				</div>
			</div>

			<!-- 题目列表 -->
			<div class="space-y-4" id="prediction-results">
				<div
					v-for="(item, index) in predictionResults"
					:key="index"
					class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
				>
					<div class="p-5 border-b border-gray-100 bg-gray-50/50">
						<div class="flex gap-3">
							<span
								class="shrink-0 w-6 h-6 rounded bg-primary-100 text-primary-600 text-sm font-bold flex items-center justify-center mt-0.5"
							>
								Q{{ index + 1 }}
							</span>
							<h3
								class="text-base font-medium text-neutral-900 leading-relaxed"
							>
								{{ item.question }}
							</h3>
						</div>
					</div>
					<div class="p-5">
						<div class="flex gap-3">
							<div
								class="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5"
							>
								<UIcon
									name="i-heroicons-light-bulb"
									class="w-5 h-5 text-amber-500"
								/>
							</div>
							<div class="text-sm text-neutral-600 leading-relaxed space-y-2">
								<p class="font-medium text-neutral-800">参考回答思路：</p>
								<div class="whitespace-pre-wrap">{{ item.answer }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
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
const step = ref('input') // input | processing | result
const sseController = ref(null) // SSE 连接控制器

const resumeBalance = computed(
	() => userStore.userInfo?.resumeRemainingCount ?? 0
)

// 进度条配置
const progressSteps = [
	{ label: '正在分析简历亮点', duration: 1500 },
	{ label: '正在深度解析岗位 JD', duration: 2000 },
	{ label: '正在检索行业历史面试数据', duration: 1500 },
	{ label: '正在构建能力评估模型', duration: 1000 },
	{ label: '正在生成针对性押题结果', duration: 1000 }
]
const currentProgressStepIndex = ref(0)
const progressPercentage = ref(0)
const currentProgressStep = computed(
	() =>
		progressSteps[currentProgressStepIndex.value] ||
		progressSteps[progressSteps.length - 1]
)

// 预测结果数据
const predictionResults = ref([])

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
	// step.value = 'processing'
	currentProgressStepIndex.value = 0
	progressPercentage.value = 0
	predictionResults.value = []

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

	// 模拟进度条（独立于 SSE）
	// const progressInterval = startProgressAnimation()

	// 启动 SSE 连接
	sseController.value = generateResumeQuizSSE(params, {
		token: userStore.token,
		baseURL: config.public.apiBase,
		callbacks: {
			onMessage: (data) => {
				console.log('SSE Message:', data)

				// 根据后端返回的数据结构处理
				// 假设后端返回格式为：data: {"type":"progress","step":1,"label":"正在分析简历亮点","progress":20,"message":"正在分析简历亮点"}
				// data: {"type":"progress","step":2,"label":"正在深度解析岗位 JD","progress":40,"message":"正在深度解析岗位 JD"}
				// data: {"type":"progress","step":3,"label":"正在检索行业历史面试数据","progress":60,"message":"正在检索行业历史面试数据"}
				// data: {"type":"progress","step":4,"label":"正在构建能力评估模型","progress":80,"message":"正在构建能力评估模型"}
				// data: {"type":"progress","step":5,"label":"正在生成针对性押题结果","progress":95,"message":"正在生成针对性押题结果"}
				// 注意：在 "step":5 时会请求 AI，速度会比较慢，这里需要给用户进度条在走动的感知

				if (data.type === 'question') {
					// 接收到一道题目
					predictionResults.value.push({
						question: data.data.question,
						answer: data.data.answer
					})
				} else if (data.type === 'progress') {
					// 更新进度
					if (data.data.step !== undefined) {
						currentProgressStepIndex.value = Math.min(
							data.data.step,
							progressSteps.length - 1
						)
					}
					if (data.data.percentage !== undefined) {
						progressPercentage.value = Math.min(data.data.percentage, 99)
					}
				} else if (data.content) {
					// 兼容简单的文本流
					// 可以根据实际情况解析
					console.log('Content:', data.content)
				}
			},
			onError: (error) => {
				console.error('SSE Error:', error)
				clearInterval(progressInterval)

				toast.add({
					title: '押题失败',
					description: error.message || '网络错误，请稍后重试',
					color: 'error'
				})

				// 回退到输入页面
				step.value = 'input'
			},
			onComplete: () => {
				console.log('SSE Complete')
				clearInterval(progressInterval)

				// 确保进度条完成
				progressPercentage.value = 100
				currentProgressStepIndex.value = progressSteps.length - 1

				// 如果没有收到任何结果，生成模拟数据（开发阶段）
				if (predictionResults.value.length === 0) {
					generateMockResults()
				}

				// 延迟展示结果
				setTimeout(() => {
					step.value = 'result'
				}, 500)
			}
		}
	})
}

// 独立的进度条动画（模拟）
const startProgressAnimation = () => {
	let stepIndex = 0
	let stepProgress = 0

	const interval = setInterval(() => {
		stepProgress += 2

		if (stepProgress >= 100) {
			stepProgress = 0
			stepIndex++

			if (stepIndex >= progressSteps.length) {
				clearInterval(interval)
				return
			}

			currentProgressStepIndex.value = stepIndex
		}

		// 平滑增加进度
		const baseProgress = (stepIndex / progressSteps.length) * 100
		const stepContribution = (stepProgress / 100) * (100 / progressSteps.length)
		progressPercentage.value = Math.min(98, baseProgress + stepContribution)
	}, 100)

	return interval
}

// 生成模拟数据
const generateMockResults = () => {
	predictionResults.value = [
		{
			question: '请结合你过往的项目经验，谈谈你是如何解决复杂技术难题的？',
			answer:
				'建议采用 STAR 法则回答。Situation：描述项目背景和遇到的具体技术难题（如高并发下的数据一致性）；Task：明确你的任务和目标；Action：详细阐述你采取的行动（如引入分布式锁、优化数据库索引等）；Result：展示最终的成果（如性能提升50%，Bug率降低等）。'
		},
		{
			question: `你觉得你与 ${
				interviewStore.selectedPosition.company || '该公司'
			} 的这个岗位最匹配的点在哪里？`,
			answer:
				'分析岗位 JD 中的核心关键词（如团队协作、抗压能力、特定技术栈），结合个人简历中的亮点进行匹配。例如：JD强调跨部门协作，你可以举例说明之前主导过的跨部门项目。'
		},
		{
			question: '在面对需求变更频繁的情况下，你如何保证项目按时交付？',
			answer:
				'重点展示你的沟通能力和项目管理能力。1. 及时沟通，评估变更影响；2. 区分优先级，采用敏捷开发模式；3. 向上管理，争取资源或调整排期；4. 保持代码的可扩展性，减少变更成本。'
		},
		{
			question: '请介绍一下你最熟悉的一个技术栈，并说明它的优缺点。',
			answer:
				'选择你简历中提到的最擅长的技术。结构化回答：1. 技术简介；2. 核心优势（如Vue的响应式系统、组件化）；3. 存在的局限性（如SEO问题）；4. 对应的解决方案（如SSR）。'
		},
		{
			question: '你对未来 3-5 年的职业规划是什么？',
			answer:
				'展示你的进取心和稳定性。建议回答：1. 短期（1-2年）：深入掌握核心业务和技术，成为团队骨干；2. 中期（3-5年）：在某个细分领域成为专家，或尝试带领小团队；3. 强调与公司共同发展。'
		}
	]
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
	progressPercentage.value = 0
	currentProgressStepIndex.value = 0
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
