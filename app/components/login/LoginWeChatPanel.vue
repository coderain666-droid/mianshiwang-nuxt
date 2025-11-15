<template>
	<div
		class="card relative overflow-hidden border border-gray-200 bg-white p-8 shadow-lg"
	>
		<!-- 增加一个测试登录的按钮 -->
		<UButton @click="testLogin">测试登录</UButton>
		<div
			class="absolute -top-24 right-10 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl"
		></div>
		<div class="flex items-center justify-between gap-4">
			<div>
				<h2 class="text-xl font-semibold text-neutral-900">微信登录</h2>
				<p class="text-sm text-neutral-500">扫码或点击按钮，快速进入面试汪</p>
			</div>
			<div
				class="rounded-full bg-emerald-500/10 p-2 text-emerald-600 leading-0"
			>
				<UIcon name="i-simple-icons-wechat" class="h-6 w-6" />
			</div>
		</div>

		<div class="mt-8 text-center">
			<div v-if="!scanSuccess">
				<!-- 扫码登录二维码（包含二维码过期提示） -->
				<div class="relative mx-auto h-52 w-52">
					<div
						class="absolute inset-0 rounded-2xl border border-dashed border-neutral-200 bg-gradient-to-br from-white to-neutral-50 shadow-inner shadow-black/5"
					></div>
					<img
						:src="qrCodeUrl"
						alt="微信扫码登录二维码"
						class="relative z-10 h-full w-full rounded-2xl object-cover p-3"
						:class="{ 'opacity-20': isExpired }"
					/>
					<div
						v-if="isExpired"
						class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-white/90 text-sm text-neutral-600"
					>
						<p>二维码已过期</p>
						<UButton
							class="mt-3 text-white"
							color="primary"
							size="sm"
							@click="refreshQr"
						>
							<template #leading>
								<UIcon name="i-heroicons-arrow-path" />
							</template>
							刷新二维码
						</UButton>
					</div>
					<!-- 刷新二维码按钮 -->
					<button
						type="button"
						class="absolute -bottom-3 -right-4 z-30 rounded-full border border-white bg-white p-2 shadow-md transition hover:scale-105 leading-0"
						@click="refreshQr"
						aria-label="刷新二维码"
					>
						<UIcon
							name="i-heroicons-arrow-path"
							class="h-4 w-4 text-neutral-500"
						/>
					</button>
				</div>
				<p class="text-xs text-neutral-500 mt-4">
					使用微信扫一扫登录，{{ countDown }} 秒后二维码将自动更新。
				</p>
				<div
					class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 mt-4 text-xs text-emerald-600"
				>
					<UIcon name="i-heroicons-lock-closed" />
					微信官方授权，账号安全无忧
				</div>
			</div>

			<!-- 扫码成功之后的提示 -->
			<div v-else class="mt-8 space-y-4 text-center">
				<div class="relative mx-auto h-52 w-52">
					<div
						class="absolute inset-0 rounded-2xl border border-dashed border-neutral-200 bg-gradient-to-br from-white to-neutral-50 shadow-inner shadow-black/5"
					></div>
					<div
						class="relative z-10 h-full w-full rounded-2xl p-3 flex flex-col items-center justify-center"
					>
						<UIcon
							name="i-heroicons-check-circle"
							class="h-16 w-16 text-emerald-600"
						/>
						<p class="mt-3 text-sm text-neutral-800">扫码确认成功</p>
						<p class="mt-1 text-xs text-neutral-500">
							正在跳转到刚才浏览的页面…
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-8 flex items-start gap-2 text-xs text-neutral-500">
			<UCheckbox
				v-model="agree"
				name="agreement"
				color="success"
				aria-label="同意协议"
			/>
			<p class="leading-[20px]">
				继续登录即表示你已阅读并同意
				<UModal scrollable title="服务协议" description="请仔细阅读以下条款">
					<span class="text-primary hover:underline cursor-pointer"
						>《服务协议》</span
					>
					<template #body>
						<div class="prose prose-sm max-w-none text-neutral-800">
							<h2>一、协议说明</h2>
							<p>
								本《服务协议》（以下简称“本协议”）是您（“用户”或“您”）与面试汪（以下简称“我们”）之间关于使用本平台及相关产品/服务所订立的法律文本。您在注册、登录、或使用本平台服务之前，应当认真阅读并充分理解本协议。一旦您使用或继续使用，即视为您已阅读并同意本协议的全部内容。
							</p>
							<h2>二、服务范围与对象</h2>
							<p>
								我们提供面向多职业的 AI
								模拟面试训练、题库与评估服务，适用于个人或机构。部分功能可能需要付费开通或受使用限制，具体以页面说明或订单为准。
							</p>
							<h2>三、账户注册与使用</h2>
							<ul>
								<li>您应当保证注册信息真实、准确、完整，并及时更新。</li>
								<li>账户仅限本人使用，不得出租、转借或共享。</li>
								<li>如发现账号被盗用或存在安全风险，请及时与我们联系。</li>
							</ul>
							<h2>四、付费、退款与开票</h2>
							<ul>
								<li>付费服务的价格、时长、权益以页面或订单展示为准。</li>
								<li>
									虚拟服务一经开通，除法律法规另有规定或页面明确说明外，不支持无理由退款。
								</li>
								<li>如需发票，请按照指引在订单完成后申请。</li>
							</ul>
							<h2>五、用户内容与版权</h2>
							<ul>
								<li>
									您应对自行上传或生成的内容负责，不得侵犯任何第三方合法权益。
								</li>
								<li>
									您授权我们在提供服务所必需的范围内使用相关内容（例如用于模型评估与改进）。
								</li>
								<li>
									平台自身的界面、算法、题库与评价体系等受版权与相关法律保护，未经许可不得复制、转载或用于商业竞争。
								</li>
							</ul>
							<h2>六、数据与隐私保护</h2>
							<p>
								我们高度重视个人信息保护，具体政策请参见《隐私政策》。除法律法规或监管要求外，我们不会将可识别个人的信息出售给第三方。
							</p>
							<h2>七、使用规范与禁止行为</h2>
							<ul>
								<li>不得用于违法违规或有悖公序良俗的目的。</li>
								<li>不得以任何方式攻击平台、绕过访问控制或进行恶意爬取。</li>
								<li>不得用于训练与构建竞争性产品的核心数据抓取。</li>
							</ul>
							<h2>八、免责声明与责任限制</h2>
							<p>
								我们将尽最大努力保障服务稳定与准确，但不对所有场景下的结果、适用性或用户获得的就业机会作出保证。因不可抗力或第三方原因导致的服务不可用或数据损失，我们不承担相应责任。
							</p>
							<h2>九、服务变更与中止</h2>
							<p>
								我们可能根据业务与法律要求调整、暂停或终止部分服务，并尽可能提前在网站或页面公告。重大变更将通过公告或邮件等方式通知用户。
							</p>
							<h2>十、适用法律与争议解决</h2>
							<p>
								本协议的订立、执行与解释，适用中国法律。因本协议产生的争议，优先友好协商解决；协商不成的，提交有管辖权的人民法院裁决。
							</p>
						</div>
					</template>
				</UModal>
				和
				<UModal
					scrollable
					title="隐私政策"
					description="了解我们如何处理与保护您的数据"
				>
					<span class="text-primary hover:underline cursor-pointer"
						>《隐私政策》</span
					>
					<template #body>
						<div class="prose prose-sm max-w-none text-neutral-800">
							<h2>一、信息收集</h2>
							<p>
								我们可能收集您在使用服务过程中主动提供的个人信息，以及在使用过程中的日志数据、设备信息等，用于保障服务稳定与优化体验。
							</p>
							<h2>二、信息使用</h2>
							<p>
								我们使用收集的信息用于身份验证、功能提供、服务优化与安全防护，不会在未获授权的情况下对外提供可识别个人的信息。
							</p>
							<h2>三、信息共享与披露</h2>
							<p>
								除法律法规、监管要求或履行必要的服务支持外，我们不会将您的个人信息出售或共享给无关第三方。
							</p>
							<h2>四、数据安全</h2>
							<p>
								我们采用合理的安全措施保护数据安全，包括访问控制、加密传输与安全审计，但仍建议您妥善保管账户与凭证。
							</p>
							<h2>五、您的权利</h2>
							<p>
								您有权访问、更正或删除自己的个人信息，并可通过站点提供的联系方式与我们取得联系处理相关请求。
							</p>
							<h2>六、政策更新</h2>
							<p>
								我们可能不时更新本政策，重大变更将通过站点公告或邮件提示。继续使用服务即视为您接受更新后的政策。
							</p>
							<h2>七、联系与投诉</h2>
							<p>
								如需咨询或投诉，请通过站点页面的联系方式与我们取得联系：
								<a
									class="text-primary-400 hover:underline"
									href="mailto:lgd_sunday@163.com"
									target="_email"
									>lgd_sunday@163.com</a
								>
							</p>
						</div>
					</template>
				</UModal>
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useNuxtApp, useToast } from '#imports'
import {
	generateWechatQRCodeAPI,
	checkWechatQRCodeStatusAPI,
	testLogin as testLoginAPI
} from '@/api/login'
import { useUserStore } from '@/stores/user'
import { handleLoginSuccess } from '@/permission'

