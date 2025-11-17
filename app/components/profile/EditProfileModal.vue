<template>
	<UModal v-model:open="isOpen" :ui="{ width: 'sm:max-w-md' }">
		<template #header>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-primary-600" />
					<h3 class="text-lg font-semibold text-gray-900">编辑个人信息</h3>
				</div>
				<UButton
					color="gray"
					variant="ghost"
					icon="i-heroicons-x-mark"
					size="sm"
					square
					@click="isOpen = false"
				/>
			</div>
		</template>
		<div class="space-y-6 py-4">
			<!-- 头像上传 -->
			<div class="flex flex-col items-center pb-4 border-b border-gray-200">
				<div class="relative group mb-4">
					<div class="relative">
						<UAvatar
							:src="formData.avatar"
							:alt="formData.username || '用户头像'"
							size="3xl"
							class="cursor-pointer ring-4 ring-primary-100 transition-all hover:ring-primary-200"
						/>
						<!-- hover 遮罩 + loading 态 -->
						<div
							v-if="avatarUploading"
							class="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm"
						>
							<UIcon name="i-heroicons-arrow-path" class="w-7 h-7 text-white animate-spin" />
						</div>
						<div
							v-else
							class="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 to-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-end pb-3 text-white text-xs transition-all cursor-pointer"
							@click="triggerAvatarUpload"
						>
							<UIcon name="i-heroicons-camera" class="w-5 h-5 mb-1" />
							<span class="text-[10px]">更换</span>
						</div>
					</div>
					<!-- 状态指示器 -->
					<div
						v-if="avatarUploading"
						class="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
					>
						上传中...
					</div>
				</div>
				<UButton
					color="primary"
					variant="soft"
					size="sm"
					class="gap-2"
					:loading="avatarUploading"
					:disabled="avatarUploading"
					@click="triggerAvatarUpload"
				>
					<UIcon name="i-heroicons-photo" class="w-4 h-4" />
					更换头像
				</UButton>
				<p class="text-xs text-gray-500 mt-2 text-center">
					支持 JPG、PNG 格式，文件大小不超过 5MB
				</p>
				<input
					ref="avatarInputRef"
					type="file"
					accept="image/*"
					class="hidden"
					@change="handleAvatarChange"
				/>
			</div>

			<!-- 用户名 -->
			<div>
				<UFormGroup label="用户名" name="username" :error="errors.username">
					<UInput
						v-model="formData.username"
						placeholder="请输入用户名（2-20个字符）"
						size="lg"
						:ui="{ icon: { trailing: { pointer: '' } } }"
					>
						<template #leading>
							<UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-400" />
						</template>
						<template #trailing>
							<UButton
								v-show="formData.username"
								color="gray"
								variant="link"
								icon="i-heroicons-x-mark"
								:disabled="loading"
								@click="formData.username = ''"
							/>
						</template>
					</UInput>
					<template #description>
						<p class="text-xs text-gray-500 mt-1">用于在平台上显示您的身份</p>
					</template>
				</UFormGroup>
			</div>

			<!-- 邮箱 -->
			<div>
				<UFormGroup label="邮箱" name="email" :error="errors.email">
					<UInput
						v-model="formData.email"
						type="email"
						placeholder="请输入邮箱地址（选填）"
						size="lg"
						:ui="{ icon: { trailing: { pointer: '' } } }"
					>
						<template #leading>
							<UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400" />
						</template>
						<template #trailing>
							<UButton
								v-show="formData.email"
								color="gray"
								variant="link"
								icon="i-heroicons-x-mark"
								:disabled="loading"
								@click="formData.email = ''"
							/>
						</template>
					</UInput>
					<template #description>
						<p class="text-xs text-gray-500 mt-1">用于接收重要通知和找回密码</p>
					</template>
				</UFormGroup>
			</div>
		</div>

		<template #footer>
			<div class="flex gap-3 w-full">
				<UButton
					color="gray"
					variant="ghost"
					class="flex-1 justify-center"
					:disabled="loading"
					@click="handleCancel"
				>
					取消
				</UButton>
				<UButton
					color="primary"
					class="flex-1 justify-center shadow-md"
					:loading="loading"
					@click="handleSubmit"
				>
					<UIcon v-if="!loading" name="i-heroicons-check" class="w-4 h-4 mr-1" />
					保存更改
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
	},
	userInfo: {
		type: Object,
		default: () => ({
			username: '',
			email: '',
			avatar: ''
		})
	}
})

