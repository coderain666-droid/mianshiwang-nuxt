<template>
	<UModal
		v-model:open="isOpen"
		:title="editingId ? '编辑手动简历' : '手动填写简历'"
		:ui="{ content: 'sm:max-w-xl' }"
	>
		<template #body>
			<div class="space-y-4 py-2">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">
						简历名称
					</label>
					<UInput
						v-model="resumeName"
						placeholder="例如：前端开发-张三"
						maxlength="20"
						show-character-limit
						class="w-full"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">
						简历内容
					</label>
					<UTextarea
						v-model="content"
						placeholder="请粘贴或输入简历文字内容，如：教育经历、工作经历、项目经验、技能等..."
						:rows="12"
						class="w-full font-sans"
					/>
					<p class="mt-1.5 text-xs text-gray-500">
						支持直接粘贴从 Word/网页复制的文本，用于简历押题与模拟面试
					</p>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="flex gap-2 w-full justify-end">
				<UButton color="gray" variant="ghost" @click="handleCancel">
					取消
				</UButton>
				<UButton
					color="primary"
					:loading="saving"
					:disabled="!resumeName.trim() || !content.trim()"
					@click="handleSave"
				>
					{{ editingId ? '保存' : '添加' }}
				</UButton>
			</div>
		</template>
	</UModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from '#imports'
import { useUserStore } from '@/stores/user'
import { MAX_RESUME_COUNT } from '@/constants'

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	},
	/** 编辑时传入的简历（手动填写的项） */
	editResume: {
		type: Object,
		default: null
	}
})

const emit = defineEmits(['update:open', 'saved'])
const toast = useToast()
const userStore = useUserStore()

const resumeName = ref('')
const content = ref('')
const saving = ref(false)
const editingId = ref(null)

const isOpen = computed({
	get: () => props.open,
	set: (v) => emit('update:open', v)
})

watch(
	() => [props.open, props.editResume],
	([open, edit]) => {
		if (open) {
			if (edit?.isManual && edit?.resumeId) {
				editingId.value = edit.resumeId
				resumeName.value = edit.resumeName || ''
				content.value = edit.content || ''
			} else {
				editingId.value = null
				resumeName.value = ''
				content.value = ''
			}
		}
	},
	{ immediate: true }
)

const handleSave = () => {
	const name = resumeName.value.trim()
	const text = content.value.trim()
	if (!name || !text) {
		toast.add({
			title: '请填写简历名称和内容',
			color: 'warning'
		})
		return
	}
	if (userStore.resumes.length + userStore.manualResumes.length >= MAX_RESUME_COUNT && !editingId.value) {
		toast.add({
			title: `最多保存 ${MAX_RESUME_COUNT} 份简历`,
			color: 'warning'
		})
		return
	}
	saving.value = true
	try {
		if (editingId.value) {
			userStore.updateManualResume(editingId.value, { resumeName: name, content: text })
			toast.add({ title: '保存成功', color: 'success' })
		} else {
			userStore.addManualResume({
				resumeId: `manual_${Date.now()}`,
				resumeName: name,
				content: text,
				isManual: true,
				createTime: new Date().toISOString()
			})
			toast.add({ title: '添加成功', color: 'success' })
		}
		isOpen.value = false
		emit('saved')
	} catch (e) {
		toast.add({
			title: e?.message || '保存失败',
			color: 'error'
		})
	} finally {
		saving.value = false
	}
}

const handleCancel = () => {
	if (!saving.value) isOpen.value = false
}
</script>