// 组件向父级抛出的事件：微信快速登录请求、二维码刷新提示
const emit = defineEmits(['refreshQr'])

const userStore = useUserStore()

// 二维码有效倒计时（秒）
const countDown = ref(300)
// 用于触发二维码刷新（防缓存）
const qrSeed = ref(Date.now())
// 同意协议开关
const agree = ref(true)

// 二维码图片地址（由后端返回的真实登录二维码链接）
const qrCodeUrl = ref('')
const qrCodeId = ref('') // 二维码ID
const scanSuccess = ref(false)

// 是否过期：倒计时归零视为过期
const isExpired = computed(() => countDown.value <= 0)

// 倒计时计时器句柄
let timer = null
// 扫码状态轮询计时器
let qrCodeCheckTimer = null

// 启动倒计时（每次刷新二维码都会重置）
const startTimer = () => {
	if (timer) {
		window.clearInterval(timer)
		timer = null
	}
	countDown.value = 300
	timer = window.setInterval(() => {
		if (countDown.value > 0) {
			countDown.value -= 1
		} else {
			// 到期后自动刷新二维码（与文案保持一致）
			refreshQr()
		}
	}, 1000)
}

// 通过接口获取微信扫码登录二维码，并更新展示
const { $api } = useNuxtApp()

// 拉取二维码地址（后端可能返回不同字段名，做兼容处理）
const loadQrCode = async () => {
	const response = await generateWechatQRCodeAPI($api)
	qrCodeUrl.value = response.qrCodeUrl
	qrCodeId.value = response.qrCodeId
	startQRCodeCheck()
}

