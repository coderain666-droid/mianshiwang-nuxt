<template>
	<div
		class="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 py-8"
	>
		<div class="container px-4 mx-auto max-w-6xl">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- 左侧：用户信息卡片 -->
				<div class="lg:col-span-1">
					<UCard
						class="sticky top-24 rounded-2xl shadow-md hover:shadow-lg transition-all border-0 bg-white/80 backdrop-blur-sm"
					>
						<template #header>
							<h2 class="text-xl font-semibold text-gray-900">个人信息</h2>
						</template>
						<div class="space-y-6">
							<div class="flex">
								<!-- 头像 -->
								<div class="relative flex flex-col items-center justify-center">
									<div class="relative group">
										<UAvatar
											:src="userStore.userInfo.avatar"
											:alt="userStore.userInfo.username || '用户头像'"
											size="3xl"
											class="cursor-pointer"
										/>
										<!-- hover 遮罩 -->
										<div
											class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity"
											@click="editProfileModal = true"
										>
											<UIcon name="i-heroicons-camera" class="w-5 h-5" />
										</div>
									</div>
									<UButton
										color="primary"
										variant="ghost"
										size="sm"
										class="gap-2"
										@click="editProfileModal = true"
									>
										<UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
										编辑资料
									</UButton>
								</div>

								<!-- 用户信息 -->
								<div class="space-y-3">
									<div
										class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
									>
										<div
											class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0 group-hover:bg-primary-200 transition-colors"
										>
											<UIcon
												name="i-heroicons-user"
												class="w-5 h-5 text-primary-600"
											/>
										</div>
										<div class="flex-1 min-w-0">
											<p class="text-xs text-gray-500 mb-1">用户名</p>
											<p class="text-sm font-semibold text-gray-900 truncate">
												{{ userStore.userInfo.username || '未设置' }}
											</p>
										</div>
									</div>

									<div
										class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
									>
										<div
											class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors"
										>
											<UIcon
												name="i-heroicons-envelope"
												class="w-5 h-5 text-blue-600"
											/>
										</div>
										<div class="flex-1 min-w-0">
											<p class="text-xs text-gray-500 mb-1">邮箱</p>
											<p class="text-sm font-semibold text-gray-900 truncate">
												{{ userStore.userInfo.email || '未设置' }}
											</p>
										</div>
									</div>
								</div>
							</div>

							<!-- 旺旺币 与 套餐余额 -->
							<div class="pt-4 border-t border-gray-200">
								<div
									class="relative rounded-2xl p-4 shadow-xl bg-linear-to-br from-primary-600 via-primary-500 to-primary-700 overflow-hidden border border-white/20"
								>
									<span
										class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_55%)]"
									></span>
									<div
										class="absolute -right-12 -top-12 w-40 h-40 bg-white/10 blur-2xl rounded-full"
									></div>

									<div class="relative z-10">
										<div class="flex items-center justify-between mb-2">
											<div>
												<div class="flex items-center gap-2 text-white">
													<UIcon
														name="i-heroicons-currency-dollar"
														class="w-5 h-5 text-white/90"
													/>
													<p class="text-base font-semibold">账户总览</p>
												</div>
											</div>
										</div>

										<div class="mb-2 text-xs text-white/80">
											当前可用旺旺币余额
											<span
												class="ml-2 text-3xl font-bold text-white tracking-tight"
											>
												{{ userStore.userInfo.wwCoinBalance }}
											</span>
											<p class="mt-1 text-[11px] text-white/70">
												20 旺旺币可兑换一次简历押题 / 专项面试 / 综合面试
											</p>
										</div>

										<div class="space-y-3 text-white mb-2">
											<div
												v-for="stat in [
													{
														label: '简历押题',
														value: userStore.userInfo.resumeRemainingCount,
														icon: 'i-heroicons-document-text',
														desc: '剩余押题次数'
													},
													{
														label: '专项面试',
														value: userStore.userInfo.specialRemainingCount,
														icon: 'i-heroicons-light-bulb',
														desc: '专项演练次数'
													},
													{
														label: '综合面试',
														value: userStore.userInfo.behaviorRemainingCount,
														icon: 'i-heroicons-users',
														desc: '综合面试次数'
													}
												]"
												:key="stat.label"
												class="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3"
											>
												<div class="flex items-center gap-3">
													<div
														class="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center"
													>
														<UIcon :name="stat.icon" class="w-5 h-5" />
													</div>
													<div>
														<p class="text-sm text-white/90 font-medium">
															{{ stat.label }}
														</p>
														<p class="text-xs text-white/70">{{ stat.desc }}</p>
													</div>
												</div>
												<p class="text-2xl font-semibold">
													{{ stat.value }}
													<span class="text-xs font-normal text-white/70 ml-1">
														次
													</span>
												</p>
											</div>
										</div>

										<!-- 快捷操作 -->
										<div class="flex flex-wrap gap-3 pt-1">
											<UButton
												color="warning"
												variant="solid"
												class="flex-1 min-w-[120px] justify-center shadow-lg shadow-white/20 hover:shadow-white/30"
												@click="rechargeModal = true"
											>
												<UIcon
													name="i-heroicons-plus-circle"
													class="w-4 h-4 mr-1"
												/>
												充值旺旺币
											</UButton>
											<UButton
												variant="ghost"
												color="white"
												class="flex-1 min-w-[120px] justify-center text-white/90 border border-white/30 bg-white/5 hover:bg-white/15"
												@click="rechargeModal = true"
											>
												<UIcon
													name="i-heroicons-arrow-path-rounded-square"
													class="w-4 h-4 mr-1"
												/>
												套餐兑换
											</UButton>
										</div>
									</div>
								</div>

								<!-- 充值加赠提示 -->
								<!-- <div
									class="mt-4 rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 via-white to-amber-50 p-3 pl-4"
								>
									<div class="flex items-center gap-3 text-xs text-amber-800">
										<div
											class="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner"
										>
											<UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
										</div>
										<div class="flex-1">
											<p class="font-semibold text-sm">限时充值加赠</p>
											<p class="text-[11px] text-amber-700/80 mt-0.5">
												首次充值立返 20% 旺旺币，下一档折扣自动解锁
											</p>
										</div>
										<span
											class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 px-2 py-1 rounded-full bg-amber-100 border border-amber-200"
										>
											<UIcon name="i-heroicons-bolt" class="w-3.5 h-3.5" />
											限时
										</span>
									</div>
								</div> -->
							</div>
						</div>
					</UCard>
				</div>

				<!-- 右侧：主要内容区域 -->
				<div class="lg:col-span-2 space-y-6">
					<!-- TODO：设计一个充值积分的体系，充值多少或者模拟面试多少次，有对应的等级和排名 -->

					<!-- 旺旺币记录 -->
					<UCard
						class="rounded-2xl shadow-md hover:shadow-lg transition-all border-0 bg-white/80 backdrop-blur-sm"
					>
						<template #header>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<UIcon
										name="i-heroicons-chart-bar"
										class="w-5 h-5 text-primary-600"
									/>
									<h2 class="text-base font-semibold text-gray-900">
										旺旺币记录
									</h2>
								</div>
							</div>
						</template>

						<!-- 充值记录 -->
						<!-- <div class="space-y-4">
							<div
								v-if="userStore.wallet.rechargeRecords.length === 0"
								class="flex flex-col justify-center items-center py-12 text-gray-500"
							>
								<UIcon
									name="i-heroicons-wallet"
									class="w-12 h-12 mx-auto mb-4 text-gray-300"
								/>
								<p>暂无充值记录</p>
							</div>
							<div v-else class="space-y-3">
								<div
									v-for="(record, index) in userStore.wallet.rechargeRecords"
									:key="index"
									class="flex items-center justify-between p-4 bg-linear-to-r from-green-50 to-white rounded-xl hover:from-green-100 hover:shadow-md transition-all border border-green-100/50"
								>
									<div class="flex items-center gap-4">
										<div
											class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"
										>
											<UIcon
												name="i-heroicons-arrow-down-circle"
												class="w-5 h-5 text-green-600"
											/>
										</div>
										<div>
											<p class="font-medium text-gray-900">
												{{ record.planName || '充值' }}
											</p>
											<p class="text-xs text-gray-500 flex items-center gap-1">
												<span>{{ formatDate(record.createTime) }}</span>
												<span v-if="getPaymentLabel(record)">
													· {{ getPaymentLabel(record) }}
												</span>
											</p>
										</div>
									</div>
									<div class="text-right">
										<p class="font-semibold text-green-600">
											+{{ record.amount }}
										</p>
										<p class="text-xs text-gray-500">
											订单号: {{ record.orderNo }}
										</p>
									</div>
								</div>
							</div>
						</div> -->
					</UCard>

					<!-- 简历管理 -->
					<UCard
						class="rounded-2xl shadow-md hover:shadow-lg transition-all border-0 bg-white/80 backdrop-blur-sm"
					>
						<template #header>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<UIcon
										name="i-heroicons-folder"
										class="w-5 h-5 text-primary-600"
									/>
									<h2 class="text-base font-semibold text-gray-900">
										我的简历
									</h2>
									<span
										class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
									>
										{{ userStore.resumes.length }}/5
									</span>
								</div>
								<div class="flex items-center">
									<NuxtLink
										to="https://resume.lgdsunday.club/"
										class="text-[12px] mr-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 transition-all font-medium border border-primary-200"
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>免费制作简历（简历汪）</span>
										<UIcon
											name="i-heroicons-arrow-top-right-on-square"
											class="w-3.5 h-3.5"
										/>
									</NuxtLink>
									<UButton
										v-if="userStore.canAddResume"
										color="primary"
										variant="solid"
										@click="uploadResumeModal = true"
									>
										<UIcon name="i-heroicons-plus" class="w-4 h-4 mr-1" />
										上传简历
									</UButton>
									<span v-else class="text-sm text-gray-500">
										最多上传 5 份简历
									</span>
								</div>
							</div>
						</template>

						<!-- 简历列表 -->
						<ResumeList />
					</UCard>
				</div>
			</div>
		</div>

		<!-- 编辑个人信息弹窗 -->
		<EditProfileModal
			v-model:open="editProfileModal"
			:user-info="userStore.userInfo"
			@update="handleProfileUpdate"
		/>

		<!-- 上传简历弹窗 -->
		<UploadResumeModal
			v-model:open="uploadResumeModal"
			@uploaded="handleResumeUploaded"
		/>

		<!-- 充值弹窗 -->
		<RechargeModal
			v-model:open="rechargeModal"
			:balance="userStore.walletBalance"
			@recharge="handleRecharge"
			@redeem="handleRedeem"
		/>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from '#imports'