const emit = defineEmits(['update:open', 'update'])

const toast = useToast()
const loading = ref(false)
const avatarUploading = ref(false)
const avatarInputRef = ref(null)

const isOpen = computed({
	get: () => props.open,
	set: (value) => emit('update:open', value)
})

const formData = ref({
	username: '',
	email: '',
	avatar: ''
})

const errors = ref({
	username: '',
	email: ''
})

// 监听 userInfo 变化，初始化表单数据
watch(
	() => props.userInfo,
	(newVal) => {
		if (newVal) {
			formData.value = {
				username: newVal.username || '',
				email: newVal.email || '',
				avatar: newVal.avatar || ''
			}
		}
	},
	{ immediate: true, deep: true }
)

// 监听弹窗打开，重置表单
watch(isOpen, (open) => {
	if (open) {
		formData.value = {
			username: props.userInfo.username || '',
			email: props.userInfo.email || '',
			avatar: props.userInfo.avatar || ''
		}
		errors.value = {
			username: '',
			email: ''
		}
	}
})

// 触发头像上传
const triggerAvatarUpload = () => {
	avatarInputRef.value?.click()
}

// 处理头像选择
const handleAvatarChange = async (event) => {
	const file = event.target.files?.[0]
	if (!file) return

	// 验证文件类型
	if (!file.type.startsWith('image/')) {
		toast.add({
			title: '请选择图片文件',
			color: 'error'
		})
		return
	}

	// 验证文件大小（限制 5MB）
	if (file.size > 5 * 1024 * 1024) {
		toast.add({
			title: '图片大小不能超过 5MB',
			color: 'error'
		})
		return
	}

	avatarUploading.value = true
	try {
		// 预览图片（使用 FileReader）
		const reader = new FileReader()
		reader.onload = (e) => {
			formData.value.avatar = e.target.result
		}
		reader.readAsDataURL(file)

		// TODO: 实际上传到服务器
		// const { $api } = useNuxtApp()
		// const fd = new FormData()
		// fd.append('avatar', file)
		// const { url } = await $api.post('/upload/avatar', fd)
		// formData.value.avatar = url
	} catch (error) {
		toast.add({
			title: '上传失败',
			description: error.message,
			color: 'error'
		})
	} finally {
		avatarUploading.value = false
	}

	// 清空input，以便可以重新选择同一个文件
	event.target.value = ''
}

// 验证表单
const validate = () => {
	errors.value = {
		username: '',
		email: ''
	}

	let valid = true

	// 验证用户名
	if (!formData.value.username.trim()) {
		errors.value.username = '请输入用户名'
		valid = false
	} else if (formData.value.username.trim().length < 2) {
		errors.value.username = '用户名至少需要2个字符'
		valid = false
	} else if (formData.value.username.trim().length > 20) {
		errors.value.username = '用户名不能超过20个字符'
		valid = false
	}

	// 验证邮箱
	if (formData.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
		errors.value.email = '请输入有效的邮箱地址'
		valid = false
	}

	return valid
}

// 处理提交
const handleSubmit = async () => {
	if (!validate()) {
		return
	}

	loading.value = true
	try {
		const updatedInfo = {
			username: formData.value.username.trim(),
			email: formData.value.email.trim() || '',
			avatar: formData.value.avatar
		}

		emit('update', updatedInfo)
	} catch (error) {
		toast.add({
			title: '保存失败',
			description: error.message,
			color: 'error'
		})
	} finally {
		loading.value = false
	}
}

// 处理取消
const handleCancel = () => {
	isOpen.value = false
}
</script>

<style scoped>
</style>

