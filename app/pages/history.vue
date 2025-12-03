<template>
	<div
		class="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 py-8"
	>
		<div class="container px-4 mx-auto max-w-5xl">
			<div class="mb-8">
				<h1 class="text-2xl font-bold text-gray-900">服务记录</h1>
				<p class="text-gray-500 text-sm mt-1">查看您的历史面试押题与评估记录</p>
			</div>

			<UCard
				class="rounded-2xl shadow-sm border-0 bg-white/80 backdrop-blur-sm ring-1 ring-gray-200"
				:ui="{ body: { padding: 'p-0' } }"
			>
				<UTabs :items="items" class="w-full" color="success">
					<template #resume>
						<div class="p-4 pt-0 min-h-[400px]">
							<!-- 加载状态 -->
							<div
								v-if="status === 'pending'"
								class="flex flex-col items-center justify-center py-12 space-y-4"
							>
								<UIcon
									name="i-heroicons-arrow-path"
									class="w-8 h-8 animate-spin text-primary-500"
								/>
								<p class="text-gray-500 text-sm">正在加载记录...</p>
							</div>

							<!-- 空状态 -->
							<div
								v-else-if="!resumeHistoryList || resumeHistoryList.length === 0"
								class="flex flex-col items-center justify-center py-20 space-y-4"
							>
								<div
									class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
								>
									<UIcon
										name="i-heroicons-clipboard-document-list"
										class="w-8 h-8 text-gray-400"
									/>
								</div>
								<p class="text-gray-500">暂无{{ item.label }}记录</p>
							<UButton
								v-if="item.key === 'resume'"
								to="/interview?serviceType=resume&step=input"
								color="primary"
								variant="soft"
							>
								去体验
							</UButton>
							</div>

							<!-- 列表展示 -->
							<div v-else class="space-y-4">
								<div
									v-for="record in resumeHistoryList"
									:key="record.id || record.resultId"
									class="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-primary-200 hover:shadow-md transition-all gap-4"
								>
									<div class="flex items-start gap-4">
										<div
											class="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-1"
										>
											<UIcon name="i-heroicons-document-text" class="w-6 h-6" />
										</div>
										<div>
											<h3
												class="font-semibold text-gray-900 mb-1 flex items-center gap-2"
											>
												{{ record.inputData?.company || '未知公司' }}
												<span class="text-gray-300">|</span>
												{{ record.inputData?.positionName || '通用岗位' }}
											</h3>
											<div
												class="flex items-center gap-3 text-xs text-gray-500"
											>
												<span class="flex items-center gap-1">
													<UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
													{{ formatDate(record.createdAt) }}
												</span>
												<UBadge
													v-if="record.status === 'success'"
													color="green"
													variant="subtle"
													size="xs"
												>
													已完成
												</UBadge>
												<UBadge v-else color="gray" variant="subtle" size="xs">
													处理中
												</UBadge>
											</div>
										</div>
									</div>

									<div
										class="flex items-center justify-end sm:w-auto w-full pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50"
									>
										<UButton
											color="gray"
											variant="ghost"
											icon="i-heroicons-eye"
											class="w-full sm:w-auto justify-center"
											@click="handleView(record)"
										>
											查看报告
										</UButton>
									</div>
								</div>

								<!-- 分页 -->
								<div class="flex justify-center pt-4" v-if="total > limit">
									<UPagination
										v-model="page"
										:page-count="limit"
										:total="total"
										@update:model-value="loadData"
									/>
								</div>
							</div>
						</div>
					</template>
				</UTabs>
			</UCard>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { getInterviewResumeHistoryAPI } from '@/api/interview'
import dayjs from 'dayjs'

definePageMeta({
	middleware: 'auth'
})

useHead({
	title: '服务记录 - 面试汪'
})

const { $api } = useNuxtApp()

const items = [
	{
		label: '面试押题',
		slot: 'resume',
		icon: 'i-heroicons-document-text'
	},
	{
		label: '专项面试',
		slot: 'special',
		icon: 'i-heroicons-light-bulb'
	},
	{
		label: '行为面试',
		slot: 'behavior',
		icon: 'i-heroicons-users'
	}
]

// 状态管理
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const resumeHistoryList = ref([])
const status = ref('pending')

/**
 * 加载数据
 */
const loadData = async () => {
	status.value = 'pending'
	try {
		// 这里假设目前只有面试押题接口，后续根据 Tab 切换不同接口
		const res = await getInterviewResumeHistoryAPI(
			$api,
			page.value,
			limit.value
		)

		resumeHistoryList.value = res.records
		total.value = res.total
	} catch (error) {
		console.error('获取历史记录失败', error)
		resumeHistoryList.value = []
	} finally {
		status.value = 'idle'
	}
}

// 初始加载
loadData()

/**
 * 格式化日期
 */
const formatDate = (date) => {
	if (!date) return ''
	return dayjs(date).format('YYYY-MM-DD HH:mm')
}

/**
 * 查看详情
 */
const handleView = (record) => {
	if (record.resultId) {
		navigateTo(`/interview?serviceType=resume&resultId=${record.resultId}`)
	} else {
		console.warn('记录缺少 resultId', record)
	}
}
</script>
