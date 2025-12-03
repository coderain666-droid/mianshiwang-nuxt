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
			<p class="text-sm text-neutral-500">
				^_^语音输入可能有误差，可稍后核对。<br />AI面试官也会自动纠错，请放心^_^
			</p>
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
const lastFinalTime = ref(0) // 记录上次 final 结果的时间
const sessionTranscript = ref('') // 当前会话的临时文本

const getSR = () => {
	if (typeof window === 'undefined') return null
	return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

/**
 * 智能添加标点符号
 * 根据停顿时间和语义规则添加标点
 */
const addSmartPunctuation = (text, timeSinceLastFinal) => {
	if (!text) return text

	// 移除文本首尾空格
	text = text.trim()

	// 如果文本为空，直接返回
	if (!text) return text

	// 如果上次结果距离现在超过 1.5 秒，认为是新的句子，前面加句号
	const shouldAddPeriod = timeSinceLastFinal > 1500

	// 常见的句子结尾词（可根据实际情况扩展）
	const endPatterns = [
		/[吗呢吧啊呀哇哎]$/, // 语气词结尾
		/[了的地得]$/, // 助词结尾
		/好$/, // 简短回答
		/是$/,
		/对$/,
		/没有$/,
		/可以$/,
		/不是$/
	]

	// 检查是否需要添加问号
	const needsQuestionMark =
		text.includes('吗') ||
		text.includes('呢') ||
		text.startsWith('为什么') ||
		text.startsWith('怎么') ||
		text.startsWith('什么') ||
		text.startsWith('哪') ||
		text.startsWith('谁') ||
		text.startsWith('是不是') ||
		text.startsWith('能不能') ||
		text.startsWith('可不可以')

	// 检查是否已经有标点符号
	const hasPunctuation = /[。！？，、；：""''（）]$/.test(text)

	if (!hasPunctuation) {
		if (needsQuestionMark) {
			text += '？'
		} else if (
			shouldAddPeriod &&
			endPatterns.some((pattern) => pattern.test(text))
		) {
			text += '。'
		} else if (timeSinceLastFinal > 800) {
			// 如果停顿较长（但不算太长），添加逗号
			text += '，'
		}
	}

	return text
}

/**
 * 文本后处理优化
 * 修正常见的识别错误和格式问题
 */
const postProcessText = (text) => {
	if (!text) return text

	// 常见的口语化转换（可根据实际情况扩展）
	const replacements = {
		嗯嗯: '',
		啊啊: '',
		呃: '',
		额: '',
		// 数字优化
		一: '1',
		二: '2',
		三: '3',
		四: '4',
		五: '5',
		六: '6',
		七: '7',
		八: '8',
		九: '9',
		十: '10',
		// 常见技术词汇优化
		皮埃奇皮: 'PHP',
		皮埃奇匹: 'PHP',
		杰斯: 'JS',
		杰埃斯: 'JS',
		维优易: 'Vue',
		瑞阿克特: 'React',
		艾皮爱: 'API'
	}

	// 执行替换（仅替换独立的词，避免误替换）
	let processed = text
	for (const [key, value] of Object.entries(replacements)) {
		// 使用词边界匹配，避免误替换
		const regex = new RegExp(key, 'g')
		processed = processed.replace(regex, value)
	}

	// 移除多余的空格
	processed = processed.replace(/\s+/g, '')

	// 移除重复的标点符号
	processed = processed.replace(/([。！？，])\1+/g, '$1')

	return processed
}

const initRecognition = () => {
	const SR = getSR()
	if (!SR) return
	const rec = new SR()

	// 优化识别参数
	rec.lang = 'zh-CN' // 中文识别
	rec.continuous = true // 持续识别
	rec.interimResults = true // 返回临时结果
	rec.maxAlternatives = 1 // 只获取最佳结果

	rec.onstart = () => {
		listening.value = true
		sessionTranscript.value = '' // 重置会话文本
		lastFinalTime.value = Date.now()
	}

	rec.onend = () => {
		listening.value = false
	}

	rec.onerror = (event) => {
		console.error('语音识别错误:', event.error)
		listening.value = false
	}

	rec.onresult = (event) => {
		// 收集本次识别的所有结果
		let currentSessionText = ''

		for (let i = 0; i < event.results.length; ++i) {
			const result = event.results[i]
			const text = result[0].transcript

			if (result.isFinal) {
				// 计算距离上次 final 结果的时间间隔
				const now = Date.now()
				const timeSinceLastFinal = now - lastFinalTime.value
				lastFinalTime.value = now

				// 对 final 结果进行后处理
				let processedText = postProcessText(text)
				// 智能添加标点符号
				processedText = addSmartPunctuation(processedText, timeSinceLastFinal)

				// 追加到会话文本
				sessionTranscript.value += processedText

				// 更新最终的 transcript
				transcript.value = props.initialText + sessionTranscript.value

				// 实时更新到父组件
				props.onRealtimeUpdate(transcript.value)
			} else {
				// interim 结果，用于实时预览
				currentSessionText += text
			}
		}

		// 如果有 interim 结果，也实时展示（但不保存）
		if (currentSessionText) {
			const tempText =
				props.initialText +
				sessionTranscript.value +
				postProcessText(currentSessionText)
			props.onRealtimeUpdate(tempText)
		}
	}

	recognitionRef.value = rec
}

const start = () => {
	if (!recognitionRef.value) initRecognition() // 确保初始化
	if (!recognitionRef.value) return
	try {
		// 重置会话状态
		sessionTranscript.value = ''
		lastFinalTime.value = Date.now()
		recognitionRef.value.start()
	} catch (e) {
		console.warn('语音识别启动失败:', e)
	}
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
