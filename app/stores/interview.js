import { defineStore } from 'pinia'

export const useInterviewStore = defineStore('interview', {
	state: () => ({
		// 当前步骤：1-选择岗位和简历, 2-面试中, 3-查看报告
		currentStep: 1,
		// 侧边栏是否打开
		isSidebarOpen: true,
		selectedService: null,
		targetCompany: '',

		// 第一步：岗位和简历
		selectedPosition: null, // { id, name, category, ... }
		resumeType: null, // 简历类型：'resume' | 'text'
		resumeId: null, // 简历 ID（当 type='resume' 时）
		resumeText: '', // 简历文本（当 type='text' 时）

		// 第二步：面试过程
		interviewId: null, // 面试会话 ID
		interviewStatus: 'idle', // idle, starting, in_progress, ended
		messages: [], // 对话消息列表 [{ role: 'user'|'assistant', content: string, timestamp: Date }]
		isStreaming: false, // 是否正在流式输出

		// 第三步：报告
		report: null, // 结构化报告数据
		plan7Days: null, // 7天强化计划
		reportGenerated: false // 是否已生成报告
	}),

	getters: {
		// 是否可以进入下一步
		canGoToNextStep: (state) => {
			if (state.currentStep === 1) {
				return state.selectedPosition && (state.resumeId || state.resumeText)
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
		// 设置当前步骤
		setCurrentStep(step) {
			this.currentStep = step
		},

		// 选择岗位
		selectPosition(position) {
			this.selectedPosition = position
		},

		// 选择服务类型
		setSelectedService(service) {
			this.selectedService = service
		},

		// 设置目标公司
		setTargetCompany(company) {
			this.targetCompany = company
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
			this.targetCompany = ''
		},

		// 完全重置（重新开始）
		reset() {
			this.currentStep = 1
			this.selectedPosition = null
			this.resumeType = null
			this.resumeId = null
			this.resumeText = ''
			this.resetInterview()
		}
	},

	persist: true
})
