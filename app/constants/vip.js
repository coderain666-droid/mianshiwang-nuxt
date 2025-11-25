// 兑换一次服务（服务包含简历押题 / 专项面试 / 综合面试）的成本
export const REDEEM_COST = 20

// 自定义充值
export const CUSTOM_RECHARGE_ID = 'custom'
// 服务标记
export const SERVICE_TAGS = {
	RESUME: 'resume',
	SPECIAL: 'special',
	BEHAVIOR: 'behavior'
}

// 服务亮点列表
export const serviceHighlights = [
	{
		id: SERVICE_TAGS.RESUME,
		title: '简历押题',

		badge: '洞察岗位',
		description: '面试知己知彼，精准拆解岗位需求。',
		points: ['结合岗位 JD 输出押题清单', '附带示范答案与提醒'],
		icon: 'i-heroicons-document-text'
	},
	{
		id: SERVICE_TAGS.SPECIAL,
		title: '专项面试',
		badge: '专业技能',
		description: '靶向练习，技术+专业场景训练更高效。', // 针对技术面试、专业场景面试进行训练，提升应对能力。
		points: ['模拟真实面试问答', 'AI 即时反馈与追问'],
		icon: 'i-heroicons-bolt'
	},
	{
		id: SERVICE_TAGS.BEHAVIOR,
		title: '行测 + HR 面试',
		badge: '全方位',
		description: '全面评估应试者的基础素质与软技能，帮助提升面试全局表现。',
		points: [
			'行测题库与模拟测试',
			'HR 面试软技能评估与反馈',
			'评估沟通与表达能力'
		],
		icon: 'i-heroicons-chat-bubble-left-right'
	}
]

// 充值套餐列表
// 需要和 后端套餐验证一致才有效。不从后端获取数据的原因为：尽量减少接口请求次数
export const rechargePlans = [
	{
		id: 'single',
		name: '单次包',
		description: '搞定 1 轮面试，低门槛应急',
		tagline: '搞定 1 轮面试，低门槛应急',
		price: 18.8,
		originalPrice: 20,
		saving: 1.2,
		coins: 18.8,
		badge: '',
		perks: [
			{ key: SERVICE_TAGS.RESUME, label: serviceHighlights[0].title, count: 0 },
			{
				key: SERVICE_TAGS.SPECIAL,
				label: serviceHighlights[1].title,
				count: 1
			},
			{
				key: SERVICE_TAGS.BEHAVIOR,
				label: serviceHighlights[2].title,
				count: 0
			}
		]
	},
	{
		id: 'pro',
		name: '突击包',
		description: '适合临时面试，快速补齐短板',
		tagline: '搞定 1 轮面试，低门槛应急',
		price: 28.8,
		originalPrice: 60,
		saving: 28.8,
		coins: 28.8,
		badge: '热销',
		perks: [
			{ key: SERVICE_TAGS.RESUME, label: serviceHighlights[0].title, count: 1 },
			{
				key: SERVICE_TAGS.SPECIAL,
				label: serviceHighlights[1].title,
				count: 1
			},
			{
				key: SERVICE_TAGS.BEHAVIOR,
				label: serviceHighlights[2].title,
				count: 1
			}
		]
	},
	{
		id: 'max',
		name: '冲刺包',
		description: '性价比之王，覆盖多轮面试',
		tagline: '3.8 折！入职性价比之王',
		price: 68.8,
		originalPrice: 180,
		saving: 111.2,
		coins: 68.8,
		perks: [
			{ key: SERVICE_TAGS.RESUME, label: serviceHighlights[0].title, count: 3 },
			{
				key: SERVICE_TAGS.SPECIAL,
				label: serviceHighlights[1].title,
				count: 3
			},
			{
				key: SERVICE_TAGS.BEHAVIOR,
				label: serviceHighlights[2].title,
				count: 3
			}
		]
	},
	{
		id: 'ultra',
		name: '上岸包',
		description: '高频练习，多岗位冲刺专用',
		tagline: '2.1 折！面试次数拉满',
		price: 128.8,
		originalPrice: 600,
		saving: 471.2,
		coins: 128.8,
		badge: '高性价比',
		perks: [
			{ key: SERVICE_TAGS.RESUME, label: serviceHighlights[0].title, count: 6 },
			{
				key: SERVICE_TAGS.SPECIAL,
				label: serviceHighlights[1].title,
				count: 16
			},
			{
				key: SERVICE_TAGS.BEHAVIOR,
				label: serviceHighlights[2].title,
				count: 8
			}
		]
	}
]

// 支付方式列表
export const paymentMethods = [
	{
		id: 'wechat',
		label: '微信支付',
		description: '推荐，秒级到账',
		icon: 'wechat'
	},
	{
		id: 'alipay',
		label: '支付宝',
		description: '支持花呗分期',
		icon: 'alipay'
	}
]

// 兑换服务列表
export const redeemServices = [
	{ type: SERVICE_TAGS.RESUME, label: serviceHighlights[0].title },
	{ type: SERVICE_TAGS.SPECIAL, label: serviceHighlights[1].title },
	{ type: SERVICE_TAGS.BEHAVIOR, label: serviceHighlights[2].title }
]