import EditProfileModal from '@/components/profile/EditProfileModal.vue'
import UploadResumeModal from '@/components/profile/UploadResumeModal.vue'
import ResumeList from '@/components/profile/ResumeList.vue'
import RechargeModal from '@/components/profile/RechargeModal.vue'
import { getResumeListAPI } from '@/api/resume'
import { getUserInfoAPI } from '@/api/user'
import dayjs from 'dayjs'

definePageMeta({
	requiresAuth: true
})

useHead({
	title: '个人中心 - 面试汪'
})

useSeoMeta({
	title: '个人中心 - 面试汪',
	description: '管理您的个人信息、旺旺币和简历'
})

const userStore = useUserStore()
const toast = useToast()
const { $api } = useNuxtApp()

const editProfileModal = ref(false)
const uploadResumeModal = ref(false)
const rechargeModal = ref(false)

const SERVICE_REDEEM_COST = 20

const paymentLabelMap = {
	wechat: '微信支付',
	alipay: '支付宝',
	bank: '银行卡'
}

/**
 * 获取用户信息
 */
const initUserInfo = async () => {
	const res = await getUserInfoAPI($api)
	// if (res.success) {
	// 	userStore.userInfo = res.data
	// }
}
initUserInfo()

const getPaymentLabel = (record) => {
	if (!record) return ''
	return record.paymentLabel || paymentLabelMap[record.paymentMethod] || ''
}

