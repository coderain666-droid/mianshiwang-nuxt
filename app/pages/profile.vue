<template>
	<div class="min-h-screen bg-gray-50 py-8">
		<div class="container px-4 mx-auto max-w-6xl">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- 左侧：用户信息卡片 -->
				<div class="lg:col-span-1">
					<UCard
						class="sticky top-24 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
					>
						<template #header>
							<h2 class="text-xl font-semibold text-gray-900">个人信息</h2>
						</template>
						<div class="space-y-6">
							<!-- 头像 -->
							<div class="relative flex flex-col items-center">
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
									class="mt-4 gap-2"
									@click="editProfileModal = true"
								>
									<UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
									编辑资料
								</UButton>
							</div>

							<!-- 用户信息 -->
							<div class="space-y-4">
								<div class="flex items-start gap-3">
									<UIcon
										name="i-heroicons-user"
										class="w-5 h-5 text-gray-400 mt-0.5"
									/>
									<div class="flex-1 min-w-0">
										<p class="text-xs text-gray-500 mb-1">用户名</p>
										<p class="text-sm font-medium text-gray-900 truncate">
											{{ userStore.userInfo.username || '未设置' }}
										</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<UIcon
										name="i-heroicons-envelope"
										class="w-5 h-5 text-gray-400 mt-0.5"
									/>
									<div class="flex-1 min-w-0">
										<p class="text-xs text-gray-500 mb-1">邮箱</p>
										<p class="text-sm font-medium text-gray-900 truncate">
											{{ userStore.userInfo.email || '未设置' }}
										</p>
									</div>
								</div>
							</div>

							<!-- 旺旺币余额 -->
							<div class="pt-4 border-t border-gray-200">
								<div
									class="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 shadow-inner"
								>
									<p class="text-xs text-gray-600 mb-1">旺旺币余额</p>
									<p class="text-2xl font-bold text-primary-600">
										{{ userStore.walletBalance }}
									</p>
								</div>
							</div>
						</div>
					</UCard>
				</div>

				<!-- 右侧：主要内容区域 -->
				<div class="lg:col-span-2 space-y-6">
					<!-- 旺旺币记录 -->
					<UCard
						class="rounded-2xl shadow-sm hover:shadow-md transition-shadow"
					>
						<template #header>
							<div class="flex items-center justify-between">
								<h2 class="text-xl font-semibold text-gray-900">旺旺币记录</h2>
								<div class="flex gap-2">
									<UButton
										:color="walletTab === 0 ? 'primary' : 'gray'"
										:variant="walletTab === 0 ? 'solid' : 'ghost'"
										size="sm"
										@click="walletTab = 0"
									>
										充值记录
									</UButton>
									<UButton
										:color="walletTab === 1 ? 'primary' : 'gray'"
										:variant="walletTab === 1 ? 'solid' : 'ghost'"
										size="sm"
										@click="walletTab = 1"
									>
										消费记录
									</UButton>
								</div>
							</div>
						</template>

						<!-- 充值记录 -->
						<div v-if="walletTab === 0" class="space-y-4">
							<div
								v-if="userStore.wallet.rechargeRecords.length === 0"
								class="text-center py-12 text-gray-500"
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
									class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
											<p class="font-medium text-gray-900">充值</p>
											<p class="text-sm text-gray-500">
												{{ formatDate(record.createTime) }}
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
						</div>

						<!-- 消费记录 -->
						<div v-else class="space-y-4">
							<div
								v-if="userStore.wallet.consumptionRecords.length === 0"
								class="text-center py-12 text-gray-500"
							>
								<UIcon
									name="i-heroicons-shopping-cart"
									class="w-12 h-12 mx-auto mb-4 text-gray-300"
								/>
								<p>暂无消费记录</p>
							</div>
							<div v-else class="space-y-3">
								<div
									v-for="(record, index) in userStore.wallet.consumptionRecords"
									:key="index"
									class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<div class="flex items-center gap-4">
										<div
											class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center"
										>
											<UIcon
												name="i-heroicons-arrow-up-circle"
												class="w-5 h-5 text-orange-600"
											/>
										</div>
										<div>
											<p class="font-medium text-gray-900">{{ record.type }}</p>
											<p class="text-sm text-gray-500">
												{{ formatDate(record.createTime) }}
											</p>
										</div>
									</div>
									<div class="text-right">
										<p class="font-semibold text-orange-600">
											-{{ record.amount }}
										</p>
										<p class="text-xs text-gray-500">
											{{ record.description }}
										</p>
									</div>
								</div>
							</div>
						</div>
					</UCard>

					<!-- 简历管理 -->
					<UCard
						class="rounded-2xl shadow-sm hover:shadow-md transition-shadow"
					>
						<template #header>
							<div class="flex items-center justify-between">
								<h2 class="text-xl font-semibold text-gray-900">我的简历</h2>
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
						</template>

						<div
							v-if="userStore.resumes.length === 0"
							class="text-center py-12 text-gray-500"
						>
							<UIcon
								name="i-heroicons-document-text"
								class="w-12 h-12 mx-auto mb-4 text-gray-300"
							/>
							<p class="mb-2">暂无简历</p>
							<p class="text-sm">点击上传按钮添加您的第一份简历</p>
						</div>

						<ResumeList
							v-else
							:resumes="userStore.resumes"
							@update-order="handleResumeOrderUpdate"
							@delete="handleResumeDelete"
							@reorder="handleResumeReorder"
						/>
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
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from '#imports'
import EditProfileModal from '@/components/profile/EditProfileModal.vue'
import UploadResumeModal from '@/components/profile/UploadResumeModal.vue'
import ResumeList from '@/components/profile/ResumeList.vue'
import dayjs from 'dayjs'

definePageMeta({
	middleware: 'auth'
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

const editProfileModal = ref(false)
const uploadResumeModal = ref(false)
const walletTab = ref(0)

// 格式化日期
const formatDate = (date) => {
	if (!date) return ''
	return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 处理个人信息更新
const handleProfileUpdate = async (updatedInfo) => {
	try {
		// TODO: 调用API更新用户信息
		// const { $api } = useNuxtApp()
		// await $api.put('/user/profile', updatedInfo)

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

// 处理简历上传
const handleResumeUploaded = (resume) => {
	userStore.addResume(resume)
	toast.add({
		title: '上传成功',
		color: 'success'
	})
	uploadResumeModal.value = false
}

// 处理简历删除
const handleResumeDelete = (index) => {
	userStore.removeResume(index)
	toast.add({
		title: '删除成功',
		color: 'success'
	})
}

// 处理简历排序更新
const handleResumeOrderUpdate = (newOrder) => {
	userStore.updateResumes(newOrder)
	toast.add({
		title: '排序已保存',
		color: 'success'
	})
}

// 处理简历拖拽重排
const handleResumeReorder = (newOrder) => {
	userStore.updateResumes(newOrder)
}
</script>

<style scoped></style>
