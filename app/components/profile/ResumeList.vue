<template>
	<div class="space-y-3">
		<TransitionGroup
			name="list"
			tag="div"
			class="space-y-3"
		>
			<div
				v-for="(resume, index) in resumes"
				:key="resume.id"
				:class="[
					'flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-move',
					isDragging && draggingIndex === index ? 'opacity-50 scale-95' : '',
					isDragging && hoverIndex === index ? 'ring-2 ring-primary-500' : ''
				]"
				draggable="true"
				@dragstart="handleDragStart(index, $event)"
				@dragenter.prevent="handleDragEnter(index)"
				@dragover.prevent
				@dragleave="handleDragLeave"
				@drop.prevent="handleDrop(index)"
				@dragend="handleDragEnd"
			>
				<!-- 拖拽手柄 -->
				<UIcon
					name="i-heroicons-bars-3-bottom-left"
					class="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing"
				/>

				<!-- 简历图标 -->
				<div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
					<UIcon
						name="i-heroicons-document-text"
						class="w-6 h-6 text-primary-600"
					/>
				</div>

				<!-- 简历信息 -->
				<div class="flex-1 min-w-0">
					<p class="font-medium text-gray-900 truncate">
						{{ resume.name }}
					</p>
					<div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
						<span>{{ resume.fileName }}</span>
						<span>·</span>
						<span>{{ formatFileSize(resume.fileSize) }}</span>
						<span>·</span>
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
		</TransitionGroup>

		<!-- 预览弹窗 -->
		<UModal
			v-model:open="previewModal"
			title="简历预览"
			:ui="{ width: 'sm:max-w-4xl' }"
		>
			<div class="py-4">
				<div v-if="previewResume" class="space-y-4">
					<div class="bg-gray-50 rounded-lg p-4">
						<p class="font-medium text-gray-900 mb-2">{{ previewResume.name }}</p>
						<p class="text-sm text-gray-600">{{ previewResume.fileName }}</p>
					</div>
					<div class="border rounded-lg overflow-hidden">
						<iframe
							v-if="previewResume.fileUrl"
							:src="previewResume.fileUrl"
							class="w-full h-[600px]"
							frameborder="0"
						/>
						<div v-else class="p-12 text-center text-gray-500">
							<p>无法预览此文件</p>
						</div>
					</div>
				</div>
			</div>
		</UModal>

		<!-- 删除确认弹窗 -->
		<UModal
			v-model:open="deleteConfirmModal"
			title="确认删除"
		>
			<div class="py-4">
				<p class="text-gray-700">确定要删除这份简历吗？删除后无法恢复。</p>
			</div>
			<template #footer>
				<div class="flex gap-2 w-full justify-end">
					<UButton
						color="gray"
						variant="ghost"
						@click="deleteConfirmModal = false"
					>
						取消
					</UButton>
					<UButton
						color="red"
						@click="confirmDelete"
					>
						确定删除
					</UButton>
				</div>
			</template>
		</UModal>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '#imports'
import dayjs from 'dayjs'

const props = defineProps({
	resumes: {
		type: Array,
		default: () => []
	}
})

const emit = defineEmits(['update-order', 'delete', 'reorder'])

const toast = useToast()

const isDragging = ref(false)
const draggingIndex = ref(-1)
const hoverIndex = ref(-1)
const previewModal = ref(false)
const previewResume = ref(null)
const deleteConfirmModal = ref(false)
const deleteIndex = ref(-1)

// 格式化文件大小
const formatFileSize = (bytes) => {
	if (!bytes) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 格式化日期
const formatDate = (date) => {
	if (!date) return ''
	return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 拖拽开始
const handleDragStart = (index, event) => {
	isDragging.value = true
	draggingIndex.value = index
	hoverIndex.value = -1
	
	// 设置拖拽数据
	event.dataTransfer.effectAllowed = 'move'
	event.dataTransfer.setData('text/html', event.target.outerHTML)
}

// 拖拽进入
const handleDragEnter = (index) => {
	if (draggingIndex.value !== index) {
		hoverIndex.value = index
	}
}

// 拖拽离开
const handleDragLeave = () => {
	// 这里不做处理，避免快速移动时闪烁
}

// 放置
const handleDrop = (dropIndex) => {
	if (draggingIndex.value === -1 || draggingIndex.value === dropIndex) {
		return
	}

	const newResumes = [...props.resumes]
	const draggedResume = newResumes[draggingIndex.value]

	// 移除拖拽的元素
	newResumes.splice(draggingIndex.value, 1)

	// 插入到新位置
	newResumes.splice(dropIndex, 0, draggedResume)

	// 更新列表
	emit('reorder', newResumes)
}

// 拖拽结束
const handleDragEnd = () => {
	isDragging.value = false
	draggingIndex.value = -1
	hoverIndex.value = -1
}

// 预览简历
const handlePreview = (resume) => {
	previewResume.value = resume
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

