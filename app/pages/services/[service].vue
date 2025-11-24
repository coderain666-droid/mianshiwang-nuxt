<template>
	<div class="min-h-screen bg-neutral-50 py-10 px-4">
		<div class="max-w-4xl mx-auto space-y-6">
			<UCard class="rounded-3xl shadow-lg border-0">
				<template #header>
					<div class="flex flex-col gap-2">
						<p class="text-xs uppercase tracking-[0.3em] text-primary-500">
							{{ pageMeta.pill }}
						</p>
						<h1 class="text-2xl font-semibold text-neutral-900">
							{{ pageMeta.title }}
						</h1>
						<p class="text-sm text-neutral-500">
							{{ pageMeta.description }}
						</p>
					</div>
				</template>

				<div class="space-y-6">
					<div
						class="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 px-5 py-4"
					>
						<p class="text-sm text-primary-700 leading-relaxed">
							{{ pageMeta.highlight }}
						</p>
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						<div
							v-for="card in pageMeta.cards"
							:key="card.title"
							class="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm"
						>
							<div class="flex items-center gap-3 mb-3">
								<div
									class="w-11 h-11 rounded-xl flex items-center justify-center"
									:class="card.accent"
								>
									<UIcon :name="card.icon" class="w-5 h-5" />
								</div>
								<div>
									<p class="text-sm font-semibold text-neutral-900">
										{{ card.title }}
									</p>
									<p class="text-xs text-neutral-500">
										{{ card.caption }}
									</p>
								</div>
							</div>
							<p class="text-sm text-neutral-600 leading-relaxed">
								{{ card.content }}
							</p>
						</div>
					</div>

					<div class="rounded-2xl border border-gray-200 p-5 bg-gray-50">
						<h2 class="text-sm font-semibold text-neutral-900 mb-3">
							体验流程
						</h2>
						<ol class="space-y-3 text-sm text-neutral-600">
							<li v-for="(step, index) in pageMeta.steps" :key="step">
								<span class="font-semibold text-primary-500 mr-2">
									0{{ index + 1 }}.
								</span>
								{{ step }}
							</li>
						</ol>
					</div>
				</div>

				<template #footer>
					<div
						class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
					>
						<p class="text-sm text-neutral-500">
							若需开启专项面试，可返回上一步重新选择。
						</p>
						<div class="flex flex-wrap gap-2">
							<UButton variant="ghost" color="gray" @click="navigateTo('/')">
								返回首页
							</UButton>
							<UButton color="primary" @click="navigateTo('/start')">
								回到面试首页
							</UButton>
						</div>
					</div>
				</template>
			</UCard>
		</div>
	</div>
</template>

<script setup>
import { useRoute, navigateTo } from '#imports'
import { computed } from 'vue'

const route = useRoute()

const serviceMeta = {
	resume: {
		pill: '简历押题',
		title: '岗位深度拆解与押题',
		description: '上传简历后，AI 将基于岗位 JD 生成高频问答与提示。',
		highlight: '结合岗位能力模型和行业数据，输出 10+ 条面试题及答题要点，帮助提前破题。',
		cards: [
			{
				title: '岗位画像',
				caption: '匹配技能 / 经验',
				content: '分析岗位职责与能力模型，定位匹配差距，输出强化建议。',
				icon: 'i-heroicons-magnifying-glass-circle',
				accent: 'bg-blue-50 text-blue-500'
			},
			{
				title: '押题清单',
				caption: '含答案提示',
				content: '生成结构化问答模板，附示例答案，标记易错点和延伸追问。',
				icon: 'i-heroicons-list-bullet',
				accent: 'bg-indigo-50 text-indigo-500'
			}
		],
		steps: [
			'确认岗位与简历信息，提交押题需求',
			'AI 解析后生成题目与答题建议',
			'下载或复制清单，进入专项练习'
		]
	},
	behavior: {
		pill: '综合面试',
		title: '综合面试与表达训练',
		description: '模拟 HR / 综合面试场景，强化沟通表达与故事结构。',
		highlight: '围绕行为面 STAR/BAR 模型，聚焦沟通逻辑、职业动机与协作力。',
		cards: [
			{
				title: '多场景题库',
				caption: 'HR / 综合面',
				content: '涵盖价值观、团队协作、冲突处理等高频问题，实时追问。',
				icon: 'i-heroicons-chat-bubble-left-right',
				accent: 'bg-emerald-50 text-emerald-600'
			},
			{
				title: '表达反馈',
				caption: '结构与情绪',
				content: '即时指出逻辑断点、语速语气及感染力问题，附改进建议。',
				icon: 'i-heroicons-sparkles',
				accent: 'bg-amber-50 text-amber-500'
			}
		],
		steps: [
			'设定目标岗位/场景，生成面试官画像',
			'进行模拟对答，实时记录与评分',
			'查看综合反馈，调整表达结构'
		]
	}
}

const pageMeta = computed(() => {
	const key = route.params.service
	return (
		serviceMeta[key] || serviceMeta.resume
	)
})
</script>

