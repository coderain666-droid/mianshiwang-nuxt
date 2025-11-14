import { defineStore } from 'pinia'
import { navigateTo } from '#app'

export const useUserStore = defineStore('user', {
	state: () => ({
		userInfo: {
			username: '',
			openid: ''
		},
		isLogin: false,
		token: ''
	}),
	getters: {},
	actions: {
		// 登出
		logout() {
			this.isLogin = false
			this.token = ''
			this.userInfo = {
				username: '',
				openid: ''
			}
			navigateTo('/login')
		}
	},
	persist: true
})
