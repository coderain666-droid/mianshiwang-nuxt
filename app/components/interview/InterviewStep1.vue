<template>
	<div class="h-full flex flex-col gap-6">
		<div
			class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-center lg:text-left"
		>
			<div>
				<h1 class="text-2xl font-bold text-neutral-900 mb-1">
					选择岗位和导入简历
				</h1>
				<p class="text-neutral-600 text-sm">
					锁定目标岗位并导入简历，AI 将定制专属题库
				</p>
			</div>
			<div
				class="inline-flex items-center gap-2 text-xs text-neutral-500 justify-center"
			>
				<UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-primary-500" />
				一步完成岗位筛选与资料上传
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-6 flex-1 min-h-0 auto-rows-fr">
			<!-- 左侧：岗位选择 -->
			<div
				class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-0"
			>
				<h2 class="text-xl font-semibold text-neutral-900 mb-4">选择岗位</h2>

				<!-- 搜索框 -->
				<UInput
					v-model="searchQuery"
					placeholder="搜索岗位..."
					icon="i-heroicons-magnifying-glass"
					size="lg"
					class="mb-4"
				/>

				<!-- 分类筛选 -->
				<div class="flex flex-wrap gap-2 mb-4">
					<UButton
						v-for="category in categories"
						:key="category.key"
						:variant="activeCategory === category.key ? 'solid' : 'ghost'"
						:color="activeCategory === category.key ? 'primary' : 'gray'"
						size="sm"
						@click="activeCategory = category.key"
					>
						{{ category.label }}
					</UButton>
				</div>

				<!-- 岗位列表 -->
				<div class="flex-1 min-h-0 overflow-hidden">
					<div class="space-y-2 h-full overflow-y-auto pr-1">
						<div
							v-for="position in filteredPositions"
							:key="position.id"
							:class="[
								'p-4 rounded-lg border-2 cursor-pointer transition-all',
								selectedPosition?.id === position.id
									? 'border-primary-500 bg-primary-50'
									: 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
							]"
							@click="selectPosition(position)"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h3 class="font-semibold text-neutral-900 mb-1">
										{{ position.name }}
									</h3>
									<p class="text-sm text-neutral-600 mb-2">
										{{ position.description }}
									</p>
									<div class="flex items-center gap-2 text-xs text-neutral-500">
										<span class="px-2 py-0.5 rounded bg-gray-100">
											{{ getCategoryLabel(position.category) }}
										</span>
										<span v-if="position.level">· {{ position.level }}</span>
									</div>
								</div>
								<UIcon
									v-if="selectedPosition?.id === position.id"
									name="i-heroicons-check-circle"
									class="w-6 h-6 text-primary-600 shrink-0 ml-2"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧：简历上传 -->
			<div
				class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-0"
			>
				<h2 class="text-xl font-semibold text-neutral-900 mb-4">导入简历</h2>

				<div class="flex-1 min-h-0 flex flex-col gap-6 overflow-hidden">
					<!-- 上传区域 -->
					<div
						class="border-2 border-dashed rounded-lg p-6 text-center transition-colors flex flex-col justify-center"
						:class="[
							isDragging
								? 'border-primary-500 bg-primary-50'
								: 'border-gray-300 hover:border-primary-300'
						]"
						@drop="handleDrop"
						@dragover.prevent="isDragging = true"
						@dragleave="isDragging = false"
						@click="triggerFileInput"
					>
						<input
							ref="fileInputRef"
							type="file"
							accept=".pdf,.doc,.docx,.txt"
							class="hidden"
							@change="handleFileSelect"
						/>

						<UIcon
							name="i-heroicons-document-arrow-up"
							class="w-12 h-12 text-gray-400 mx-auto mb-4"
						/>
						<p class="text-neutral-900 font-medium mb-2">
							点击上传或拖拽文件到此处
						</p>
						<p class="text-sm text-neutral-500">
							支持 PDF、Word、TXT 格式，最大 10MB
						</p>
					</div>

					<!-- 已上传的文件 -->
					<div
						v-if="resumeFile"
						class="p-4 bg-gray-50 rounded-lg border border-gray-200"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3 flex-1 min-w-0">
								<UIcon
									name="i-heroicons-document-text"
									class="w-8 h-8 text-primary-600"
								/>
								<div class="flex-1 min-w-0">
									<p class="font-medium text-neutral-900 truncate">
										{{ resumeFile.name }}
									</p>
									<p class="text-sm text-neutral-500">
										{{ formatFileSize(resumeFile.size) }}
									</p>
								</div>
							</div>
							<UButton
								color="red"
								variant="ghost"
								size="sm"
								icon="i-heroicons-trash"
								@click="removeResume"
							/>
						</div>
					</div>

					<!-- 或者手动输入 -->
					<div class="pt-4 border-t border-gray-200">
						<h3 class="font-medium text-neutral-900 mb-3">
							或者手动输入简历内容
						</h3>
						<UTextarea
							v-model="resumeText"
							placeholder="粘贴你的简历内容..."
							rows="6"
							class="w-full"
						/>
					</div>
				</div>

				<!-- 下一步按钮 -->
				<div class="pt-4 border-t border-gray-200 mt-4">
					<UButton
						color="primary"
						size="lg"
						block
						:disabled="!canProceed"
						@click="handleNext"
					>
						下一步：开始面试
					</UButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import jobCatalog from '@/data/job-categories.json'
