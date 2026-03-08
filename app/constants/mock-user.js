/**
 * 本地开发 Mock 账户（与后端 mock-user.config 约定一致）
 * 仅用于本地联调，不请求登录接口，直接写死为已登录
 */
export const MOCK_USER_ID = 'mock_local_user_001'

/** 请求头带此 Token 时后端视为 Mock 已登录 */
export const MOCK_TOKEN = 'mock'

/** 写死的 Mock 用户信息，与后端 getMockUserSnapshot() 结构一致 */
export const MOCK_USER_INFO = {
	_id: MOCK_USER_ID,
	username: '本地Mock用户',
	email: 'mock@local.dev',
	phone: '',
	avatar: '',
	roles: ['user'],
	isActive: true,
	gender: 'other',
	isVerified: false,
	isVip: true,
	aiInterviewRemainingCount: 99,
	aiInterviewRemainingMinutes: 120,
	wwCoinBalance: 999,
	resumeRemainingCount: 99,
	specialRemainingCount: 99,
	behaviorRemainingCount: 99,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString()
}
