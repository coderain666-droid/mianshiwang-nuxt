<template>
	<div class="flex flex-col items-center justify-center py-4 space-y-4">
		<!-- 音浪动画区域 -->
		<div class="relative flex items-center justify-center w-full">
			<div v-if="listening" class="flex items-end justify-center gap-1 h-16">
				<span class="bar" v-for="n in 24" :key="n" :style="barStyle(n)"></span>
			</div>
			<div
				v-else
				class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center"
			>
				<UIcon name="i-heroicons-microphone" class="w-10 h-10 text-gray-400" />
			</div>
		</div>

		<!-- 状态与操作提示 -->
		<div class="text-center space-y-3 mt-8">
			<h3
				class="text-xl font-medium transition-colors duration-300"
				:class="listening ? 'text-rose-600' : 'text-neutral-900'"
			>
				{{ listening ? '正在聆听...' : '准备就绪' }}
			</h3>
			<p class="text-sm text-neutral-500" v-if="!autoStart">
				<span v-if="!listening">按下 <UKbd>Space</UKbd> 键开始语音输入</span>
				<span v-else>按下 <UKbd>Space</UKbd> 键暂停输入</span>
			</p>
		</div>

		<!-- 底部确认提示 -->
		<div
			class="flex items-center gap-2 text-sm text-neutral-500 bg-gray-50 px-6 py-3 rounded-full border border-gray-100"
		>
			<UIcon
				name="i-heroicons-paper-airplane"
				class="w-4 h-4 text-primary-500"
			/>
			<span>语音输入完成，按 <UKbd>Enter</UKbd> 键即可发送</span>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
	initialText: {
		type: String,
		default: ''
	},
	autoStart: {
		type: Boolean,
		default: false
	},
	onConfirm: {
		type: Function,
		required: true
	},
	onRealtimeUpdate: {
		type: Function,
		default: () => {}
	}
})

const transcript = ref(props.initialText || '')
const listening = ref(false)
const recognitionRef = ref(null)

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

		// 更新 transcript（追加模式）
		// 注意：这里简单实现为累加。如果 SpeechRecognition 是 continuous 的，
		// 它会在整个 session 中持续返回结果，直到 stop()。
		// 但是我们这里可能会多次 start/stop，需要处理好追加逻辑。
		// 实际上，最简单的方式是让 transcript 保持为 "baseText + currentSessionText"
		// 但为了简化，我们假设每次 onresult 都是增量（配合 event.resultIndex），或者我们手动维护追加。

		// 简单的追加逻辑：这里其实有一种情况，当 continuous=true 时，start() 后会不断输出
		// 我们应该只在 session 内追加。
		// 鉴于用户体验，我们直接追加到 transcript ref 中。

		// 由于 transcript 已经是累积的文本，我们需要小心不要重复添加。
		// 但 SpeechRecognition 的 resultIndex 是递增的，只要 rec 实例不销毁，是否会重置？
		// 每次 start() 都会开始新的识别会话，resultIndex 重置为 0。
		// 所以我们需要一个 tempTranscript 来存储当前会话的内容，或者直接追加到 main transcript 并在 stop 时固化？

		// 修正策略：直接将识别到的片段追加到 transcript，并清除 interim 部分（如果需要）。
		// 但这里 interimText 是会变的。

		// 简化逻辑：
		// 我们不使用 interimText 来更新最终 transcript，只用于显示（如果 UI 有显示的话）。
		// 这里 UI 没有显示 interim，所以我们只在 isFinal 为 true 时追加。
		// 为了实时性，也可以利用 interimText。

		// 更好的做法：
		// 每次 start() 时，记录当前的 transcript 为 base。
		// onresult 时，transcript = base + currentSessionText。

		// 由于我们没有地方存 base，我们简单处理：
		// 忽略 interimText 的即时展示（或者简单追加），只处理 finalText。
		// 但用户要求“实时展示”，所以 interimText 很重要。

		// 让我们用一个 currentSessionTranscript 变量
		// 实际上，我们每次 start() 都是新的，所以：
		if (finalText) {
			transcript.value += finalText
		}
		// interimText 暂时无法完美处理追加显示，除非我们有一个专门的字段。
		// 但父组件 inputMessage 是单字符串。
		// 考虑到 inputMessage 的体验，我们这里简单地追加 finalText 即可。
		// 如果要支持实时预览（interim），需要更复杂的逻辑，暂且只追加 final。
		// 修正：为了“实时”，我们还是尝试把 interim 也加上，但下次 update 要撤销 interim？
		// 这在单向数据流给父组件时比较麻烦。
		// 妥协：只追加 final 结果，或者稍微延迟。
		// 大多数现代浏览器识别速度很快，final 也可以。

		// 如果非常需要实时看到“正在说的话”，可以：
		// props.onRealtimeUpdate(transcript.value + interimText)
		if (interimText) {
			props.onRealtimeUpdate(transcript.value + interimText)
		} else {
			props.onRealtimeUpdate(transcript.value)
		}
	}
	recognitionRef.value = rec
}

const start = () => {
	if (!recognitionRef.value) initRecognition() // 确保初始化
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

const handleKeydown = (e) => {
	// 如果是自动开始模式（PTT），则不处理空格键，交由外部处理松开事件
	if (props.autoStart && e.code === 'Space') return

	if (e.code === 'Space') {
		e.preventDefault() // 防止页面滚动
		toggleListening()
	} else if (e.code === 'Enter') {
		e.preventDefault()
		if (transcript.value.trim()) {
			stop()
			props.onConfirm()
		}
	}
}

onMounted(() => {
	initRecognition()
	window.addEventListener('keydown', handleKeydown)
	if (props.autoStart) {
		start()
	}
})

onBeforeUnmount(() => {
	stop()
	window.removeEventListener('keydown', handleKeydown)
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
	width: 4px;
	background: rgb(244 63 94); /* rose-500 */
	border-radius: 2px;
	animation: wave 0.9s infinite ease-in-out;
}
@keyframes wave {
	0% {
		transform: scaleY(0.6);
		opacity: 0.6;
	}
	50% {
		transform: scaleY(1.8);
		opacity: 1;
	}
	100% {
		transform: scaleY(0.6);
		opacity: 0.6;
	}
}
</style>