// 检查二维码状态
async function checkQRCodeStatus() {
	try {
		// 调用后端接口检查扫码状态
		const response = await checkWechatQRCodeStatusAPI($api, qrCodeId.value)

		if (response.user && response.token) {
			// 用户已关注公众号并确认登录
			// 为 userStore 赋值
			userStore.isLogin = true
			userStore.userInfo = response.user
			userStore.token = response.token

			// 停止轮询，避免多次跳转
			if (qrCodeCheckTimer) {
				clearInterval(qrCodeCheckTimer)
				qrCodeCheckTimer = null
			}
			// 切换组件 UI，隐藏二维码
			scanSuccess.value = true
			// 停止倒计时
			if (timer) {
				window.clearInterval(timer)
				timer = null
			}
			// 使用统一的登录成功处理，跳转回登录前的页面（稍作停留展示成功UI）
			setTimeout(() => handleLoginSuccess(), 1200)
		}
	} catch (error) {
		// console.error('检查二维码状态失败:', error)
		// 如果是网络错误，继续检查
	}
}

// 开始检查扫码状态
function startQRCodeCheck() {
	qrCodeCheckTimer = setInterval(() => {
		checkQRCodeStatus()
	}, 2000)
}

// 刷新二维码：更新种子、重置倒计时、拉取新链接并通知父组件
const refreshQr = async () => {
	qrSeed.value = Date.now()
	startTimer()
	await loadQrCode()
	emit('refreshQr')
}

// 组件挂载后，启动倒计时并立即拉取一次二维码
onMounted(async () => {
	startTimer()
	await loadQrCode()
})

// 组件卸载前清理计时器
onBeforeUnmount(() => {
	if (timer) {
		window.clearInterval(timer)
	}
})

/**
 * 本地测试登录
 */
const testLogin = async () => {
	const response = await testLoginAPI($api)
	// 用户已关注公众号并确认登录
	// 为 userStore 赋值
	userStore.isLogin = true
	userStore.userInfo = response.user
	userStore.token = response.token

	// 停止轮询，避免多次跳转
	if (qrCodeCheckTimer) {
		clearInterval(qrCodeCheckTimer)
		qrCodeCheckTimer = null
	}
	// 切换组件 UI，隐藏二维码
	scanSuccess.value = true
	// 停止倒计时
	if (timer) {
		window.clearInterval(timer)
		timer = null
	}
	// 使用统一的登录成功处理，跳转回登录前的页面（稍作停留展示成功UI）
	setTimeout(() => handleLoginSuccess(), 1200)
}
</script>

<style scoped></style>
