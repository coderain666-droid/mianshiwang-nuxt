<template>
	<div class="space-y-3">
		<!-- 空状态：仅展示空 -->
		<div
			v-if="userStore.resumes.length === 0"
			class="flex flex-col justify-center items-center py-12 text-gray-500"
		>
			<UIcon
				name="i-heroicons-document-text"
				class="w-12 h-12 mx-auto mb-4 text-gray-300"
			/>
			暂无简历
		</div>

		<div v-else>
			<div
				v-for="(resume, index) in userStore.resumes"
				:key="resume.id"
				class="flex items-center gap-4 p-4 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
			>
				<!-- 简历图标 -->
				<div
					class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0"
				>
					<UIcon
						name="i-heroicons-document-text"
						class="w-6 h-6 text-primary-600"
					/>
				</div>

				<!-- 简历信息 -->
				<div class="flex-1 min-w-0">
					<p class="font-medium text-gray-900 truncate">
						{{ resume.resumeName }}
					</p>
					<div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
						<span v-if="resume.jobInfo">{{
							resume.jobInfo?.jobIntention
						}}</span>
						<span v-if="resume.jobInfo">{{
							resume.jobInfo?.cityIntention
						}}</span>
						<span>{{ formatDate(resume.createTime) }}</span>
					</div>
				</div>

				<!-- 操作按钮 -->
				<div class="flex items-center gap-2 flex-shrink-0">
					<UButton
						color="gray"
						variant="ghost"
						size="sm"
						icon="i-heroicons-eye"
						@click="handlePreview(resume)"
					/>
					<UButton
						color="gray"
						variant="ghost"
						size="sm"
						icon="i-heroicons-trash"
						@click="handleDelete(index)"
					/>
				</div>
			</div>
		</div>

		<!-- 预览弹窗 -->
		<UModal
			v-model:open="previewModal"
			:title="previewTitle"
			:ui="{ content: 'w-[1200px] max-w-[90vw]' }"
		>
			<template #body>
				<div class="border rounded-lg overflow-hidden">
					<iframe
						v-if="previewResume?.resumeUrl"
						:src="previewResume?.resumeUrl"
						class="w-full h-[600px]"
						frameborder="0"
					/>
					<div v-else class="p-12 text-center text-gray-500">
						<p>无法预览此文件</p>
					</div>
				</div>
			</template>
		</UModal>

		<!-- 删除确认弹窗 -->
		<UModal v-model:open="deleteConfirmModal" title="确认删除">
			<template #body>
				<div class="py-4">
					<p class="text-gray-700">确定要删除这份简历吗？删除后无法恢复。</p>
				</div>
			</template>
			<template #footer>
				<div class="flex gap-2 w-full justify-end">
					<UButton
						color="gray"
						variant="ghost"
						@click="deleteConfirmModal = false"
					>
						取消
					</UButton>
					<UButton color="error" @click="confirmDelete"> 确定删除 </UButton>
				</div>
			</template>
		</UModal>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '#imports'
import { getResumeListAPI } from '@/api/resume'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'

const toast = useToast()
const userStore = useUserStore()
const { $api } = useNuxtApp()
/**
 * 获取简历列表
 */
const getResumeList = async () => {
	const res = await getResumeListAPI($api)

	userStore.resumes = res || []
}
getResumeList()

const previewModal = ref(false)
const previewResume = ref(null)
const deleteConfirmModal = ref(false)
const deleteIndex = ref(-1)

// 格式化日期
const formatDate = (date) => {
	if (!date) return ''
	return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 移除拖拽相关逻辑

// 预览简历
const handlePreview = (resume) => {
	// 判断是否为用户单独上传的简历
	if (!resume.isJianLiWang) {
		previewResume.value = resume
		previewModal.value = true
		return
	}
	console.log('resume', resume)

	// 环境变量的预览地址
	// 测试环境使用：http://192.168.0.102:3001/
	// 生成环境使用：https://resume.lgdsunday.club/
	const config = useRuntimeConfig()

	previewResume.value = {
		...resume,
		resumeUrl: `${config.public.resumePreviewUrl}edit?id=${resume.resumeId}&template=${resume.templateName}`
	}
	previewModal.value = true
}

// 删除简历
const handleDelete = (index) => {
	deleteIndex.value = index
	deleteConfirmModal.value = true
}

// 确认删除
const confirmDelete = () => {
	if (deleteIndex.value >= 0) {
		emit('delete', deleteIndex.value)
		deleteConfirmModal.value = false
		deleteIndex.value = -1
	}
}

const previewTitle = computed(() => {
	if (!previewResume.value) return '简历预览'

	if (!previewResume.value.isJianLiWang) {
		return previewResume.value?.resumeName
	}

	return previewResume.value?.resumeName + '（支持在线修改，可同步生效）'
})
</script>

<style scoped>
/* 列表过渡动画 */
.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.3s ease;
}

.list-enter-from {
	opacity: 0;
	transform: translateY(-10px);
}

.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.list-leave-active {
	position: absolute;
	width: 100%;
}
</style>
