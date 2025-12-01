/**
 * 处理简历押题 - SSE 流式接口
 *
 * 注意：SSE 流式接口无法使用 $api ($fetch)，因为：
 * 1. $fetch 会等待完整响应，无法处理实时流式数据
 * 2. SSE 需要使用 fetch + ReadableStream 来逐块读取数据
 *
 * @param {Object} params - 请求参数
 * @param {string} params.resumeId - 简历ID
 * @param {string} params.company - 公司名称
 * @param {string} params.positionName - 岗位名称
 * @param {string} params.minSalary - 最低薪资
 * @param {string} params.maxSalary - 最高薪资
 * @param {string} params.jd - 岗位职责
 * @param {string} [params.requestId] - 请求ID（用于幂等性，避免重复提交，UUID v4 格式）
 * @param {Object} options - 配置选项
 * @param {string} options.token - 认证 token（从 userStore 传入）
 * @param {string} options.baseURL - API 基础 URL（从 runtimeConfig 传入）
 * @param {Object} options.callbacks - 回调函数集合
 * @param {Function} options.callbacks.onMessage - 接收到消息时的回调函数
 * @param {Function} options.callbacks.onError - 发生错误时的回调函数
 * @param {Function} options.callbacks.onComplete - 完成时的回调函数
 * @returns {Object} 返回包含 close 方法的控制器对象
 */
export const generateResumeQuizSSE = (params, options) => {
	// 仅在浏览器环境中可用
	if (typeof window === 'undefined') {
		console.warn('SSE is only available in browser environment')
		return { close: () => {} }
	}

	const { token, baseURL = '', callbacks = {} } = options
	const { onMessage, onError, onComplete } = callbacks

	// 构建完整的 URL
	const url = `${baseURL}/interview/resume/quiz/stream`

	// AbortController 用于取消请求
	let controller = null

	const connectSSE = async () => {
		try {
			controller = new AbortController()

			// 构建请求头
			const headers = {
				'Content-Type': 'application/json',
				Accept: 'text/event-stream'
			}

			// 添加 Authorization
			if (token) {
				headers.Authorization = `Bearer ${token}`
			}

			// 使用原生 fetch（SSE 必须）
			const response = await fetch(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(params),
				credentials: 'include', // 与 $api 保持一致
				signal: controller.signal
			})

			// HTTP 错误处理
			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(
					`HTTP ${response.status}: ${errorText || response.statusText}`
				)
			}

			// 获取流式读取器
			const reader = response.body.getReader()
			const decoder = new TextDecoder()
			let buffer = ''

			// 持续读取流式数据
			while (true) {
				const { done, value } = await reader.read()

				if (done) {
					onComplete?.()
					break
				}

				// 解码数据块
				buffer += decoder.decode(value, { stream: true })

				// 按行分割（SSE 以换行符分隔消息）
				const lines = buffer.split('\n')
				buffer = lines.pop() || '' // 保留最后一个不完整的行

				// 处理每一行
				for (const line of lines) {
					if (line.startsWith('data: ')) {
						const data = line.slice(6).trim()

						// 处理完成标记
						if (data === '[DONE]') {
							onComplete?.()
							return
						}

						// 解析 JSON 数据
						try {
							const parsed = JSON.parse(data)
							onMessage?.(parsed)
						} catch (e) {
							// 如果不是 JSON，直接传递原始数据
							onMessage?.({ content: data })
						}
					}
				}
			}
		} catch (error) {
			// 用户主动取消不算错误
			if (error.name === 'AbortError') {
				console.log('SSE connection aborted by user')
			} else {
				console.error('SSE error:', error)
				onError?.(error)
			}
		}
	}

	// 立即启动连接
	connectSSE()

	// 返回控制器（用于关闭连接）
	return {
		close: () => {
			controller?.abort()
		}
	}
}

/**
 * 获取分析报告的统一接口
 */
export const getAnalysisReportAPI = ($api, resultId) => {
	return $api(`/interview/analysis/report/${resultId}`, {
		method: 'GET'
	})
}

/**
 * 获取简历押题历史记录
 */
export const getInterviewResumeHistoryAPI = ($api, page, limit) => {
	return $api('/interview/resume/quiz/history', {
		method: 'GET',
		query: {
			page,
			limit
		}
	})
}

/**
 * 获取单个结果详情
 */
export const getInterviewResultDetailAPI = ($api, resultId) => {
	return $api(`/interview/resume/quiz/result/${resultId}`, {
		method: 'GET'
	})
}

/**
 * 使用 $api 的普通接口示例（非 SSE）
 * 如果后端提供了非流式的押题接口，可以这样使用：
 */
export const generateResumeQuizAPI = ($api, params) => {
	return $api('/interview/resume/quiz', {
		method: 'POST',
		body: params
	})
}

/**
 * 开始模拟面试 - SSE 流式接口
 *
 * 注意：SSE 流式接口无法使用 $api ($fetch)，因为：
 * 1. $fetch 会等待完整响应，无法处理实时流式数据
 * 2. SSE 需要使用 fetch + ReadableStream 来逐块读取数据
 *
 */
export const startMockInterviewAPI = (params, options) => {
	// 仅在浏览器环境中可用
	if (typeof window === 'undefined') {
		console.warn('SSE is only available in browser environment')
		return { close: () => {} }
	}

	const { token, baseURL = '', callbacks = {} } = options
	const { onMessage, onError, onComplete } = callbacks

	// 构建完整的 URL
	const url = `${baseURL}/interview/mock/start`

	// AbortController 用于取消请求
	let controller = null

	const connectSSE = async () => {
		try {
			controller = new AbortController()

			// 构建请求头
			const headers = {
				'Content-Type': 'application/json',
				Accept: 'text/event-stream'
			}

			// 添加 Authorization
			if (token) {
				headers.Authorization = `Bearer ${token}`
			}

			// 使用原生 fetch（SSE 必须）
			const response = await fetch(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(params),
				credentials: 'include', // 与 $api 保持一致
				signal: controller.signal
			})

			// HTTP 错误处理
			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(
					`HTTP ${response.status}: ${errorText || response.statusText}`
				)
			}

			// 获取流式读取器
			const reader = response.body.getReader()
			const decoder = new TextDecoder()
			let buffer = ''

			// 持续读取流式数据
			while (true) {
				const { done, value } = await reader.read()

				if (done) {
					onComplete?.()
					break
				}

				// 解码数据块
				buffer += decoder.decode(value, { stream: true })

				// 按行分割（SSE 以换行符分隔消息）
				const lines = buffer.split('\n')
				buffer = lines.pop() || '' // 保留最后一个不完整的行

				// 处理每一行
				for (const line of lines) {
					if (line.startsWith('data: ')) {
						const data = line.slice(6).trim()

						// 处理完成标记
						if (data === '[DONE]') {
							onComplete?.()
							return
						}

						// 解析 JSON 数据
						try {
							const parsed = JSON.parse(data)
							onMessage?.(parsed)
						} catch (e) {
							// 如果不是 JSON，直接传递原始数据
							onMessage?.({ content: data })
						}
					}
				}
			}
		} catch (error) {
			// 用户主动取消不算错误
			if (error.name === 'AbortError') {
				console.log('SSE connection aborted by user')
			} else {
				console.error('SSE error:', error)
				onError?.(error)
			}
		}
	}

	// 立即启动连接
	connectSSE()

	// 返回控制器（用于关闭连接）
	return {
		close: () => {
			controller?.abort()
		}
	}
}
