<template>
	<section class="container py-12">
		<div class="mb-8">
			<h1 class="text-3xl font-bold">隐私政策</h1>
			<p class="mt-2 text-sm text-white/60">最近更新：{{ lastUpdated }}</p>
			<p class="mt-3 text-white/80">{{ SEO.defaultDescription }}</p>
		</div>

		<div class="prose prose-invert max-w-none">
			<h2>一、我们收集的信息</h2>
			<ul>
				<li>账号信息：如手机号、邮箱、微信标识（openid/unionid）等。</li>
				<li>使用数据：功能使用记录、题库练习数据、偏好设置与反馈。</li>
				<li>设备信息：浏览器类型、操作系统、网络信息、Cookie/本地存储等。</li>
			</ul>

			<h2>二、信息使用目的</h2>
			<ul>
				<li>提供、维护与优化服务体验与性能。</li>
				<li>用于模型评估、题库改进与个性化推荐。</li>
				<li>保障安全与风控，防止欺诈与滥用。</li>
			</ul>

			<h2>三、Cookie 与本地存储</h2>
			<p>
				我们可能在您的设备上写入必要的 Cookie
				或本地存储，用于登录态维持、偏好设置、统计分析与安全验证。您可在浏览器中进行限制或清除，但可能影响部分功能正常使用。
			</p>

			<h2>四、信息共享与第三方</h2>
			<p>
				我们不会出售可识别个人的信息。仅在以下情况可能共享：依法配合监管或司法机关、维权需要、或与受信任的服务提供方在必要范围内合作（并受保密与安全义务约束）。
			</p>

			<h2>五、跨境传输</h2>
			<p>
				如因业务需要涉及跨境数据传输，我们将遵循法律法规与监管要求，并采取合规的安全措施与评估。
			</p>

			<h2>六、信息安全</h2>
			<p>
				我们采用合理的技术与管理措施保护数据安全，包括访问控制、加密、脱敏等。但鉴于网络环境复杂性，无法保证绝对安全。
			</p>

			<h2>七、您的权利</h2>
			<ul>
				<li>访问、更正与删除个人信息。</li>
				<li>撤回授权或反对特定处理（在法律与合同允许范围内）。</li>
				<li>申请账户注销与数据导出（如适用）。</li>
			</ul>

			<h2>八、数据保留</h2>
			<p>
				我们将在实现目的所需的最短期限内保留数据，超过期限后将删除或匿名化处理，除非法律法规另有要求或允许更长的保留。
			</p>

			<h2>九、未成年人保护</h2>
			<p>
				如您为未成年人，应在监护人指导下使用我们的服务并谨慎提交个人信息。未经监护人同意，我们不会主动收集未成年人的个人信息。
			</p>

			<h2>十、第三方服务与链接</h2>
			<p>
				平台可能接入第三方服务（如微信登录、分析与支付等）。对于第三方的隐私实践，请参阅其公布的政策与条款。
			</p>

			<h2>十一、政策更新</h2>
			<p>
				我们可能不时更新本政策。重大变更将通过站点公告或邮件等方式提示。继续使用服务即视为您接受更新后的政策。
			</p>

			<h2>十二、联系与投诉</h2>
			<p>
				如需咨询或投诉，请通过站点页面的联系方式与我们取得联系：
				<a
					class="text-primary-400 hover:underline"
					href="mailto:lgd_sunday@163.com"
					target="_email"
				>
					lgd_sunday@163.com
				</a>
			</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import { SEO } from '@/constants/seo'
import { useHead } from 'nuxt/app'

const lastUpdated = new Date().toISOString().slice(0, 10)

useHead({
	title: `${SEO.siteName} - 隐私政策`,
	meta: [
		{ name: 'description', content: SEO.defaultDescription },
		{ name: 'robots', content: 'index,follow' }
	]
})
</script>

<style scoped>
.prose :where(h2) {
	margin-top: 1.5em;
}
</style>
