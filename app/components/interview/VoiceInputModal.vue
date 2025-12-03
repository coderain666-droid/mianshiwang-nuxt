<template>
	<div class="space-y-4">
		<div class="flex items-center gap-2">
			<UIcon name="i-heroicons-microphone" class="w-5 h-5 text-rose-600" />
			<div class="text-sm text-neutral-700">语音输入</div>
			<div class="ml-auto text-xs text-neutral-400" v-if="listening">
				正在聆听...
			</div>
		</div>

		<div class="flex items-center justify-center">
			<div class="relative h-16 flex items-end gap-1" v-if="listening">
				<span class="bar" v-for="n in 24" :key="n" :style="barStyle(n)"></span>
			</div>
			<div v-else class="text-xs text-neutral-400">点击开始进行语音识别</div>
		</div>

		<UTextarea
			v-model="transcript"
			:rows="6"
			autoresize
			:ui="{ base: 'bg-gray-50' }"
		/>

		<div class="flex items-center justify-end gap-2">
			<UButton
				:color="listening ? 'error' : 'primary'"
				variant="soft"
				size="sm"
				@click="toggleListening"
			>
				{{ listening ? '停止' : '开始' }}
			</UButton>
			<UButton color="primary" size="sm" @click="confirmUse"
				>插入到输入框</UButton
			>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useGlobalModal } from '@/composables/useGlobalModal'

const props = defineProps({
	onConfirm: { type: Function, required: true }
})

const transcript = ref('')
const listening = ref(false)
const recognitionRef = ref(null)

const gm = useGlobalModal()

const getSR = () => {
	if (typeof window === 'undefined') return null
	return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

const initRecognition = () => {
	const SR = getSR()
	if (!SR) return
	const rec = new SR()
	rec.lang = 'zh-CN'
	rec.continuous = true
	rec.interimResults = true
	rec.onstart = () => {
		listening.value = true
	}
	rec.onend = () => {
		listening.value = false
	}
	rec.onerror = () => {
		listening.value = false
	}
	rec.onresult = (event) => {
		let finalText = ''
		let interimText = ''
		for (let i = event.resultIndex; i < event.results.length; ++i) {
			const result = event.results[i]
			const text = result[0].transcript
			if (result.isFinal) finalText += text
			else interimText += text
		}
		transcript.value = (
			transcript.value +
			finalText +
			(interimText ? ' ' + interimText : '')
		).trim()
	}
	recognitionRef.value = rec
}

const start = () => {
	if (!recognitionRef.value) return
	try {
		recognitionRef.value.start()
	} catch {}
}
const stop = () => {
	if (!recognitionRef.value) return
	try {
		recognitionRef.value.stop()
	} catch {}
}
const toggleListening = () => {
	if (listening.value) stop()
	else start()
}

const confirmUse = () => {
	props.onConfirm(transcript.value)
	stop()
	gm.closeModal('voice-confirm')
}

onMounted(() => {
	initRecognition()
})

onBeforeUnmount(() => {
	stop()
})

const barStyle = (n) => {
	const delay = (n % 6) * 0.12
	const height = 6 + (n % 5) * 2
	return {
		animationDelay: `${delay}s`,
		height: `${height}px`
	}
}
</script>

<style scoped>
.bar {
	width: 3px;
	background: rgb(244 63 94); /* rose-500 */
	animation: wave 0.9s infinite ease-in-out;
}
@keyframes wave {
	0% {
		transform: scaleY(0.6);
	}
	50% {
		transform: scaleY(1.6);
	}
	100% {
		transform: scaleY(0.6);
	}
}
</style>
