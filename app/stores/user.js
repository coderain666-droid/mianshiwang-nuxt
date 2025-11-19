import { defineStore } from 'pinia'
import { navigateTo } from '#app'

export const useUserStore = defineStore('user', {
	state: () => ({
		userInfo: {
			username: '',
			openid: '',
			avatar: '',
			email: ''
		},
		isLogin: false,
		token: '',
		// 旺旺币相关
		wallet: {
			balance: 0, // 余额
			rechargeRecords: [], // 充值记录
			consumptionRecords: [] // 消费记录
		},
		// 简历列表
		resumes: []
	}),
	getters: {
		// 获取剩余旺旺币
		walletBalance: (state) => state.wallet.balance,
		// 是否可以添加更多简历（最多5份）
		canAddResume: (state) => state.resumes.length < 5
	},
	actions: {
		// 登出
		logout() {
			this.isLogin = false
			this.token = ''
			this.userInfo = {
				username: '',
				openid: '',
				avatar: '',
				email: ''
			}
			this.wallet = {
				balance: 0,
				rechargeRecords: [],
				consumptionRecords: []
			}
			this.resumes = []
			// navigateTo('/login')
		},
		// 更新用户信息
		updateUserInfo(userInfo) {
			this.userInfo = { ...this.userInfo, ...userInfo }
		},
		// 更新旺旺币余额
		updateWalletBalance(balance) {
			this.wallet.balance = balance
		},
		// 添加充值记录
		addRechargeRecord(record) {
			this.wallet.rechargeRecords.unshift(record)
		},
		// 添加消费记录
		addConsumptionRecord(record) {
			this.wallet.consumptionRecords.unshift(record)
		},
		// 添加简历
		addResume(resume) {
			if (this.resumes.length < 5) {
				this.resumes.push(resume)
			}
		},
		// 删除简历
		removeResume(index) {
			this.resumes.splice(index, 1)
		},
		// 更新简历列表（用于拖拽排序）
		updateResumes(resumes) {
			this.resumes = resumes
		}
	},
	persist: true
})
