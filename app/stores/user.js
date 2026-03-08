import { defineStore } from 'pinia'
import { navigateTo } from '#app'
import { MAX_RESUME_COUNT } from '@/constants'
import { getDefaultManualResume } from '@/constants/default-manual-resume'

export const useUserStore = defineStore('user', {
	state: () => ({
		/**
		 *  "user": {
            "_id": "691db92e532b04d29b89ebaf",
            "username": "Sunday账号",
            "phone": "",
            "roles": [
                "user"
            ],
            "isActive": false,
            "gender": "other",
            "isVerified": false,
            "isVip": false,
            "aiInterviewRemainingCount": 0,
            "aiInterviewRemainingMinutes": 0,
            "wwCoinBalance": 0,
            "resumeRemainingCount": 1,
            "specialRemainingCount": 1,
            "behaviorRemainingCount": 1,
            "openid": "test-openid-1235",
            "isWechatBound": true,
            "wechatBoundTime": "2025-11-19T12:33:50.066Z",
            "createdAt": "2025-11-19T12:33:50.085Z",
            "updatedAt": "2025-11-19T13:00:47.194Z",
            "__v": 0,
            "avatar": "http://ww-zhi-dao.oss-cn-beijing.aliyuncs.com/user-img/test-openid-1235/1763557230746.jpeg",
            "email": "1205507971@qq.com"
        },
		 */
		userInfo: {},
		isLogin: false,
		token: '',
		resumes: [],
		/** 手动填写的简历（仅前端存储）；默认带一条本地写死的简历「秦源-数据科学」 */
		manualResumes: [getDefaultManualResume()]
	}),
	getters: {
		// 是否可以添加更多简历（上传 + 手动填写合计不超过 MAX_RESUME_COUNT）
		canAddResume: (state) =>
			state.resumes.length + state.manualResumes.length < MAX_RESUME_COUNT,
		// 所有简历（上传 + 手动），用于列表展示与选择
		allResumes: (state) => [...state.resumes, ...state.manualResumes]
	},
	actions: {
		syncDefaultManualResume() {
			const defaultResume = getDefaultManualResume()
			const defaultIndex = this.manualResumes.findIndex(
				(resume) => resume.resumeId === defaultResume.resumeId
			)

			if (defaultIndex !== -1) {
				this.manualResumes[defaultIndex] = {
					...this.manualResumes[defaultIndex],
					resumeName: defaultResume.resumeName,
					content: defaultResume.content
				}
				return
			}

			if (this.manualResumes.length === 0) {
				this.manualResumes = [defaultResume]
			}
		},
		// 登出
		logout() {
			this.isLogin = false
			this.token = ''
			this.userInfo = {}
			this.resumes = []
			this.manualResumes = []
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
		},
		// 添加手动填写的简历
		addManualResume(resume) {
			if (this.resumes.length + this.manualResumes.length < MAX_RESUME_COUNT) {
				this.manualResumes.push(resume)
			}
		},
		// 删除手动简历（按 resumeId）
		removeManualResume(resumeId) {
			const i = this.manualResumes.findIndex((r) => r.resumeId === resumeId)
			if (i !== -1) this.manualResumes.splice(i, 1)
		},
		// 更新手动简历
		updateManualResume(resumeId, payload) {
			const r = this.manualResumes.find((x) => x.resumeId === resumeId)
			if (r) {
				if (payload.resumeName != null) r.resumeName = payload.resumeName
				if (payload.content != null) r.content = payload.content
			}
		}
	},
	persist: {
		afterHydrate: ({ store }) => {
			store.syncDefaultManualResume()
		}
	}
})
