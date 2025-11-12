<template>
	<div
		class="card relative overflow-hidden border border-gray-200 bg-white p-8 shadow-lg"
	>
		<div
			class="absolute -top-24 right-10 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl"
		></div>
		<div class="flex items-center justify-between gap-4">
			<div>
				<h2 class="text-xl font-semibold text-neutral-900">微信登录</h2>
				<p class="text-sm text-neutral-500">扫码或点击按钮，快速进入面试汪</p>
			</div>
			<div
				class="rounded-full bg-emerald-500/10 p-2 text-emerald-600 leading-0"
			>
				<UIcon name="i-simple-icons-wechat" class="h-6 w-6" />
			</div>
		</div>

		<div v-if="activeMethod === 'scan'" class="mt-8 space-y-4 text-center">
			<div class="relative mx-auto h-52 w-52">
				<div
					class="absolute inset-0 rounded-2xl border border-dashed border-neutral-200 bg-gradient-to-br from-white to-neutral-50 shadow-inner shadow-black/5"
				></div>
				<img
					:src="qrCodeUrl"
					alt="微信扫码登录二维码"
					class="relative z-10 h-full w-full rounded-2xl object-cover p-3"
					:class="{ 'opacity-20': isExpired }"
				/>
				<div
					v-if="isExpired"
					class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-white/90 text-sm text-neutral-600"
				>
					<p>二维码已过期</p>
					<UButton
						class="mt-3 text-white"
						color="primary"
						size="sm"
						@click="refreshQr"
					>
						<template #leading>
							<UIcon name="i-heroicons-arrow-path" />
						</template>
						刷新二维码
					</UButton>
				</div>
				<button
					type="button"
					class="absolute -bottom-3 -right-4 z-30 rounded-full border border-white bg-white p-2 shadow-md transition hover:scale-105 leading-0"
					@click="refreshQr"
					aria-label="刷新二维码"
				>
					<UIcon
						name="i-heroicons-arrow-path"
						class="h-4 w-4 text-neutral-500"
					/>
				</button>
			</div>
			<p class="text-xs text-neutral-500">
				使用微信扫一扫登录，{{ countdown }} 秒后二维码将自动更新。
			</p>
			<div
				class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-600"
			>
				<UIcon name="i-heroicons-lock-closed" />
				微信官方授权，账号安全无忧
			</div>
		</div>

		<div v-else class="mt-8 space-y-5">
			<div class="rounded-xl bg-neutral-50 p-4">
				<h3 class="text-sm font-medium text-neutral-800">微信快速登录流程</h3>
				<ul class="mt-3 space-y-2 text-xs text-neutral-600">
					<li class="flex items-start gap-2">
						<span
							class="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"
						>
							1
						</span>
						打开微信，确认已绑定手机号或邮箱。
					</li>
					<li class="flex items-start gap-2">
						<span
							class="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"
						>
							2
						</span>
						点击下方按钮，授权微信快速登录。
					</li>
					<li class="flex items-start gap-2">
						<span
							class="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"
						>
							3
						</span>
						授权完成后，将自动跳转回面试汪继续使用。
					</li>
				</ul>
			</div>
			<UButton
				color="primary"
				size="lg"
				class="w-full text-white"
				@click="emitQuickLogin"
			>
				<template #leading>
					<UIcon name="i-simple-icons-wechat" />
				</template>
				一键微信快速登录
			</UButton>
		</div>

		<div class="mt-8 flex items-start gap-2 text-xs text-neutral-500">
			<UCheckbox v-model="agree" name="agreement" aria-label="同意协议" />
			<p>
				继续登录即表示你已阅读并同意
				<NuxtLink to="/terms" class="text-primary hover:underline"
					>《服务协议》</NuxtLink
				>
				和
				<NuxtLink to="/privacy" class="text-primary hover:underline"
					>《隐私政策》</NuxtLink
				>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

const emit = defineEmits<{
	(event: 'requestQuickLogin'): void
	(event: 'refreshQr'): void
}>()

const activeMethod = ref<'scan' | 'quick'>('scan')
const countdown = ref(120)
const qrSeed = ref(Date.now())
const agree = ref(true)

const qrCodeUrl = computed(
	() =>
		`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=interview-wang-login-${qrSeed.value}`
)

const isExpired = computed(() => countdown.value <= 0)

let timer: number | null = null

const startTimer = () => {
	if (timer) {
		window.clearInterval(timer)
		timer = null
	}
	countdown.value = 120
	timer = window.setInterval(() => {
		if (countdown.value > 0) {
			countdown.value -= 1
		} else {
			if (timer) {
				window.clearInterval(timer)
				timer = null
			}
		}
	}, 1000)
}

const refreshQr = () => {
	qrSeed.value = Date.now()
	startTimer()
	if (activeMethod.value !== 'scan') {
		activeMethod.value = 'scan'
	}
	emit('refreshQr')
}

const emitQuickLogin = () => {
	if (!agree.value) return
	emit('requestQuickLogin')
}

onMounted(() => {
	startTimer()
})

onBeforeUnmount(() => {
	if (timer) {
		window.clearInterval(timer)
	}
})
</script>

<style scoped></style>
