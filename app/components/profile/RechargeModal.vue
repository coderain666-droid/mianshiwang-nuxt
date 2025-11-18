<template>
	<UModal
		v-model:open="isOpen"
		title="充值享优惠"
		:ui="{ content: 'max-w-[1218px]' }"
	>
		<template #body>
			<div class="space-y-6">
				<!-- 当前余额 -->
				<div
					class="bg-linear-to-r from-primary-500/10 via-primary-500/5 to-primary-500/10 rounded-2xl p-5 border border-primary-100 flex items-center justify-between"
				>
					<div>
						<p class="text-sm text-gray-600 mb-1">当前余额</p>
						<p class="text-3xl font-bold text-primary-600">
							{{ currentBalance }} 旺旺币
						</p>
						<p class="text-xs text-gray-500 mt-1">
							充值成功后即时到账，可用于购买面试服务
						</p>
					</div>
					<div class="text-xs text-gray-500 text-right space-y-1">
						<p>套餐权益实时生效</p>
						<p>支持微信 / 支付宝 / 银行卡</p>
					</div>
				</div>

				<div class="flex flex-col lg:flex-row gap-4">
					<!-- 左侧：套餐列表 -->
					<div class="flex-1 space-y-4">
						<div>
							<!-- 顶部标题 -->
							<div class="flex items-center justify-between mb-2">
								<div>
									<p class="text-sm font-semibold text-gray-900">
										购买套餐 / 旺旺币
									</p>
									<p class="text-xs text-gray-500">一次支付，解锁更多权益</p>
								</div>
								<p class="text-xs text-gray-400">有效期覆盖面试全周期</p>
							</div>
							<!-- 套餐包列表 -->
							<div
								class="flex gap-4 overflow-x-auto pt-0.5 pb-2 snap-x snap-mandatory"
							>
								<!-- 套餐包 -->
								<button
									v-for="plan in rechargePlans"
									:key="plan.id"
									type="button"
									class="min-w-[208px] snap-start rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5"
									:class="
										selectedPlanId === plan.id
											? 'border-primary-500 bg-primary-50/80 shadow-lg'
											: 'border-transparent bg-white shadow'
									"
									@click="handlePlanSelect(plan.id)"
								>
									<div class="flex items-center justify-between mb-2">
										<div class="flex items-center gap-1.5">
											<p class="text-base font-semibold text-gray-900">
												{{ plan.name }}
											</p>
											<span
												v-if="plan.badge"
												class="text-[11px] px-2 py-0.5 rounded-full bg-primary-100 text-primary-600 font-medium"
											>
												{{ plan.badge }}
											</span>
										</div>
										<div
											class="w-5 h-5 rounded-full border"
											:class="
												selectedPlanId === plan.id
													? 'border-primary-500 bg-primary-500 text-white flex items-center justify-center'
													: 'border-gray-300'
											"
										>
											<UIcon
												v-if="selectedPlanId === plan.id"
												name="i-heroicons-check-mini"
												class="w-3 h-3"
											/>
										</div>
									</div>
									<p class="text-xs text-gray-500 mb-3">
										{{ plan.tagline || plan.description }}
									</p>

									<ul
										v-if="plan.perks?.length"
										class="space-y-1 text-sm text-gray-700 mb-3"
									>
										<li
											v-for="perk in plan.perks"
											:key="plan.id + perk.label"
											class="flex items-center gap-1.5"
										>
											<UIcon
												name="i-heroicons-check-circle"
												class="w-4 h-4 text-primary-500"
											/>
											<span>{{ perk.count }} 次 {{ perk.label }}</span>
										</li>
									</ul>

									<div
										class="flex flex-col items-start justify-between text-xs"
									>
										<span class="text-amber-600 font-medium">
											原价 {{ plan.originalPrice }} 元 · 立省
											{{ plan.saving }} 元
										</span>
										<span class="text-gray-500"
											>有效期 {{ plan.validDays }} 天</span
										>
									</div>
									<div class="mt-3">
										<p class="text-3xl font-bold text-gray-900">
											¥{{ plan.price }}
										</p>
										<p class="text-xs text-gray-500">
											≈ {{ plan.coins }} 旺旺币
										</p>
									</div>
								</button>
							</div>
						</div>

						<div
							class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600"
						>
							<div
								v-for="service in serviceHighlights"
								:key="service.title"
								class="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 flex gap-3 items-start"
							>
								<div
									class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-inner"
								>
									<UIcon
										:name="service.icon"
										class="w-4 h-4 text-primary-500"
									/>
								</div>
								<div>
									<p class="font-medium text-gray-900 mb-0.5">
										{{ service.title }}
									</p>
									<p class="text-[11px] leading-relaxed">
										{{ service.description }}
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- 右侧：支付摘要 -->
					<div
						class="w-full lg:w-70 shrink-0 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2 text-sm font-medium">
								<button
									v-for="method in paymentMethods"
									:key="method.id"
									type="button"
									class="px-3 py-1.5 rounded-full border text-xs transition-all"
									:class="
										selectedPayment === method.id
											? 'border-emerald-500 bg-emerald-50 text-emerald-700'
											: 'border-transparent bg-gray-50 text-gray-500'
									"
									@click="handlePaymentSelect(method.id)"
								>
									{{ method.label }}
								</button>
							</div>
							<span class="text-[11px] text-gray-400">安全支付</span>
						</div>

						<div class="text-center py-2 border rounded-2xl bg-gray-50/70">
							<p class="text-xs text-gray-500">
								{{ selectedPaymentInfo?.label }} 支付
							</p>
							<p class="text-3xl font-bold text-primary-600 mt-1">
								¥{{ selectedPlan?.price || '--' }}
							</p>
							<p
								v-if="selectedPlan?.saving"
								class="text-xs text-amber-600 font-medium mt-1"
							>
								限时立省 {{ selectedPlan.saving }} 元
							</p>
						</div>

						<div
							class="h-[188px] rounded-xl border border-dashed border-gray-300 bg-white text-center text-xs text-gray-400"
						>
							<p>支付二维码将在正式环境展示</p>
							<p>当前为演示占位</p>
						</div>

						<p class="text-[11px] text-gray-400 text-center">
							支付即视为同意相关用户条款与服务协议
						</p>
					</div>
				</div>
			</div>
		</template>
	</UModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from '#imports'

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	},
	balance: {
		type: Number,
		default: 0
	}
})

