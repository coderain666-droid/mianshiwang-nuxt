<template>
	<div class="space-y-5">
		<div class="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
			<div class="space-y-3">
				<div>
					<p class="text-sm text-neutral-500 mb-1">目标岗位</p>
					<p class="text-base font-semibold text-neutral-900">
						{{ positionName }}
					</p>
				</div>
				<div>
					<label class="text-sm text-neutral-500 mb-1 block"
						>目标公司（选填）</label
					>
					<UInput
						v-model="localCompany"
						class="w-full"
						placeholder="请输入公司名称，例如：字节跳动"
						size="lg"
					/>
				</div>
			</div>
		</div>

		<div class="rounded-2xl border border-dashed border-primary-200 p-4">
			<ul class="space-y-3 text-sm text-neutral-600">
				<li class="flex items-start gap-2">
					<UIcon
						name="i-heroicons-clock"
						class="w-4 h-4 text-primary-500 mt-0.5"
					/>
					<span
						>本次专项面
						<span class="text-primary-600 font-semibold">时长约 1 小时</span>
						，包含提问与反馈环节。</span
					>
				</li>
				<li class="flex items-start gap-2">
					<UIcon
						name="i-heroicons-credit-card"
						class="w-4 h-4 text-primary-500 mt-0.5"
					/>
					<span>
						确认后将
						<strong class="text-primary-600">扣除 1 次专项面试</strong>
						余额（当前剩余
						{{ remainingCount }} 次）。
					</span>
				</li>
			</ul>
		</div>

		<UButton block color="primary" size="lg" @click="handleConfirm">
			开始面试
		</UButton>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	positionName: {
		type: String,
		default: ''
	},
	company: {
		type: String,
		default: ''
	},
	remainingCount: {
		type: Number,
		default: 0
	},
	onCompanyUpdate: {
		type: Function,
		default: null
	},
	onConfirm: {
		type: Function,
		default: null
	}
})

const localCompany = ref(props.company)

watch(
	() => props.company,
	(value) => {
		if (value !== localCompany.value) {
			localCompany.value = value
		}
	}
)

const handleConfirm = () => {
	props.onCompanyUpdate?.(localCompany.value?.trim() || '')
	props.onConfirm?.()
}
</script>
