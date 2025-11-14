<template>
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-8">
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full mb-4">
				<UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
				<span class="font-medium">面试已完成</span>
			</div>
			<h1 class="text-3xl font-bold text-neutral-900 mb-2">面试评估报告</h1>
			<p class="text-neutral-600">
				基于你的面试表现生成的个性化评估报告和提升建议
			</p>
		</div>

		<!-- 操作栏 -->
		<div class="flex items-center justify-end gap-3 mb-6">
			<UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" @click="handleRestart">
				重新开始
			</UButton>
			<UButton
				color="primary"
				icon="i-heroicons-arrow-down-tray"
				:loading="isGeneratingPDF"
				@click="handleDownloadPDF"
			>
				下载 PDF 报告
			</UButton>
		</div>

		<!-- 综合评分卡片 -->
		<div class="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-200 p-8 mb-6">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold text-neutral-900 mb-2">综合评分</h2>
					<p class="text-neutral-600">
						{{ report?.overall?.summary || '基于你在面试中的整体表现进行评估' }}
					</p>
				</div>
				<div class="text-right">
					<div class="text-5xl font-bold text-primary-600 mb-1">
						{{ report?.overall?.score || 0 }}
					</div>
					<div class="text-sm text-neutral-600">分</div>
					<div class="mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium inline-block">
						{{ report?.overall?.level || '良好' }}
					</div>
				</div>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-6">
			<!-- 左侧：STAR 分析 -->
			<div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
				<h2 class="text-lg font-semibold text-neutral-900 mb-4">STAR 模型分析</h2>
				<div class="space-y-4">
					<div
						v-for="(star, index) in starItems"
						:key="index"
						class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
					>
						<div
							class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold"
						>
							{{ star.letter }}
						</div>
						<div class="flex-1">
							<div class="font-medium text-neutral-900 mb-1">{{ star.name }}</div>
							<div class="text-sm text-neutral-600">{{ star.description }}</div>
							<div class="mt-2 text-sm text-neutral-500">{{ star.feedback }}</div>
						</div>
					</div>
				</div>
				<div class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
					<div class="flex items-start gap-2">
						<UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
						<div>
							<div class="font-medium text-amber-900 mb-1">评分：{{ report?.star?.score || 0 }} 分</div>
							<div class="text-sm text-amber-700">
								{{ report?.star?.feedback || '能够使用 STAR 方法回答问题，但可以进一步优化' }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧：技能矩阵 -->
			<div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
				<h2 class="text-lg font-semibold text-neutral-900 mb-4">技能矩阵</h2>
				<div class="space-y-4">
					<div
						v-for="(skill, index) in report?.skills || []"
						:key="index"
						class="space-y-2"
					>
						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-900">{{ skill.name }}</span>
							<span class="text-sm font-semibold text-primary-600">{{ skill.score }} 分</span>
						</div>
						<div class="w-full bg-gray-200 rounded-full h-2.5">
							<div
								class="bg-primary-600 h-2.5 rounded-full transition-all"
								:style="{ width: `${skill.score}%` }"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 风险点识别 -->
		<div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
			<h2 class="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
				<UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-amber-600" />
				风险点识别
			</h2>
			<ul class="space-y-2">
				<li
					v-for="(risk, index) in report?.risks || []"
					:key="index"
					class="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg"
				>
					<UIcon
						name="i-heroicons-x-circle"
						class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
					/>
					<span class="text-neutral-900">{{ risk }}</span>
				</li>
			</ul>
		</div>

		<!-- 改进建议 -->
		<div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
			<h2 class="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
				<UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-primary-600" />
				改进建议
			</h2>
			<ul class="space-y-2">
				<li
					v-for="(suggestion, index) in report?.suggestions || []"
					:key="index"
					class="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg"
				>
					<UIcon
						name="i-heroicons-check-circle"
						class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
					/>
					<span class="text-neutral-900">{{ suggestion }}</span>
				</li>
			</ul>
		</div>

		<!-- 7 天强化练习计划 -->
		<div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
			<h2 class="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
				<UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-primary-600" />
				7 天强化练习计划
			</h2>
			<div class="grid md:grid-cols-7 gap-4">
				<div
					v-for="(day, index) in plan7Days?.days || []"
					:key="index"
					class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
				>
					<div class="text-xs text-neutral-500 mb-1">第 {{ day.day }} 天</div>
					<div class="font-semibold text-neutral-900 mb-2">{{ day.date }}</div>
					<ul class="space-y-1.5 text-sm text-neutral-600">
						<li
							v-for="(task, taskIndex) in day.tasks"
							:key="taskIndex"
							class="flex items-start gap-1.5"
						>
							<UIcon name="i-heroicons-check" class="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
							<span>{{ task }}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 底部操作 -->
		<div class="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-200">
			<UButton color="primary" size="lg" @click="handleRestart">
				开始新的面试
			</UButton>
			<UButton color="gray" variant="ghost" size="lg" to="/">
				返回首页
			</UButton>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { useToast } from '#imports'
import { saveAs } from 'file-saver'

const emit = defineEmits(['restart'])

const interviewStore = useInterviewStore()
const toast = useToast()

const isGeneratingPDF = ref(false)

const report = computed(() => interviewStore.report)
const plan7Days = computed(() => interviewStore.plan7Days)

const starItems = [
	{
		letter: 'S',
		name: 'Situation（情境）',
		description: '描述你当时所处的情况和背景',
		feedback: '能够清晰描述背景情境'
	},
	{
		letter: 'T',
		name: 'Task（任务）',
		description: '说明你面临的任务或挑战',
		feedback: '任务描述明确，目标清晰'
	},
	{
		letter: 'A',
		name: 'Action（行动）',
		description: '阐述你采取的具体行动',
		feedback: '行动描述可以更具体，建议补充更多细节'
	},
	{
		letter: 'R',
		name: 'Result（结果）',
		description: '说明行动带来的结果和影响',
		feedback: '结果描述有数据支撑，很好'
	}
]

const handleRestart = () => {
	interviewStore.reset()
	emit('restart')
}

const handleDownloadPDF = async () => {
	try {
		isGeneratingPDF.value = true

		// TODO: 调用 API 生成 PDF
		// const response = await $api(`/interview/${interviewStore.interviewId}/report/pdf`, {
		// 	method: 'GET',
		// 	responseType: 'blob'
		// })
		
		// 模拟 PDF 生成
		await new Promise(resolve => setTimeout(resolve, 2000))
		
		// 创建模拟的 PDF Blob
		// 实际应用中，这里应该是从服务器获取的真实 PDF
		const pdfContent = `面试评估报告\n\n综合评分：${report.value?.overall?.score || 0} 分\n\n...`
		const blob = new Blob([pdfContent], { type: 'application/pdf' })
		
		// 使用 file-saver 下载
		const fileName = `面试评估报告_${interviewStore.selectedPosition?.name || '未知岗位'}_${new Date().toISOString().split('T')[0]}.pdf`
		saveAs(blob, fileName)
		
		toast.add({
			title: 'PDF 下载成功',
			color: 'success'
		})
		
	} catch (error) {
		toast.add({
			title: 'PDF 生成失败',
			description: error.message || '请稍后重试',
			color: 'error'
		})
	} finally {
		isGeneratingPDF.value = false
	}
}
</script>

<style scoped></style>

