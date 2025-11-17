<template>
	<UModal
		v-model:open="isOpen"
		title="重置享优惠"
		:ui="{ width: 'sm:max-w-md' }"
	>
		<template #body>
			<div class="space-y-6">
				<!-- 当前余额 -->
				<div
					class="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4"
				>
					<p class="text-sm text-gray-600 mb-1">当前余额</p>
					<p class="text-2xl font-bold text-primary-600">
						{{ currentBalance }}
					</p>
				</div>

				<!-- 快速充值选项 -->
				<div>
					<p class="text-sm font-medium text-gray-700 mb-3">选择充值金额</p>
					<div class="grid grid-cols-3 gap-3">
						<button
							v-for="amount in quickAmounts"
							:key="amount"
							:class="[
								'relative rounded-xl p-4 border-2 transition-all hover:scale-105',
								selectedAmount === amount
									? 'border-primary-500 bg-primary-50 shadow-md'
									: 'border-gray-200 hover:border-primary-300 bg-white'
							]"
							@click="selectedAmount = amount"
						>
							<div class="text-center">
								<div class="text-lg font-bold text-gray-900">{{ amount }}</div>
								<div class="text-xs text-gray-500 mt-1">旺旺币</div>
							</div>
							<div
								v-if="selectedAmount === amount"
								class="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
							>
								<UIcon name="i-heroicons-check" class="w-3 h-3 text-white" />
							</div>
						</button>
					</div>
				</div>

				<!-- 自定义金额 -->
				<div>
					<UForm label="自定义金额" name="customAmount">
						<UInput
							v-model.number="customAmount"
							type="number"
							placeholder="请输入充值金额"
							size="lg"
							:min="1"
						>
							<template #trailing>
								<span class="text-gray-500 text-sm">旺旺币</span>
							</template>
						</UInput>
					</UForm>
					<p class="text-xs text-gray-500 mt-2">
						单次充值最低 1 旺旺币，最高 10000 旺旺币
					</p>
				</div>

				<!-- 优惠提示 -->
				<div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
					<div class="flex items-start gap-2">
						<UIcon
							name="i-heroicons-information-circle"
							class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
						/>
						<div class="text-sm text-amber-800">
							<p class="font-medium mb-1">充值优惠</p>
							<p class="text-xs">
								充值越多，赠送越多！更多优惠活动请关注官方公告。
							</p>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="flex gap-2 w-full">
				<UButton
					color="gray"
					variant="ghost"
					class="flex-1 justify-center"
					@click="handleCancel"
				>
					取消
				</UButton>
				<UButton
					color="primary"
					class="flex-1 justify-center"
					:loading="loading"
					:disabled="!finalAmount || finalAmount < 1"
					@click="handleRecharge"
				>
					确认充值 {{ finalAmount || 0 }} 旺旺币
				</UButton>
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
const selectedAmount = ref(null)
const customAmount = ref('')

const isOpen = computed({
	get: () => props.open,
	set: (value) => emit('update:open', value)
})

const currentBalance = computed(() => props.balance)

const quickAmounts = [50, 100, 200, 500, 1000, 2000]

const finalAmount = computed(() => {
	if (customAmount.value && Number(customAmount.value) > 0) {
		const amount = Number(customAmount.value)
		if (amount >= 1 && amount <= 10000) {
			return amount
		}
		return null
	}
	return selectedAmount.value
})

// 监听弹窗打开，重置表单
watch(isOpen, (open) => {
	if (open) {
		selectedAmount.value = null
		customAmount.value = ''
		loading.value = false
	}
})

// 监听自定义金额输入，清除快速选择
watch(customAmount, () => {
	if (customAmount.value) {
		selectedAmount.value = null
	}
})

// 监听快速选择，清除自定义金额
watch(selectedAmount, () => {
	if (selectedAmount.value) {
		customAmount.value = ''
	}
})

// 处理充值
const handleRecharge = async () => {
	if (
		!finalAmount.value ||
		finalAmount.value < 1 ||
		finalAmount.value > 10000
	) {
		toast.add({
			title: '充值金额无效',
			description: '请输入 1-10000 之间的金额',
			color: 'error'
		})
		return
	}

	loading.value = true
	try {
		// TODO: 调用充值 API
		// const { $api } = useNuxtApp()
		// const result = await $api.post('/wallet/recharge', {
		// 	amount: finalAmount.value
		// })

		// 模拟充值成功
		await new Promise((resolve) => setTimeout(resolve, 1500))

		emit('recharge', {
			amount: finalAmount.value,
			orderNo: 'R' + Date.now().toString()
		})

		toast.add({
			title: '充值成功',
			description: `成功充值 ${finalAmount.value} 旺旺币`,
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
