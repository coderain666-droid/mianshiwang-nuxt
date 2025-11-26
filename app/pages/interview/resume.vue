<template>
	<div class="h-full flex flex-col gap-6 max-w-4xl mx-auto w-full">
		<!-- 头部标题 -->
		<div v-if="step !== 'processing'" class="flex flex-col gap-2">
			<h1 class="text-2xl font-bold text-neutral-900">简历押题</h1>
			<p class="text-neutral-600 text-sm">
				基于您的简历和目标岗位 JD，AI 智能预测面试题目并提供参考答案
			</p>
		</div>

		<!-- 第一步：输入信息 -->
		<div
			v-if="step === 'input'"
			class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6"
		>
			<div class="grid gap-6 md:grid-cols-2">
				<!-- 公司名称 -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-neutral-700"
						>目标公司
						<span class="text-neutral-400 font-normal">（选填）</span></label
					>
					<UInput
						v-model="formData.company"
						placeholder="例如：字节跳动"
						size="lg"
						icon="i-heroicons-building-office-2"
					/>
				</div>

				<!-- 薪资范围 -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-neutral-700"
						>薪资范围
						<span class="text-neutral-400 font-normal">（选填）</span></label
					>
					<UInput
						v-model="formData.salary"
						placeholder="例如：25k-35k"
						size="lg"
						icon="i-heroicons-currency-yen"
					/>
				</div>
			</div>

			<!-- 岗位职责 (JD) -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-neutral-700"
					>岗位职责 (JD) <span class="text-red-500">*</span></label
				>
				<UTextarea
					v-model="formData.jd"
					placeholder="请粘贴目标岗位的职位描述（JD），AI 将根据这些信息进行针对性押题..."
					:rows="8"
					size="lg"
					required
				/>
			</div>

			<div class="flex justify-end pt-4">
				<UButton
					size="xl"
					color="primary"
					class="w-full md:w-auto px-8"
					:disabled="!isFormValid"
					@click="handlePredictClick"
				>
					立即押题
					<UIcon name="i-heroicons-sparkles" class="w-5 h-5 ml-2" />
				</UButton>
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
import { ref, computed, reactive } from 'vue'
import { navigateTo } from '#imports'
import { useHead } from 'nuxt/app'
import { SEO } from '@/constants/seo'
import { serviceHighlights } from '@/constants/vip'
import { useInterviewStore } from '@/stores/interview'
import { useGlobalModal } from '@/composables/useGlobalModal'
import SpecialInterviewConfirm from '@/components/interview/SpecialInterviewConfirm.vue'
import { useUserStore } from '@/stores/user'

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
// 确定当前为 第二步
interviewStore.currentStep = 2
const userStore = useUserStore()

// 状态管理
const step = ref('input') // input | processing | result
const formData = reactive({
	company: '',
	salary: '',
	jd: ''
})

// 验证
const isFormValid = computed(() => {
	return formData.jd.trim().length > 10 // 简单验证 JD 长度
})

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
	// 显示确认弹窗
	globalModal.showModal({
		title: '准备开始简历押题',
		description: '请确认以下信息后再开始押题流程',
		contentComponent: SpecialInterviewConfirm,
		contentProps: {
			serviceType: 'resume',
			positionName: interviewStore.selectedPosition?.name || '通用岗位',
			company: formData.company, // 传入表单中的公司
			remainingCount: resumeBalance.value,
			onCompanyUpdate: (company) => {
				formData.company = company
				interviewStore.setTargetCompany(company)
			},
			onConfirm: () => {
				globalModal.closeModal()
				startPredictionProcess()
			}
		},
		buttons: [],
		preventClose: true
	})
}

// 开始预测流程
const startPredictionProcess = async () => {
	step.value = 'processing'
	currentProgressStepIndex.value = 0
	progressPercentage.value = 0

	// 保存 JD 到 store (如果需要)
	// interviewStore.setJd(formData.jd)

	// 模拟进度条
	let totalDuration = progressSteps.reduce(
		(acc, curr) => acc + curr.duration,
		0
	)
	let elapsedTime = 0

	for (let i = 0; i < progressSteps.length; i++) {
		currentProgressStepIndex.value = i
		const stepDuration = progressSteps[i].duration

		// 细分进度更新
		const stepInterval = 50
		const steps = stepDuration / stepInterval
		const progressPerStep = 100 / progressSteps.length / steps

		await new Promise((resolve) => {
			let count = 0
			const timer = setInterval(() => {
				count++
				// 计算总体进度
				progressPercentage.value = Math.min(
					99,
					progressPercentage.value + progressPerStep
				)

				if (count >= steps) {
					clearInterval(timer)
					resolve()
				}
			}, stepInterval)
		})
	}

	progressPercentage.value = 100
	generateMockResults()

	// 稍微延迟展示结果
	setTimeout(() => {
		step.value = 'result'
	}, 500)
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
				formData.company || '该公司'
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
