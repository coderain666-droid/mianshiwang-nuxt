<template>
	<UModal
		v-model:open="isOpen"
		title="充值享优惠"
		:ui="{ content: 'max-w-[1218px]' }"
	>
		<template #body>
			<div class="space-y-6">
				<!-- 旺旺币余额-->
				<div
					class="flex justify-between bg-linear-to-r from-primary-500/10 via-primary-500/5 to-primary-500/10 rounded-2xl p-5 border border-primary-100"
				>
					<div>
						<div class="flex items-center justify-between gap-4">
							<div>
								<span class="text-sm text-gray-600 mr-2">当前余额</span>
								<span class="text-2xl font-bold text-primary-600">
									{{ currentBalance }} 旺旺币
								</span>
								<p class="text-xs text-gray-500 mt-1">
									充值成功后即时到账，
									<span class="text-primary-600 font-bold text-sm"
										>{{ REDEEM_COST }}
									</span>
									旺旺币可兑换一次简历押题 / 专项面试 / 综合面试
									<span class="text-gray-500 text-xs ml-4">
										目前可兑换
										<span class="text-primary-600 font-bold text-sm">{{
											redeemableCount
										}}</span>
										次
									</span>
								</p>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-2 w-[300px]">
						<div class="flex items-center gap-2">
							<UInput
								class="w-[80%]"
								v-model="customAmount"
								type="number"
								placeholder="输入 1 - 10000 的整数"
								min="1"
								max="10000"
								:disabled="customLoading"
								:ui="{
									base: 'pr-[50px]'
								}"
							>
								<template #leading>
									<span class="text-xs text-gray-500">购买</span>
								</template>
								<template #trailing>
									<span class="text-xs text-gray-500">旺旺币</span>
								</template>
							</UInput>
							<UButton color="warning" size="xs" variant="outline"
								>确定</UButton
							>
						</div>
						<p class="text-[11px] text-gray-500">
							旺旺币可用于兑换 简历押题 / 专项面试 / 综合面试 等服务
						</p>
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
								<p class="text-xs text-gray-400">套餐权益实时生效</p>
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
										<span class="text-gray-500 mt-1"
											>支付之后，套餐永久有效</span
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
							支付即视为同意相关<NuxtLink
								to="/agreement"
								target="_blank"
								rel="noopener noreferrer"
								class="text-primary hover:underline"
							>
								服务协议
							</NuxtLink>
							与
							<NuxtLink
								to="/policy"
								target="_blank"
								rel="noopener noreferrer"
								class="text-primary hover:underline"
							>
								隐私政策
							</NuxtLink>
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
import {
	rechargePlans,
	paymentMethods,
	serviceHighlights,
	redeemServices,
	REDEEM_COST
} from '@/constants/vip'

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

const emit = defineEmits(['update:open', 'recharge', 'redeem'])

const toast = useToast()
const loading = ref(false)
const customLoading = ref(false)
const selectedPlanId = ref('pro')
const selectedPayment = ref('wechat')
const customAmount = ref('')

const isOpen = computed({
	get: () => props.open,
	set: (value) => emit('update:open', value)
})

const currentBalance = computed(() => props.balance)

const redeemableCount = computed(() =>
	Math.floor(Number(currentBalance.value || 0) / REDEEM_COST)
)

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
		customLoading.value = false
		customAmount.value = ''
	}
})

const handlePlanSelect = (planId) => {
	selectedPlanId.value = planId
}

const handlePaymentSelect = (methodId) => {
	selectedPayment.value = methodId
}

const handleCustomRecharge = async () => {
	const amount = Number(customAmount.value)
	if (!amount || amount < 1 || amount > 10000) {
		toast.add({
			title: '请输入 1-10000 的旺旺币数量',
			color: 'warning'
		})
		return
	}

	customLoading.value = true
	try {
		await new Promise((resolve) => setTimeout(resolve, 800))
		emit('recharge', {
			amount,
			orderNo: 'C' + Date.now().toString(),
			planId: 'custom',
			planName: '自定义充值',
			price: amount,
			coins: amount,
			source: 'custom',
			paymentMethod: 'custom',
			paymentLabel: '自定义充值'
		})
		customAmount.value = ''
	} catch (error) {
		toast.add({
			title: '充值失败',
			description: error.message || '请稍后重试',
			color: 'error'
		})
	} finally {
		customLoading.value = false
	}
}

const handleRedeemService = (service) => {
	if (currentBalance.value < REDEEM_COST) {
		toast.add({
			title: '旺旺币不足',
			description: '至少需要 20 旺旺币才能兑换一次服务',
			color: 'warning'
		})
		return
	}

	emit('redeem', {
		serviceType: service.type,
		serviceLabel: service.label,
		cost: REDEEM_COST
	})
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
