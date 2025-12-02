const ssePost = (path, params, options) => {
	if (typeof window === 'undefined') {
		return { close: () => {} }
	}

	const { token, baseURL = '', callbacks = {} } = options || {}
	const { onMessage, onError, onComplete } = callbacks

	const url = `${baseURL}${path.startsWith('/') ? path : `/${path}`}`
	let controller = null

	const connect = async () => {
		try {
			controller = new AbortController()
			const headers = {
				'Content-Type': 'application/json',
				Accept: 'text/event-stream'
			}
			if (token) headers.Authorization = `Bearer ${token}`
			const response = await fetch(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(params),
				credentials: 'include',
				signal: controller.signal
			})
			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(
					`HTTP ${response.status}: ${errorText || response.statusText}`
				)
			}
			const reader = response.body.getReader()
			const decoder = new TextDecoder()
			let buffer = ''
			while (true) {
				const { done, value } = await reader.read()
				if (done) {
					onComplete?.()
					break
				}
				buffer += decoder.decode(value, { stream: true })
				const lines = buffer.split('\n')
				buffer = lines.pop() || ''
				for (const line of lines) {
					if (line.startsWith('data: ')) {
						const data = line.slice(6).trim()
						if (data === '[DONE]') {
							onComplete?.()
							return
						}
						try {
							const parsed = JSON.parse(data)
							onMessage?.(parsed)
						} catch {
							onMessage?.({ content: data })
						}
					}
				}
			}
		} catch (error) {
			if (error.name !== 'AbortError') {
				onError?.(error)
			}
		}
	}

	connect()
	return { close: () => controller?.abort() }
}

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
	return ssePost('/interview/resume/quiz/stream', params, options)
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
	return ssePost('/interview/mock/start', params, options)
}

/**
 * 回答面试问题
 *
 * 注意：SSE 流式接口无法使用 $api ($fetch)，因为：
 * 1. $fetch 会等待完整响应，无法处理实时流式数据
 * 2. SSE 需要使用 fetch + ReadableStream 来逐块读取数据
 *
 */
export const answerInterviewQuestionAPI = (params, options) => {
	return ssePost('/interview/mock/answer', params, options)
}

/**
 * 暂停面试
 */
export const pauseInterviewAPI = ($api, sessionId) => {
	return $api(`/interview/mock/pause/${sessionId}`, { method: 'POST' })
}

/**
 * 恢复面试
 */
export const resumeInterviewAPI = ($api, sessionId) => {
	return $api(`/interview/mock/resume/${sessionId}`, { method: 'POST' })
}

/**
 * 获取未完成的面试列表
 */
export const getUnfinishedInterviewListAPI = ($api) => {
	return $api(`/interview/mock/unfinished`, { method: 'GET' })
}

/**
 * 结束面试
 */
export const endInterviewAPI = ($api, sessionId) => {
	return $api(`/interview/mock/end/${sessionId}`, { method: 'POST' })
}
