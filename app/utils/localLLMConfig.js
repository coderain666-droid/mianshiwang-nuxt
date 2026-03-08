export const LOCAL_LLM_STORAGE_KEY = 'mianshiwang.localLLM.v1'

const normalizeString = (value) => {
	if (typeof value !== 'string') return ''
	return value.trim()
}

const sanitizeProvider = (value) => {
	const provider = normalizeString(value).toLowerCase()
	return ['openai', 'deepseek', 'mock'].includes(provider) ? provider : ''
}

const sanitizeConfig = (config = {}) => ({
	provider: sanitizeProvider(config.provider),
	deepseekApiKey: normalizeString(config.deepseekApiKey),
	openaiApiKey: normalizeString(config.openaiApiKey),
	deepseekModel: normalizeString(config.deepseekModel),
	openaiModel: normalizeString(config.openaiModel)
})

export const getLocalLLMConfig = (runtimeConfig) => {
	const publicConfig = runtimeConfig?.public || {}
	const envConfig = sanitizeConfig({
		provider: publicConfig.localLlmProvider,
		deepseekApiKey: publicConfig.localDeepseekApiKey,
		openaiApiKey: publicConfig.localOpenaiApiKey,
		deepseekModel: publicConfig.localDeepseekModel,
		openaiModel: publicConfig.localOpenaiModel
	})

	if (!process.client) {
		return envConfig
	}

	try {
		const raw = window.localStorage.getItem(LOCAL_LLM_STORAGE_KEY)
		if (!raw) return envConfig

		const localConfig = sanitizeConfig(JSON.parse(raw))
		return {
			provider: localConfig.provider || envConfig.provider,
			deepseekApiKey: localConfig.deepseekApiKey || envConfig.deepseekApiKey,
			openaiApiKey: localConfig.openaiApiKey || envConfig.openaiApiKey,
			deepseekModel: localConfig.deepseekModel || envConfig.deepseekModel,
			openaiModel: localConfig.openaiModel || envConfig.openaiModel
		}
	} catch {
		return envConfig
	}
}

export const buildLocalLLMHeaders = (runtimeConfig) => {
	const config = getLocalLLMConfig(runtimeConfig)
	const headers = {}

	if (config.provider) headers['x-local-llm-provider'] = config.provider
	if (config.deepseekApiKey) {
		headers['x-local-deepseek-api-key'] = config.deepseekApiKey
	}
	if (config.openaiApiKey) {
		headers['x-local-openai-api-key'] = config.openaiApiKey
	}
	if (config.deepseekModel) {
		headers['x-local-deepseek-model'] = config.deepseekModel
	}
	if (config.openaiModel) {
		headers['x-local-openai-model'] = config.openaiModel
	}

	return headers
}
