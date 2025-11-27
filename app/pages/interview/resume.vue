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
					<UProgress :value="progressPercentage" color="primary" indicator />
					<p class="text-xs text-neutral-500 text-right">
						已完成 {{ progressPercentage.toFixed(2) }}%
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
const step = ref('complete') // input | progress | complete | error
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
const predictionResults = ref([
	{
		question:
			'请介绍一下你最近参与的一个后端项目，你在其中承担了什么角色？使用了哪些技术栈？',
		answer:
			'虽然简历中项目经验部分信息有限，但从自我评价可以看出我具备扎实的技术基础和实践能力。在最近的一个项目中，我主要负责后端API的设计与开发，使用了Spring Boot框架搭建微服务架构，MySQL作为主数据库，Redis用于缓存优化。我负责用户管理模块的开发，通过JWT实现身份认证，设计了RESTful API接口。在项目中我积极发现问题，比如发现某个查询接口响应较慢，通过分析SQL执行计划，添加了合适的索引，将响应时间从800ms优化到150ms。整个项目采用Git进行版本控制，通过单元测试保证了代码质量，最终按时完成了开发任务。',
		category: 'project',
		difficulty: 'medium',
		tips: '回答要点：1. 明确项目背景和职责 2. 具体技术栈说明 3. 遇到的挑战和解决方案 4. 量化成果',
		keywords: ['Spring Boot', 'MySQL', 'Redis', 'API设计', '性能优化'],
		reasoning:
			'考察项目经验和实际技术应用能力，了解候选人在真实项目中的贡献和技术选择',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '在微服务架构中，如何保证服务间的数据一致性？',
		answer:
			'在微服务架构中保证数据一致性是一个重要挑战。我通常采用以下几种方案：首先，对于强一致性要求的场景，可以使用分布式事务如Seata框架，基于两阶段提交协议。其次，对于最终一致性场景，我更倾向于使用消息队列如RocketMQ的事务消息机制，通过本地事务表+消息表的方式确保消息可靠投递。另外，还可以采用Saga模式，将长事务拆分为多个本地事务，通过补偿机制处理异常情况。在实际项目中，我会根据业务场景选择合适方案，比如在电商订单系统中，采用消息队列实现库存扣减和订单创建的最终一致性，既保证了系统性能，又满足了业务需求。',
		category: 'technical',
		difficulty: 'hard',
		tips: '回答要点：1. 区分强一致性和最终一致性 2. 具体技术方案对比 3. 实际应用场景选择 4. 优缺点分析',
		keywords: [
			'分布式事务',
			'最终一致性',
			'消息队列',
			'Saga模式',
			'数据一致性'
		],
		reasoning:
			'考察分布式系统设计能力，这是后端工程师的核心竞争力，特别是对于高并发场景的处理经验',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '请描述一次你解决线上故障的经历，你是如何定位和解决问题的？',
		answer:
			'在一次线上服务故障中，监控系统报警显示某个核心接口响应时间异常升高。我首先通过日志系统查看错误日志，发现大量数据库连接超时异常。然后检查数据库监控，发现连接数接近上限。我立即采取以下措施：1）临时增加数据库连接池大小缓解压力；2）分析慢查询日志，发现一个未加索引的复杂查询在业务高峰期频繁执行；3）紧急为该查询字段添加复合索引；4）优化相关SQL语句。同时，我排查了代码中连接未正确关闭的问题。整个过程耗时2小时，最终将接口响应时间从5秒恢复到200毫秒以内。事后我总结了经验教训，完善了数据库监控告警机制。',
		category: 'problem-solving',
		difficulty: 'medium',
		tips: '回答要点：1. 问题现象描述 2. 排查步骤清晰 3. 解决方案具体 4. 结果量化 5. 经验总结',
		keywords: ['线上故障', '性能优化', '数据库连接', '监控告警', '问题排查'],
		reasoning:
			'考察应急问题处理能力和系统调试技能，体现候选人的实战经验和系统性思维',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '如何设计一个高并发的秒杀系统？请谈谈你的架构思路。',
		answer:
			'设计高并发秒杀系统需要多层次的优化。首先在前端层面，采用静态化页面、CDN加速、按钮防重复点击等措施。在网关层，进行限流和恶意请求过滤。核心优化在服务层：1）将库存信息预热到Redis中，避免直接访问数据库；2）使用Redis原子操作保证库存扣减的准确性；3）采用消息队列异步处理订单创建，提高系统吞吐量；4）数据库层面进行分库分表。另外，还需要考虑降级策略，比如在系统压力过大时关闭非核心功能。我曾在项目中实现过类似的秒杀方案，通过Redis集群+RabbitMQ的组合，成功支撑了每秒上万次的请求，系统稳定性得到显著提升。',
		category: 'technical',
		difficulty: 'hard',
		tips: '回答要点：1. 分层架构设计 2. 缓存策略 3. 异步处理 4. 数据库优化 5. 降级容灾',
		keywords: ['高并发', '秒杀系统', 'Redis', '消息队列', '系统架构'],
		reasoning:
			'考察系统架构设计能力，这是高级后端工程师必备技能，特别是对分布式和高并发场景的理解',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '在团队开发中，你如何保证代码质量和可维护性？',
		answer:
			"我通过多个维度来保证代码质量和可维护性。在开发规范方面，我会推动团队制定统一的编码规范，使用Checkstyle、SonarQube等工具进行代码检查。在代码评审环节，我积极参与CR，不仅检查功能实现，更关注设计模式的应用和代码的可读性。在测试方面，我坚持编写单元测试，追求较高的测试覆盖率，并使用Jacoco生成测试报告。另外，我注重文档的完善，特别是接口文档和核心业务流程的说明。在实际工作中，我发现这些措施显著减少了线上bug的发生率，新成员也能更快熟悉代码库。我的自我评价中提到的'细心负责'正是体现在对这些细节的关注上。",
		category: 'soft-skill',
		difficulty: 'medium',
		tips: '回答要点：1. 编码规范 2. 代码评审 3. 自动化测试 4. 文档建设 5. 实际效果',
		keywords: ['代码质量', '代码评审', '单元测试', '编码规范', '可维护性'],
		reasoning: '考察工程化思维和团队协作能力，了解候选人对软件质量的理解和实践',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '请解释一下数据库事务的ACID特性，并举例说明在实际项目中的应用。',
		answer:
			'数据库事务的ACID特性包括：原子性（Atomicity）指事务要么全部成功，要么全部失败；一致性（Consistency）指事务执行前后数据库都处于一致状态；隔离性（Isolation）指并发事务相互隔离；持久性（Durability）指事务提交后数据永久保存。在实际项目中，比如转账业务，我使用事务保证扣款和收款要么同时成功，要么同时失败，确保资金总额不变。在电商订单创建时，通过事务保证库存扣减、订单生成、积分增加等操作的一致性。我还根据业务需求选择合适的隔离级别，比如在读取频繁的场景使用读已提交隔离级别，平衡性能和数据一致性。',
		category: 'technical',
		difficulty: 'easy',
		tips: '回答要点：1. 准确解释ACID概念 2. 结合实际业务场景 3. 不同隔离级别的应用 4. 实际项目经验',
		keywords: ['事务', 'ACID', '数据库', '一致性', '隔离级别'],
		reasoning: '考察数据库基础知识的掌握程度，这是后端开发的基本功',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '当你和产品经理对需求理解有分歧时，你会如何处理？',
		answer:
			"当出现需求理解分歧时，我会采取主动沟通的方式解决问题。首先，我会详细记录我的理解和产品经理的表述差异，确保双方信息对称。然后，我会从技术实现角度分析不同理解对产品功能、开发成本和项目进度的影响，用数据支撑我的观点。接着，我会主动约产品经理进行深入讨论，不是简单争论对错，而是共同探讨哪种方案更能满足用户需求和业务目标。如果分歧仍然存在，我会寻求技术主管或项目经理的协调。在这个过程中，我始终保持'善于发现问题、分析问题'的态度，力求找到最优解决方案。这种沟通方式在实践中往往能达成共识，同时增进团队协作。",
		category: 'soft-skill',
		difficulty: 'medium',
		tips: '回答要点：1. 主动沟通态度 2. 技术角度分析 3. 数据支撑观点 4. 寻求共识方法 5. 升级处理机制',
		keywords: ['需求沟通', '团队协作', '问题解决', '技术分析', '共识建立'],
		reasoning: '考察沟通协调能力和职业素养，了解候选人在团队冲突中的处理方式',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '请描述你在项目中遇到的最复杂的技术挑战，你是如何克服的？',
		answer:
			'我遇到的最复杂挑战是在一个分布式系统中处理数据同步的一致性问题。系统包含多个微服务，需要保证跨服务的数据操作原子性。最初采用本地事务，但在分布式环境下无法满足需求。我深入研究后决定采用Saga模式解决方案：将长事务拆分为多个本地事务，每个事务都有对应的补偿操作。我设计了状态机来管理Saga执行流程，使用消息队列确保操作可靠性。在实现过程中，我遇到了事务状态管理复杂、补偿操作设计困难等问题。通过反复测试和优化，最终实现了稳定可靠的分布式事务解决方案。这个经历让我深刻理解了分布式系统的复杂性，也锻炼了我解决复杂问题的能力。',
		category: 'project',
		difficulty: 'hard',
		tips: '回答要点：1. 具体技术挑战描述 2. 解决方案选择过程 3. 实施难点和克服方法 4. 最终成果和收获',
		keywords: ['分布式系统', '数据同步', 'Saga模式', '事务管理', '技术挑战'],
		reasoning:
			'考察解决复杂技术问题的能力和深度思考，了解候选人的技术深度和学习能力',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '什么是缓存穿透、缓存击穿和缓存雪崩？如何预防和解决这些问题？',
		answer:
			'缓存穿透是指查询不存在的数据，绕过缓存直接访问数据库；缓存击穿是指热点key过期瞬间大量请求直达数据库；缓存雪崩是指大量key同时过期导致数据库压力骤增。针对缓存穿透，我采用布隆过滤器过滤非法请求，对空结果进行短时间缓存。对于缓存击穿，使用互斥锁保证只有一个请求重建缓存，其他请求等待。应对缓存雪崩，我会设置不同的过期时间，使用集群保证高可用，实施熔断降级策略。在实际项目中，我通过Redis+Lua脚本实现原子性的缓存重建，结合本地缓存减少Redis压力。这些措施显著提升了系统的稳定性和抗压能力。',
		category: 'technical',
		difficulty: 'medium',
		tips: '回答要点：1. 准确定义三种问题 2. 具体解决方案 3. 技术实现细节 4. 实际应用效果',
		keywords: ['缓存穿透', '缓存击穿', '缓存雪崩', 'Redis', '布隆过滤器'],
		reasoning: '考察缓存相关知识的深度理解，这是高性能后端系统设计的核心知识点',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '你如何进行技术选型？请以消息队列为例说明你的决策过程。',
		answer:
			'技术选型我会从多个维度综合考虑。以消息队列选型为例，首先分析业务需求：消息吞吐量、延迟要求、顺序保证、可靠性等级。然后评估技术特性：Kafka适合高吞吐日志场景，RocketMQ擅长事务消息，RabbitMQ在复杂路由方面表现优秀。接着考虑团队技术储备和运维成本，选择团队熟悉的技术能降低学习成本。最后进行POC测试，验证性能指标。在最近的项目中，我需要保证消息顺序和事务一致性，最终选择了RocketMQ，因为它提供的事务消息机制能很好地满足业务需求，同时团队有相关使用经验。这个选型在实践中被证明是合适的，系统运行稳定。',
		category: 'technical',
		difficulty: 'medium',
		tips: '回答要点：1. 多维度评估标准 2. 业务需求匹配 3. 技术特性对比 4. 团队因素考虑 5. 实际验证过程',
		keywords: ['技术选型', '消息队列', '业务需求', '性能评估', '决策过程'],
		reasoning: '考察技术决策能力和系统性思维，了解候选人对技术生态的理解深度',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question:
			'请描述一个你从零开始主导或深度参与的项目，你在其中最大的收获是什么？',
		answer:
			'我曾深度参与一个从零开始的电商平台后端系统开发。项目初期，我负责设计用户中心和商品模块的架构。最大的收获是学会了如何平衡技术理想和业务现实。最初我倾向于采用最前沿的技术方案，但在评估开发周期和团队能力后，选择了更稳健的技术栈。在开发过程中，我深刻体会到文档和自动化测试的重要性，这些前期投入在后期迭代中带来了巨大收益。我还学会了更好地与前端、测试同事协作，理解他们的需求和痛点。项目最终成功上线，日均订单量达到万级别。这个经历让我从单纯的编码者成长为具备系统思维的技术参与者。',
		category: 'project',
		difficulty: 'medium',
		tips: '回答要点：1. 项目背景和职责 2. 技术决策过程 3. 遇到的困难 4. 个人成长收获 5. 项目成果',
		keywords: ['项目主导', '架构设计', '技术决策', '团队协作', '个人成长'],
		reasoning:
			'考察项目整体参与度和技术领导力潜力，了解候选人的成长轨迹和学习能力',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '在面对紧急上线需求时，你如何平衡开发速度和质量？',
		answer:
			"面对紧急需求，我会采取以下策略平衡速度和质量：首先明确需求核心价值，聚焦最小可行产品（MVP）开发，暂缓非核心功能。在开发过程中，坚持编写核心场景的单元测试，确保基本功能稳定。代码评审环节不能省略，但可以聚焦关键代码和风险点。充分利用现有组件和工具提升效率，避免重复造轮子。上线后立即补全测试用例和技术债务。在我的实践中，这种'快速迭代、持续优化'的方式既满足了业务时效要求，又保证了系统长期可维护性。正如我自我评价中'喜欢迎接新挑战'，我认为紧急需求正是展现技术能力和职业素养的机会。",
		category: 'problem-solving',
		difficulty: 'medium',
		tips: '回答要点：1. 优先级划分 2. 质量底线保障 3. 效率提升方法 4. 技术债务管理 5. 心态调整',
		keywords: ['紧急需求', '质量保障', '优先级', '技术债务', '平衡策略'],
		reasoning:
			'考察压力下的工作方法和职业素养，了解候选人的时间管理和优先级划分能力',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '你如何看待技术债务？在项目中你是如何管理和减少技术债务的？',
		answer:
			'我认为技术债务是软件开发中的自然现象，关键是要有效管理而非完全避免。我会将技术债务分为三类：必须立即解决的（影响系统稳定性）、应该近期解决的（影响开发效率）、可以长期存在的（影响较小）。在项目中，我推动建立技术债务清单，定期评审和清理。在每次迭代中预留一定比例的时间处理技术债务，避免积累。对于新功能开发，我坚持代码规范和质量标准，防止产生新的债务。我还通过自动化测试、代码重构、文档完善等方式系统性减少技术债务。这种主动管理的方式让团队在快速迭代的同时保持代码库的健康度。',
		category: 'project',
		difficulty: 'medium',
		tips: '回答要点：1. 技术债务分类 2. 管理机制建立 3. 预防措施 4. 清理策略 5. 团队协作',
		keywords: ['技术债务', '代码质量', '重构', '自动化测试', '项目管理'],
		reasoning:
			'考察工程化思维和长期技术规划能力，了解候选人对软件生命周期的理解',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	},
	{
		question: '你平时如何学习新技术？最近在学习什么技术？为什么选择学习它？',
		answer:
			'我采用系统化方式学习新技术：首先通过官方文档和权威书籍建立知识体系，然后通过实践项目加深理解，最后通过技术博客和社区交流查漏补缺。最近我在深入学习云原生相关技术，特别是Kubernetes和Service Mesh。选择学习这些技术是因为观察到行业向云原生架构转型的趋势，这些技术能显著提升系统的弹性、可观测性和部署效率。我通过搭建本地K8s集群实践Pod部署、服务发现等核心功能，并研究了Istio在微服务治理中的应用。这种持续学习的态度让我能够跟上技术发展，为团队带来新的技术视角。',
		category: 'soft-skill',
		difficulty: 'easy',
		tips: '回答要点：1. 学习方法体系 2. 具体学习内容 3. 学习动机 4. 实践方式 5. 学习成果应用',
		keywords: ['技术学习', '云原生', 'Kubernetes', '持续学习', '技术规划'],
		reasoning: '考察学习能力和技术热情，了解候选人的成长潜力和技术视野',
		isFavorite: false,
		isPracticed: false,
		isOpen: true
	}
])
// 预测的总结
const predictionSummary = ref(
	'候选人展现出扎实的技术基础和良好的学习能力，自我评价中体现的责任心和分析能力在技术问题回答中得到验证。优势在于对分布式系统、数据库优化、缓存技术有深入理解，具备解决复杂技术问题的能力。项目经验丰富，能够从技术选型到架构设计全面思考。薄弱点在于简历中缺乏具体项目细节和技术栈说明，需要在实际面试中进一步挖掘真实项目经验。建议面试重点考察分布式场景下的实战经验，同时关注团队协作和项目推进能力。候选人期望薪资30K-50K与目标岗位12K存在较大差距，需要评估其实际能力与岗位匹配度。'
)

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
	step.value = 'processing'
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

	// 用于在 step 5 时提供持续的进度感知
	let step5ProgressInterval = null
	let lastServerProgress = 0
	let isInStep5 = false

	// 启动 SSE 连接
	sseController.value = generateResumeQuizSSE(params, {
		token: userStore.token,
		baseURL: config.public.apiBase,
		callbacks: {
			onMessage: (data) => {
				console.log('SSE Message:', data)

				// 处理进度更新
				// 服务端返回格式：{"type":"progress","step":1,"label":"正在分析简历亮点","progress":20}
				if (data.type === 'progress') {
					const { step: currentStep, progress, label, message } = data

					// 更新当前步骤索引（step 从 1 开始，索引从 0 开始）
					if (currentStep !== undefined) {
						const stepIndex = currentStep - 1
						currentProgressStepIndex.value = Math.min(
							stepIndex,
							progressSteps.length - 1
						)

						// 更新步骤标签（如果服务端提供了自定义标签）
						if (label && stepIndex >= 0 && stepIndex < progressSteps.length) {
							progressSteps[stepIndex].label = label
						}

						// 检测是否进入 step 5
						if (currentStep === 5 && !isInStep5) {
							isInStep5 = true
							console.log('进入 Step 5: AI 生成阶段')
						}
					}

					// 更新进度百分比
					if (progress !== undefined) {
						lastServerProgress = progress

						// 如果在 step 5，不要立即跳到服务端进度，而是平滑过渡
						if (isInStep5) {
							// 清除旧的动画
							if (step5ProgressInterval) {
								clearInterval(step5ProgressInterval)
							}
							// 启动新的平滑动画，从当前进度到服务端进度
							step5ProgressInterval = startStep5ProgressAnimation(
								progressPercentage.value,
								progress
							)
						} else {
							// 非 step 5，直接更新进度
							progressPercentage.value = Math.min(progress, 99)
						}
					}
				}
				// 处理题目数据
				else if (data.type === 'complete') {
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

				// 清除 step 5 的进度动画
				if (step5ProgressInterval) {
					clearInterval(step5ProgressInterval)
					step5ProgressInterval = null
				}

				toast.add({
					title: '押题失败',
					description: error.message || '网络错误，请稍后重试',
					color: 'error'
				})
			},
			onComplete: () => {
				console.log('SSE Complete')
				// 错误不需要管，直接展示错误结果
				if (step.value === 'error') {
					return
				}
				// 完成处理动画即可
				if (step.value === 'complete') {
					// 清除 step 5 的进度动画
					if (step5ProgressInterval) {
						clearInterval(step5ProgressInterval)
						step5ProgressInterval = null
					}

					// 确保进度条完成
					progressPercentage.value = 100
					currentProgressStepIndex.value = progressSteps.length - 1
				}
			}
		}
	})
}