const emit = defineEmits(['update:open', 'recharge'])

const toast = useToast()
const loading = ref(false)
const selectedPlanId = ref('pro')
const selectedPayment = ref('wechat')

const isOpen = computed({
	get: () => props.open,
	set: (value) => emit('update:open', value)
})

const currentBalance = computed(() => props.balance)

const rechargePlans = [
	{
		id: 'single',
		name: '单次包',
		description: '搞定 1 轮面试，低门槛应急',
		tagline: '搞定 1 轮面试，低门槛应急',
		price: 18.8,
		originalPrice: 20,
		saving: 1.2,
		validDays: 30,
		coins: 18.8,
		badge: '',
		perks: [
			{ key: '0', label: '简历押题', count: 0 },
			{ key: '1', label: '专项面试', count: 1 },
			{ key: '2', label: '综合面试', count: 0 }
		]
	},
	{
		id: 'pro',
		name: '突击包',
		description: '适合临时面试，快速补齐短板',
		tagline: '搞定 1 轮面试，低门槛应急',
		price: 28.8,
		originalPrice: 60,
		saving: 28.8,
		validDays: 90,
		coins: 28.8,
		badge: '热销',
		perks: [
			{ key: '0', label: '简历押题', count: 1 },
			{ key: '1', label: '专项面试', count: 1 },
			{ key: '2', label: '综合面试', count: 1 }
		]
	},
	{
		id: 'max',
		name: '冲刺包',
		description: '性价比之王，覆盖多轮面试',
		tagline: '3.8 折！入职性价比之王',
		price: 68.8,
		originalPrice: 180,
		saving: 111.2,
		validDays: 180,
		coins: 68.8,
		perks: [
			{ key: '0', label: '简历押题', count: 3 },
			{ key: '1', label: '专项面试', count: 3 },
			{ key: '2', label: '综合面试', count: 3 }
		]
	},
	{
		id: 'ultra',
		name: '上岸包',
		description: '高频练习，多岗位冲刺专用',
		tagline: '2.1 折！面试次数拉满',
		price: 128.8,
		originalPrice: 600,
		saving: 471.2,
		validDays: 360,
		coins: 128.8,
		badge: '高性价比',
		perks: [
			{ key: '0', label: '简历押题', count: 6 },
			{ key: '1', label: '专项面试', count: 16 },
			{ key: '2', label: '综合面试', count: 8 }
		]
	}
]

