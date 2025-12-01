import { defineStore } from 'pinia'
import { isEmpty } from '@/utils'

export const useInterviewStore = defineStore('interview', {
	state: () => ({
		// 当前步骤：1-选择岗位和简历, 2-面试中, 3-查看报告
		currentStep: 1,
		// 侧边栏是否打开
		isSidebarOpen: true,
		// 选中的服务类型：special, resume, behavior
		selectedService: null,

		// 第一步：岗位和简历
		/*

category: "tech"
description: "负责 Web / 跨端界面开发、组件工程和性能优化"
positionId: "tech-frontend-mid"
level: "初级-高级"
positionName: "前端开发工程师"
company: 字节跳动,
minSalary: 25,
maxSalary: 35,
jd: '' 
		*/
		selectedPosition: {},
		resumeId: null, // 简历 ID（当 type='resume' 时）
		resumeText: '', // 简历文本（当 type='text' 时）

		// 第二步：面试过程
		// 面试会话 ID
		interviewId: null,
		// idle：未进入面试状态，不需要关心
		// starting：面试已经开始，但是费用暂未扣除，处于倒计时阶段
		// in_progress：面试已经开始，费用已经扣除。此时用户进入服务页面，将直接跳转到面试页面
		// suspend：用户点击了暂停面试的按钮，但并不意味着面试结束
		// ended：面试已经结束
		interviewStatus: 'idle',
		messages: [], // 对话消息列表 [{ role: 'user'|'assistant', content: string, timestamp: Date }]
		isStreaming: false, // 是否正在流式输出

		// 第三步：报告
		report: null, // 结构化报告数据
		plan7Days: null, // 7天强化计划
		reportGenerated: false // 是否已生成报告
	}),

	getters: {
		// 返回简历选择的类型: 'resume' | 'text'
		resumeType: (state) => {
			if (state.resumeId) return 'resume'
			if (state.resumeText) return 'text'
			return ''
		},
		// 是否可以进入下一步
		canGoToNextStep: (state) => {
			if (state.currentStep === 1) {
				return (
					!isEmpty(state.selectedPosition) &&
					(state.resumeId || state.resumeText)
				)
			}
			if (state.currentStep === 2) {
				return state.interviewStatus === 'ended'
			}
			return false
		},

		// 是否正在进行面试
		isInterviewing: (state) => {
			return (
				state.interviewStatus === 'in_progress' ||
				state.interviewStatus === 'starting'
			)
		}
	},

	actions: {
		// 选择岗位
		setSelectedPosition(position) {
			this.selectedPosition = position
		},

		// 选择服务类型
		setSelectedService(service) {
			this.selectedService = service
		},

		// 开始面试
		startInterview(interviewId) {
			this.interviewId = interviewId
			this.interviewStatus = 'starting'
			this.messages = []
			this.currentStep = 2
		},

		// 添加消息
		addMessage(role, content) {
			this.messages.push({
				role,
				content,
				timestamp: new Date()
			})
		},

		// 更新最后一条消息（用于流式输出）
		updateLastMessage(content) {
			if (
				this.messages.length > 0 &&
				this.messages[this.messages.length - 1].role === 'assistant'
			) {
				this.messages[this.messages.length - 1].content = content
			} else {
				this.addMessage('assistant', content)
			}
		},

		// 设置流式状态
		setStreaming(isStreaming) {
			this.isStreaming = isStreaming
		},

		// 结束面试
		endInterview() {
			this.interviewStatus = 'ended'
			this.isStreaming = false
		},

		// 设置报告
		setReport(report, plan7Days) {
			this.report = report
			this.plan7Days = plan7Days
			this.reportGenerated = true
			this.currentStep = 3
		},

		// 重置面试数据
		resetInterview() {
			this.interviewId = null
			this.interviewStatus = 'idle'
			this.messages = []
			this.isStreaming = false
			this.report = null
			this.plan7Days = null
			this.reportGenerated = false
			this.selectedService = null
		},

		// 完全重置（重新开始）
		reset() {
			this.currentStep = 1
			this.selectedPosition = {}
			this.resumeType = null
			this.resumeId = null
			this.resumeText = ''
			this.resetInterview()
		}
	},

	persist: true
})
