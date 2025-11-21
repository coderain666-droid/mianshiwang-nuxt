<template>
	<div class="h-full flex flex-col gap-6">
		<div
			class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-center lg:text-left"
		>
			<div>
				<h1 class="text-xl font-bold text-neutral-900 mb-1">
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
				<h2 class="text-lg font-semibold text-neutral-900 mb-4">选择岗位</h2>

				<!-- 搜索框 -->
				<UInput
					v-model="searchQuery"
					placeholder="搜索岗位名称或描述..."
					icon="i-heroicons-magnifying-glass"
					size="lg"
					class="mb-4"
					@input="handleSearch"
				/>

				<!-- 快速分类筛选 -->
				<div class="mb-4">
					<p class="text-xs text-neutral-500 mb-2">快速筛选</p>
					<div class="flex flex-wrap gap-2">
						<UButton
							v-for="category in categories.slice(0, 6)"
							:key="category.key"
							:variant="activeCategory === category.key ? 'solid' : 'ghost'"
							:color="activeCategory === category.key ? 'primary' : 'gray'"
							size="xs"
							@click="handleCategoryFilter(category.key)"
						>
							{{ category.label }}
						</UButton>
						<UButton
							v-if="categories.length > 6"
							variant="ghost"
							color="gray"
							size="xs"
							@click="showAllCategories = !showAllCategories"
						>
							{{ showAllCategories ? '收起' : '更多' }}
						</UButton>
					</div>
					<div v-if="showAllCategories" class="flex flex-wrap gap-2 mt-2">
						<UButton
							v-for="category in categories.slice(6)"
							:key="category.key"
							:variant="activeCategory === category.key ? 'solid' : 'ghost'"
							:color="activeCategory === category.key ? 'primary' : 'gray'"
							size="xs"
							@click="handleCategoryFilter(category.key)"
						>
							{{ category.label }}
						</UButton>
					</div>
				</div>

				<!-- 已选择的岗位展示 -->
				<div
					v-if="selectedPosition"
					class="p-4 rounded-lg border-2 border-primary-500 bg-primary-50 mb-4"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<div class="flex items-center gap-2 mb-1">
								<UIcon
									name="i-heroicons-check-circle"
									class="w-5 h-5 text-primary-600"
								/>
								<h3 class="font-semibold text-neutral-900">
									{{ selectedPosition.name }}
								</h3>
							</div>
							<p class="text-sm text-neutral-600 mb-2">
								{{ selectedPosition.description }}
							</p>
							<div class="flex items-center gap-2 text-xs text-neutral-500">
								<span class="px-2 py-0.5 rounded bg-white/60">
									{{ getCategoryLabel(selectedPosition.category) }}
								</span>
								<span v-if="selectedPosition.level">
									· {{ selectedPosition.level }}
								</span>
							</div>
						</div>
						<UButton
							color="gray"
							variant="ghost"
							size="sm"
							icon="i-heroicons-x-mark"
							@click="clearPosition"
						/>
					</div>
				</div>

				<!-- 岗位列表（可选，用于浏览） -->
				<div
					v-if="!selectedPosition && filteredPositions.length > 0"
					class="flex-1 min-h-0 overflow-hidden"
				>
					<p class="text-xs text-neutral-500 mb-2">
						或从下方列表中选择（{{ filteredPositions.length }} 个岗位）
					</p>
					<div class="space-y-2 h-full overflow-y-auto pr-1">
						<div
							v-for="position in filteredPositions.slice(0, 10)"
							:key="position.id"
							:class="[
								'p-3 rounded-lg border cursor-pointer transition-all',
								'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'
							]"
							@click="selectPosition(position)"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1 min-w-0">
									<h3
										class="font-medium text-neutral-900 text-sm mb-1 truncate"
									>
										{{ position.name }}
									</h3>
									<p class="text-xs text-neutral-600 line-clamp-1">
										{{ position.description }}
									</p>
								</div>
							</div>
						</div>
						<div
							v-if="filteredPositions.length > 10"
							class="text-center py-2 text-xs text-neutral-500"
						>
							还有 {{ filteredPositions.length - 10 }} 个岗位，请使用搜索查找
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧：简历导入 -->
			<div
				class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-0"
			>
				<div class="flex-1 min-h-0 overflow-y-auto pr-1">
					<ResumeSelector v-model="resumeData">
						<template #title>
							<h2 class="text-lg font-semibold text-neutral-900">选择简历</h2>
						</template>
					</ResumeSelector>
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
import ResumeSelector from '@/components/interview/ResumeSelector.vue'

const emit = defineEmits(['next'])

const interviewStore = useInterviewStore()
const toast = useToast()

const searchQuery = ref('')
const activeCategory = ref('all')
const showAllCategories = ref(false)
const resumeData = ref(null)

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
	searchQuery.value = position.name
}

const handleCategoryFilter = (categoryKey) => {
	activeCategory.value = categoryKey
	searchQuery.value = '' // 清空搜索
}

const handleSearch = () => {
	// 搜索时自动清除分类筛选
	if (searchQuery.value.trim()) {
		activeCategory.value = 'all'
	}
}

const clearPosition = () => {
	interviewStore.selectPosition(null)
	searchQuery.value = ''
	activeCategory.value = 'all'
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
		resumeData.value &&
		(resumeData.value.type === 'resume' || resumeData.value.type === 'text')
	)
})

const getCategoryLabel = (category) => {
	const cat = categories.find((c) => c.key === category)
	return cat ? cat.label : category
}

const handleNext = async () => {
	if (!canProceed.value) {
		toast.add({
			title: '请完成必填项',
			description: '请选择岗位并选择简历或输入简历内容',
			color: 'warning'
		})
		return
	}

	// 保存简历数据到 store
	if (resumeData.value) {
		if (resumeData.value.type === 'resume') {
			interviewStore.setResume(null, resumeData.value.resume.resumeUrl, '')
		} else if (resumeData.value.type === 'text') {
			interviewStore.setResume(null, null, resumeData.value.text)
		}
	}

	emit('next')
}
</script>

<style scoped></style>