/**
 * Step 5 的平滑进度动画（AI 生成阶段）
 * 在 AI 请求期间，给用户进度条在缓慢走动的感知
 *
 * @param {number} fromProgress - 起始进度
 * @param {number} toProgress - 目标进度（服务端返回的进度）
 * @returns {number} interval ID
 */
const startStep5ProgressAnimation = (fromProgress, toProgress) => {
	let currentProgress = fromProgress
	const targetProgress = Math.min(toProgress, 99) // 不超过 99%

	// 计算需要增长的总量
	const totalIncrease = targetProgress - currentProgress

	if (totalIncrease <= 0) {
		// 如果目标进度小于等于当前进度，不需要动画
		return null
	}

	// 根据进度差异调整动画速度
	// 进度差异大：更快的增长速度
	// 进度差异小：更慢的增长速度（给用户持续进行的感觉）
	let incrementPerTick
	let intervalTime

	if (totalIncrease > 10) {
		// 大跨度：每 200ms 增加 0.5%
		incrementPerTick = 0.5
		intervalTime = 200
	} else if (totalIncrease > 5) {
		// 中等跨度：每 300ms 增加 0.3%
		incrementPerTick = 0.3
		intervalTime = 300
	} else {
		// 小跨度或接近完成：每 500ms 增加 0.2%（给用户持续进行的感觉）
		incrementPerTick = 0.2
		intervalTime = 500
	}

	const interval = setInterval(() => {
		if (currentProgress < targetProgress) {
			currentProgress = Math.min(
				currentProgress + incrementPerTick,
				targetProgress
			)
			progressPercentage.value = currentProgress
		} else {
			// 达到目标进度后，继续缓慢增长（但不超过 99%）
			if (currentProgress < 99) {
				currentProgress = Math.min(currentProgress + 0.1, 99)
				progressPercentage.value = currentProgress
			}
		}
	}, intervalTime)

	return interval
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
				'建议采用 STAR 法则回答。Situation：描述项目背景和遇到的具体技术难题（如高并发下的数据一致性）；Task：明确你的任务和目标；Action：详细阐述你采取的行动（如引入分布式锁、优化数据库索引等）；Result：展示最终的成果（如性能提升50%，Bug率降低等）。',
			isOpen: true
		},
		{
			question: `你觉得你与 ${
				interviewStore.selectedPosition.company || '该公司'
			} 的这个岗位最匹配的点在哪里？`,
			answer:
				'分析岗位 JD 中的核心关键词（如团队协作、抗压能力、特定技术栈），结合个人简历中的亮点进行匹配。例如：JD强调跨部门协作，你可以举例说明之前主导过的跨部门项目。',
			isOpen: true
		},
		{
			question: '在面对需求变更频繁的情况下，你如何保证项目按时交付？',
			answer:
				'重点展示你的沟通能力和项目管理能力。1. 及时沟通，评估变更影响；2. 区分优先级，采用敏捷开发模式；3. 向上管理，争取资源或调整排期；4. 保持代码的可扩展性，减少变更成本。',
			isOpen: true
		},
		{
			question: '请介绍一下你最熟悉的一个技术栈，并说明它的优缺点。',
			answer:
				'选择你简历中提到的最擅长的技术。结构化回答：1. 技术简介；2. 核心优势（如Vue的响应式系统、组件化）；3. 存在的局限性（如SEO问题）；4. 对应的解决方案（如SSR）。',
			isOpen: true
		},
		{
			question: '你对未来 3-5 年的职业规划是什么？',
			answer:
				'展示你的进取心和稳定性。建议回答：1. 短期（1-2年）：深入掌握核心业务和技术，成为团队骨干；2. 中期（3-5年）：在某个细分领域成为专家，或尝试带领小团队；3. 强调与公司共同发展。',
			isOpen: true
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
