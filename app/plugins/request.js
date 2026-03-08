import { useUserStore } from '~/stores/user'
import { useToast } from '#imports'
import { buildLocalLLMHeaders } from '~/utils/localLLMConfig'

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig()
	const pushToast = (payload) => {
		if (!process.client) return
		nuxtApp.runWithContext(() => {
			useToast().add(payload)
		})
	}

	// 创建全局 ofetch 实例（同构：SSR/CSR 都可用）
	// 超时 60s：本地/代理下后端冷启或网络慢时，避免 user/info、wechat/qrcode 等请求过早超时
	const api = $fetch.create({
		baseURL: config.public.apiBase, // 例如：/dev-api 或 https://api.example.com
		timeout: 60_000,
		credentials: 'include',

		// ===== 请求拦截 =====
		onRequest({ options }) {
			const userStore = useUserStore()

			const headers = new Headers(options.headers || {})
			if (userStore.isLogin && userStore.token) {
				headers.set('Authorization', `Bearer ${userStore.token}`)
			}
			Object.entries(buildLocalLLMHeaders(config)).forEach(([key, value]) => {
				headers.set(key, value)
			})

			options.headers = headers
		},

		// ===== 统一“业务解包” =====
		// 假定后端返回 { code, message, data }，且 code === 200 表示成功
		onResponse({ response }) {
			const body = response._data
			if (body && typeof body === 'object' && 'code' in body) {
				if (body.code === 200) {
					response._data = body.data // 页面拿到的就是 data
					return
				}
				// 业务错误：提示 + 抛错
				if (process.client) {
					if (body.code === 401) {
						pushToast({ title: '登录已过期，请重新登录', color: 'warning' })
						const userStore = useUserStore()
						userStore.logout()
					} else if (body.code === 500) {
						pushToast({ title: body.message || '请求失败', color: 'error' })
					}
				}
				throw createError({
					statusCode: 400,
					statusMessage: body.message || '请求失败'
				})
			}
		},

		// ===== HTTP 层错误处理 =====
		async onResponseError({ response }) {
			const status = response?.status

			if (status === 401) {
				if (process.client) {
					pushToast({ title: '登录已过期，请重新登录', color: 'warning' })
					const userStore = useUserStore()
					userStore.logout?.()
					nuxtApp.runWithContext(() =>
						navigateTo({ path: '/login', replace: true })
					)
				}
				// 服务端场景直接抛错即可
				throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
			}

			if (process.client) {
				pushToast({
					title: response?._data?.message || '网络错误',
					color: 'error'
				})
			}
			// 抛给调用方（可在页面/组件里按需捕获）
			throw createError({
				statusCode: status || 500,
				statusMessage: response?._data?.message || 'Network Error'
			})
		}
	})

	// 暴露为全局 $api
	return { provide: { api } }
})