const paymentMethods = [
	{
		id: 'wechat',
		label: '微信支付',
		description: '推荐，秒级到账',
		icon: 'i-heroicons-chat-bubble-left-right'
	},
	{
		id: 'alipay',
		label: '支付宝',
		description: '支持花呗分期',
		icon: 'i-heroicons-credit-card'
	}
]

const serviceHighlights = [
	{
		title: '简历押题',
		description: '面试知己知彼，精准拆解岗位需求。',
		icon: 'i-heroicons-document-text'
	},
	{
		title: '综合面试',
		description: '全方位评估与反馈，查漏补缺更全面。',
		icon: 'i-heroicons-chat-bubble-left-right'
	},
	{
		title: '专项面试',
		description: '靶向练习，细分场景训练更高效。',
		icon: 'i-heroicons-bolt'
	}
]

const selectedPlan = computed(() =>
	rechargePlans.find((plan) => plan.id === selectedPlanId.value)
)

const selectedPaymentInfo = computed(() =>
	paymentMethods.find((method) => method.id === selectedPayment.value)
)

// 监听弹窗打开，重置表单
watch(isOpen, (open) => {
	if (open) {
		selectedPlanId.value = rechargePlans[0].id
		selectedPayment.value = paymentMethods[0].id
		loading.value = false
	}
})

const handlePlanSelect = (planId) => {
	selectedPlanId.value = planId
}

const handlePaymentSelect = (methodId) => {
	selectedPayment.value = methodId
}

// 处理充值
const handleRecharge = async () => {
	if (!selectedPlan.value) {
		toast.add({
			title: '充值金额无效',
			description: '请选择一个充值方案',
			color: 'error'
		})
		return
	}

	if (!selectedPayment.value) {
		toast.add({
			title: '支付方式无效',
			description: '请选择支付方式',
			color: 'error'
		})
		return
	}

	loading.value = true
	try {
		// TODO: 调用充值 API
		// const { $api } = useNuxtApp()
		// const result = await $api.post('/wallet/recharge', {
		// 	planId: selectedPlan.value.id,
		// 	paymentMethod: selectedPayment.value
		// })

		// 模拟充值成功
		await new Promise((resolve) => setTimeout(resolve, 1500))

		emit('recharge', {
			amount: selectedPlan.value.coins,
			orderNo: 'R' + Date.now().toString(),
			planId: selectedPlan.value.id,
			planName: selectedPlan.value.name,
			price: selectedPlan.value.price,
			originalPrice: selectedPlan.value.originalPrice,
			saving: selectedPlan.value.saving,
			validDays: selectedPlan.value.validDays,
			perks: selectedPlan.value.perks,
			paymentMethod: selectedPayment.value,
			paymentLabel: selectedPaymentInfo.value?.label
		})

		toast.add({
			title: '充值成功',
			description: `充值成功，已到账 ${selectedPlan.value.coins} 旺旺币`,
			color: 'success'
		})

		isOpen.value = false
	} catch (error) {
		toast.add({
			title: '充值失败',
			description: error.message || '请稍后重试',
			color: 'error'
		})
	} finally {
		loading.value = false
	}
}

// 处理取消
const handleCancel = () => {
	isOpen.value = false
}
</script>

<style scoped></style>
