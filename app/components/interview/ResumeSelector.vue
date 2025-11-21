<template>
	<div class="space-y-4">
		<!-- 简历选择区域 -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<slot name="title">
					<h3 class="text-sm font-semibold text-neutral-900">选择已有简历</h3>
				</slot>
				<UButton
					v-if="userStore.canAddResume"
					color="primary"
					variant="ghost"
					size="sm"
					icon="i-heroicons-plus"
					@click="isUploadResumeModalVisible = true"
				>
					上传新简历
				</UButton>
			</div>

			<!-- 简历列表 -->
			<div
				v-if="userStore.resumes.length > 0"
				class="space-y-2 max-h-[300px] overflow-y-auto pr-1"
			>
				<div
					v-for="resume in userStore.resumes"
					:key="resume.id"
					:class="[
						'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
						selectedResumeId === resume.resumeId
							? 'border-primary-500 bg-primary-50'
							: 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
					]"
					@click="selectResume(resume)"
				>
					<div
						class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0"
					>
						<UIcon
							name="i-heroicons-document-text"
							class="w-5 h-5 text-primary-600"
						/>
					</div>
					<div class="flex-1 min-w-0">
						<p class="font-medium text-neutral-900 truncate text-sm">
							{{ resume.resumeName }}
						</p>
						<p class="text-xs text-neutral-500 mt-0.5">
							{{ formatDate(resume.createTime) }}
						</p>
					</div>
					<UIcon
						v-if="selectedResumeId === resume.resumeId"
						name="i-heroicons-check-circle"
						class="w-5 h-5 text-primary-600 shrink-0"
					/>
				</div>
			</div>

			<!-- 空状态 -->
			<div
				v-else
				class="flex flex-col items-center justify-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg"
			>
				<UIcon name="i-heroicons-document-text" class="w-10 h-10 mb-2" />
				<p class="text-sm">暂无简历</p>
				<UButton
					v-if="userStore.canAddResume"
					color="primary"
					variant="ghost"
					size="sm"
					class="mt-2"
					@click="isUploadResumeModalVisible = true"
				>
					立即上传
				</UButton>
			</div>
		</div>

		<!-- 分隔线 -->
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-gray-200"></div>
			</div>
			<div class="relative flex justify-center text-xs">
				<span class="bg-white px-2 text-gray-500">或</span>
			</div>
		</div>

		<!-- 手动输入 -->
		<div class="space-y-2">
			<h3 class="text-sm font-semibold text-neutral-900">手动输入简历内容</h3>
			<UTextarea
				v-model="resumeText"
				placeholder="粘贴你的简历内容..."
				rows="6"
				class="w-full"
				@update:model-value="handleTextChange"
			/>
			<p class="text-xs text-gray-500">
				支持直接粘贴简历文本内容，系统将自动解析
			</p>
		</div>

		<!-- 上传简历弹窗 -->
		<UploadResumeModal
			v-model:open="isUploadResumeModalVisible"
			@uploaded="handleResumeUploaded"
		/>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import UploadResumeModal from '@/components/profile/UploadResumeModal.vue'
import { getResumeListAPI } from '@/api/resume'
import dayjs from 'dayjs'

const props = defineProps({
	modelValue: {
		type: [String, Number, Object],
		default: null
	}
})

const emit = defineEmits(['update:modelValue'])

const userStore = useUserStore()
const { $api } = useNuxtApp()

const isUploadResumeModalVisible = ref(false)
const resumeText = ref('')
const selectedResumeId = ref(null)

// 初始化时加载简历列表
onMounted(async () => {
	if (userStore.resumes.length === 0) {
		try {
			const res = await getResumeListAPI($api)
			userStore.resumes = res || []
		} catch (error) {
			console.error('加载简历列表失败', error)
		}
	}
})

// 格式化日期
const formatDate = (date) => {
	if (!date) return ''
	return dayjs(date).format('YYYY-MM-DD')
}

// 选择简历
const selectResume = (resume) => {
	selectedResumeId.value = resume.resumeId
	resumeText.value = '' // 清空手动输入
	emit('update:modelValue', {
		type: 'resume',
		resumeId: resume.resumeId,
		resume: resume
	})
}

// 手动输入变化
const handleTextChange = (value) => {
	if (value.trim()) {
		selectedResumeId.value = null // 清空选择的简历
		emit('update:modelValue', {
			type: 'text',
			text: value.trim()
		})
	} else {
		emit('update:modelValue', null)
	}
}

// 简历上传成功
const handleResumeUploaded = async () => {
	const res = await getResumeListAPI($api)
	userStore.resumes = res || []
	isUploadResumeModalVisible.value = false
}

// 监听外部值变化
watch(
	() => props.modelValue,
	(newValue) => {
		if (!newValue) {
			selectedResumeId.value = null
			resumeText.value = ''
		} else if (newValue.type === 'text') {
			resumeText.value = newValue.text || ''
			selectedResumeId.value = null
		} else if (newValue.type === 'resume') {
			selectedResumeId.value = newValue.resumeId
			resumeText.value = ''
		}
	},
	{ immediate: true }
)
</script>

<style scoped></style>
