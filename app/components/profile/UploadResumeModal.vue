<template>
	<UModal v-model:open="isOpen" title="上传简历" :ui="{ width: 'sm:max-w-md' }">
		<div class="space-y-6 py-4">
			<!-- 拖拽上传区域 -->
			<div
				:class="[
					'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
					dragOver
						? 'border-primary-500 bg-primary-50'
						: 'border-gray-300 hover:border-gray-400',
					uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
				]"
				@click="triggerFileUpload"
				@dragover.prevent="handleDragOver"
				@dragleave.prevent="handleDragLeave"
				@drop.prevent="handleDrop"
			>
				<input
					ref="fileInputRef"
					type="file"
					accept=".pdf,.doc,.docx"
					class="hidden"
					@change="handleFileChange"
				/>

				<div v-if="!uploading && !selectedFile">
					<UIcon
						name="i-heroicons-cloud-arrow-up"
						class="w-12 h-12 mx-auto mb-4 text-gray-400"
					/>
					<p class="text-sm font-medium text-gray-700 mb-1">
						点击或拖拽文件到此处上传
					</p>
					<p class="text-xs text-gray-500">
						支持 PDF、DOC、DOCX 格式，文件大小不超过 10MB
					</p>
				</div>

				<div v-else-if="uploading" class="flex flex-col items-center">
					<UIcon
						name="i-heroicons-arrow-path"
						class="w-12 h-12 mx-auto mb-4 text-primary-500 animate-spin"
					/>
					<p class="text-sm font-medium text-gray-700">上传中...</p>
				</div>

				<div v-else-if="selectedFile" class="flex flex-col items-center">
					<UIcon
						name="i-heroicons-document-check"
						class="w-12 h-12 mx-auto mb-4 text-green-500"
					/>
					<p class="text-sm font-medium text-gray-700 mb-1">
						{{ selectedFile.name }}
					</p>
					<p class="text-xs text-gray-500">
						{{ formatFileSize(selectedFile.size) }}
					</p>
					<UButton
						color="gray"
						variant="ghost"
						size="sm"
						class="mt-2"
						@click.stop="selectedFile = null"
					>
						重新选择
					</UButton>
				</div>
			</div>

			<!-- 简历名称 -->
			<div v-if="selectedFile">
				<UForm label="简历名称" name="resumeName" :error="errors.resumeName">
					<UInput
						v-model="resumeName"
						placeholder="请输入简历名称（选填）"
						size="lg"
					/>
				</UForm>
			</div>
		</div>

		<template #footer>
			<div class="flex gap-2 w-full justify-end">
				<UButton color="gray" variant="ghost" @click="handleCancel">
					取消
				</UButton>
				<UButton
					color="primary"
					:loading="uploading"
					:disabled="!selectedFile"
					@click="handleUpload"
				>
					上传
				</UButton>
			</div>
		</template>
	</UModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from '#imports'

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:open', 'uploaded'])

const toast = useToast()
const fileInputRef = ref(null)
const selectedFile = ref(null)
const resumeName = ref('')
const uploading = ref(false)
const dragOver = ref(false)

const isOpen = computed({
	get: () => props.open,
	set: (value) => emit('update:open', value)
})

const errors = ref({
	resumeName: ''
})

// 监听弹窗打开，重置表单
watch(isOpen, (open) => {
	if (open) {
		selectedFile.value = null
		resumeName.value = ''
		errors.value = { resumeName: '' }
		dragOver.value = false
	}
})

// 触发文件选择
const triggerFileUpload = () => {
	if (!uploading.value) {
		fileInputRef.value?.click()
	}
}

// 处理文件选择
const handleFileChange = (event) => {
	const file = event.target.files?.[0]
	if (file) {
		processFile(file)
	}
	// 清空input，以便可以重新选择同一个文件
	event.target.value = ''
}

// 处理拖拽悬停
const handleDragOver = (event) => {
	event.preventDefault()
	dragOver.value = true
}

// 处理拖拽离开
const handleDragLeave = () => {
	dragOver.value = false
}

// 处理拖拽放下
const handleDrop = (event) => {
	event.preventDefault()
	dragOver.value = false

	const file = event.dataTransfer.files?.[0]
	if (file) {
		processFile(file)
	}
}

// 处理文件
const processFile = (file) => {
	// 验证文件类型
	const allowedTypes = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	]
	const allowedExtensions = ['.pdf', '.doc', '.docx']
	const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

	if (
		!allowedTypes.includes(file.type) &&
		!allowedExtensions.includes(fileExtension)
	) {
		toast.add({
			title: '不支持的文件格式',
			description: '请上传 PDF、DOC 或 DOCX 格式的文件',
			color: 'error'
		})
		return
	}

	// 验证文件大小（限制 10MB）
	if (file.size > 10 * 1024 * 1024) {
		toast.add({
			title: '文件大小不能超过 10MB',
			color: 'error'
		})
		return
	}

	selectedFile.value = file
	resumeName.value = file.name.replace(/\.[^/.]+$/, '') // 去掉扩展名作为默认名称
}

// 格式化文件大小
const formatFileSize = (bytes) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// 处理上传
const handleUpload = async () => {
	if (!selectedFile.value) {
		return
	}

	uploading.value = true
	try {
		// TODO: 实际上传到服务器
		// const { $api } = useNuxtApp()
		// const formData = new FormData()
		// formData.append('file', selectedFile.value)
		// if (resumeName.value.trim()) {
		// 	formData.append('name', resumeName.value.trim())
		// }
		// const resume = await $api.post('/resume/upload', formData)

		// 模拟上传
		const resume = {
			id: Date.now().toString(),
			name: resumeName.value.trim() || selectedFile.value.name,
			fileName: selectedFile.value.name,
			fileSize: selectedFile.value.size,
			fileUrl: URL.createObjectURL(selectedFile.value), // 临时URL，实际应该是服务器返回的URL
			createTime: new Date().toISOString()
		}

		emit('uploaded', resume)
		isOpen.value = false
	} catch (error) {
		toast.add({
			title: '上传失败',
			description: error.message,
			color: 'error'
		})
	} finally {
		uploading.value = false
	}
}

// 处理取消
const handleCancel = () => {
	if (!uploading.value) {
		isOpen.value = false
	}
}
</script>

<style scoped></style>