import { useInterviewStore } from '@/stores/interview'
import { useToast } from '#imports'

const emit = defineEmits(['next'])

const interviewStore = useInterviewStore()
const toast = useToast()

const searchQuery = ref('')
const activeCategory = ref('all')
const isDragging = ref(false)
const fileInputRef = ref(null)
const resumeFile = ref(null)
const resumeText = ref('')

const catalogCategories = jobCatalog.categories ?? []

const categories = [
	{ key: 'all', label: '全部' },
	...catalogCategories.map((category) => ({
		key: category.key,
		label: category.label
	}))
]

const positions = ref(
	(jobCatalog.positions ?? []).map((position, index) => ({
		...position,
		id: position.id || `position-${index}`
	}))
)

const selectedPosition = computed(() => interviewStore.selectedPosition)

const selectPosition = (position) => {
	interviewStore.selectPosition(position)
}

const filteredPositions = computed(() => {
	let result = positions.value

	// 按分类过滤
	if (activeCategory.value !== 'all') {
		result = result.filter((p) => p.category === activeCategory.value)
	}

	// 按搜索关键词过滤
	if (searchQuery.value.trim()) {
		const query = searchQuery.value.toLowerCase().trim()
		result = result.filter(
			(p) =>
				p.name.toLowerCase().includes(query) ||
				p.description.toLowerCase().includes(query)
		)
	}

	return result
})

const canProceed = computed(() => {
	return (
		interviewStore.selectedPosition &&
		(resumeFile.value || resumeText.value.trim())
	)
})

const getCategoryLabel = (category) => {
	const cat = categories.find((c) => c.key === category)
	return cat ? cat.label : category
}

const formatFileSize = (bytes) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const triggerFileInput = () => {
	fileInputRef.value?.click()
}

const handleFileSelect = (event) => {
	const file = event.target.files?.[0]
	if (file) {
		handleFile(file)
	}
}

const handleDrop = (event) => {
	isDragging.value = false
	event.preventDefault()
	const file = event.dataTransfer.files?.[0]
	if (file) {
		handleFile(file)
	}
}

const handleFile = async (file) => {
	// 验证文件类型
	const allowedTypes = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'text/plain'
	]
	if (!allowedTypes.includes(file.type)) {
		toast.add({
			title: '不支持的文件格式',
			description: '请上传 PDF、Word 或 TXT 文件',
			color: 'error'
		})
		return
	}

	// 验证文件大小（10MB）
	if (file.size > 10 * 1024 * 1024) {
		toast.add({
			title: '文件过大',
			description: '文件大小不能超过 10MB',
			color: 'error'
		})
		return
	}

	resumeFile.value = file

	// TODO: 实际上传文件到服务器
	// const formData = new FormData()
	// formData.append('resume', file)
	// const response = await $api('/upload/resume', { method: 'POST', body: formData })
	// const resumeUrl = response.url

	// 暂时模拟上传成功
	toast.add({
		title: '简历上传成功',
		color: 'success'
	})

	// 保存到 store
	interviewStore.setResume(file, null, '')
}

const removeResume = () => {
	resumeFile.value = null
	interviewStore.setResume(null, null, '')
}

const handleNext = async () => {
	if (!canProceed.value) {
		toast.add({
			title: '请完成必填项',
			description: '请选择岗位并上传简历或输入简历内容',
			color: 'warning'
		})
		return
	}

	// 如果有手动输入的简历文本，保存到 store
	if (resumeText.value.trim()) {
		interviewStore.setResume(null, null, resumeText.value.trim())
	}

	emit('next')
}
</script>

<style scoped></style>