// 格式化日期
const formatDate = (date) => {
	if (!date) return ''
	return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 处理个人信息更新
const handleProfileUpdate = async (updatedInfo) => {
	try {
		userStore.updateUserInfo(updatedInfo)
		toast.add({
			title: '更新成功',
			color: 'success'
		})
		editProfileModal.value = false
	} catch (error) {
		toast.add({
			title: '更新失败',
			description: error.message,
			color: 'error'
		})
	}
}

// 简历上传成功之后的回调
const handleResumeUploaded = async () => {
	// TODO：重新获取简历列表
	const res = await getResumeListAPI($api)

	userStore.resumes = res || []
}

// 处理简历删除
const handleResumeDelete = (index) => {
	userStore.removeResume(index)
	toast.add({
		title: '删除成功',
		color: 'success'
	})
}

// 处理充值
const handleRecharge = (rechargeData) => {
	// 更新余额
	userStore.updateWalletBalance(userStore.walletBalance + rechargeData.amount)

	const planLabel = rechargeData.planName || '自定义充值'
	// 添加充值记录
	userStore.addRechargeRecord({
		amount: rechargeData.amount,
		orderNo: rechargeData.orderNo,
		createTime: new Date().toISOString(),
		planName: planLabel,
		price: rechargeData.price,
		originalPrice: rechargeData.originalPrice,
		saving: rechargeData.saving,
		validDays: rechargeData.validDays,
		paymentMethod: rechargeData.paymentMethod,
		paymentLabel: rechargeData.paymentLabel
	})

	const paymentName =
		rechargeData.paymentLabel ||
		paymentLabelMap[rechargeData.paymentMethod] ||
		''

	toast.add({
		title: '充值成功',
		description: `${planLabel}：到账 ${rechargeData.amount} 旺旺币${
			paymentName ? ` · ${paymentName}` : ''
		}`,
		color: 'success'
	})
}

const handleRedeem = (payload) => {
	if (userStore.walletBalance < SERVICE_REDEEM_COST) {
		toast.add({
			title: '旺旺币不足',
			description: '余额不足，无法兑换该服务',
			color: 'warning'
		})
		return
	}

	userStore.updateWalletBalance(userStore.walletBalance - SERVICE_REDEEM_COST)

	userStore.addConsumptionRecord({
		type: payload.serviceType,
		amount: SERVICE_REDEEM_COST,
		description: `${payload.serviceLabel}兑换一次服务`,
		createTime: new Date().toISOString()
	})

	toast.add({
		title: '兑换成功',
		description: `已使用 ${SERVICE_REDEEM_COST} 旺旺币兑换 ${payload.serviceLabel} 1 次`,
		color: 'success'
	})
}
</script>

<style scoped></style>
