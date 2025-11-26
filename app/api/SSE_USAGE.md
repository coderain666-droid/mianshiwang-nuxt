# SSE (Server-Sent Events) 接口使用说明

## 简介

本项目使用 SSE 协议实现服务器到客户端的实时数据推送，主要用于简历押题等需要流式返回结果的场景。

## API 函数

### `generateResumeQuizSSE`

处理简历押题的 SSE 流式接口。

#### 参数

```javascript
generateResumeQuizSSE(params, callbacks)
```

**params** (Object) - 请求参数：

- `resumeId` (string): 简历 ID
- `company` (string): 公司名称
- `positionName` (string): 岗位名称
- `minSalary` (string): 最低薪资
- `maxSalary` (string): 最高薪资
- `jd` (string): 岗位职责描述

**callbacks** (Object) - 回调函数：

- `onMessage(data)`: 接收到消息时的回调
- `onError(error)`: 发生错误时的回调
- `onComplete()`: 连接完成时的回调

#### 返回值

返回一个控制器对象：

```javascript
{
	close: Function // 关闭 SSE 连接的方法
}
```

## 使用示例

### 基础使用

```javascript
import { generateResumeQuizSSE } from '@/api/interview'
import { useUserStore } from '@/stores/user'
import { useRuntimeConfig } from '#imports'

// 获取必要的配置
const userStore = useUserStore()
const config = useRuntimeConfig()

// 准备参数
const params = {
	resumeId: '123456',
	company: '字节跳动',
	positionName: '前端开发工程师',
	minSalary: '25',
	maxSalary: '35',
	jd: '负责前端核心业务功能的开发与维护...'
}

// 启动 SSE 连接
const controller = generateResumeQuizSSE(params, {
	token: userStore.token,
	baseURL: config.public.apiBase,
	callbacks: {
		onMessage: (data) => {
			console.log('收到消息:', data)

			// 处理不同类型的消息
			if (data.type === 'question') {
				// 接收到一道题目
				console.log('题目:', data.data.question)
				console.log('答案:', data.data.answer)
			} else if (data.type === 'progress') {
				// 更新进度
				console.log('进度:', data.data.percentage + '%')
			}
		},

		onError: (error) => {
			console.error('SSE 错误:', error)
		},

		onComplete: () => {
			console.log('SSE 连接完成')
		}
	}
})

// 需要时关闭连接
// controller.close()
```

### 在 Vue 组件中使用

```vue
<script setup>
import { ref, onUnmounted } from 'vue'
import { generateResumeQuizSSE } from '@/api/interview'
import { useUserStore } from '@/stores/user'
import { useRuntimeConfig } from '#imports'

const userStore = useUserStore()
const config = useRuntimeConfig()

const results = ref([])
const isLoading = ref(false)
const sseController = ref(null)

const startPrediction = () => {
	isLoading.value = true
	results.value = []

	const params = {
		resumeId: '123456',
		company: '字节跳动',
		positionName: '前端开发工程师',
		jd: '岗位职责...'
	}

	sseController.value = generateResumeQuizSSE(params, {
		token: userStore.token,
		baseURL: config.public.apiBase,
		callbacks: {
			onMessage: (data) => {
				if (data.type === 'question') {
					results.value.push({
						question: data.data.question,
						answer: data.data.answer
					})
				}
			},

			onError: (error) => {
				console.error('押题失败:', error)
				isLoading.value = false
			},

			onComplete: () => {
				console.log('押题完成')
				isLoading.value = false
			}
		}
	})
}

// 组件卸载时清理连接
onUnmounted(() => {
	if (sseController.value) {
		sseController.value.close()
	}
})
</script>
```

## 后端数据格式

### 预期的 SSE 消息格式

后端应该按照以下格式发送 SSE 消息：

```
data: {"type":"progress","data":{"step":0,"percentage":10}}

data: {"type":"question","data":{"question":"请介绍一下你自己","answer":"建议采用 STAR 法则..."}}

data: {"type":"progress","data":{"step":1,"percentage":30}}

data: {"type":"question","data":{"question":"你的优势是什么","answer":"..."}}

data: [DONE]
```

### 消息类型

1. **progress** - 进度更新

```json
{
	"type": "progress",
	"data": {
		"step": 0, // 当前步骤索引 (0-4)
		"percentage": 20 // 进度百分比 (0-100)
	}
}
```

2. **question** - 题目数据

```json
{
	"type": "question",
	"data": {
		"question": "题目内容",
		"answer": "参考答案"
	}
}
```

3. **完成标记**

```
data: [DONE]
```

## 技术细节

### 为什么不使用 EventSource？

标准的 `EventSource` API 有以下限制：

- 只支持 GET 请求
- 不支持自定义请求头
- 不支持发送请求体

因此，我们使用 `fetch` + `ReadableStream` 的方式来实现 SSE，这样可以：

- 支持 POST 请求
- 发送 JSON 请求体
- 添加 Authorization 等自定义请求头

### 错误处理

SSE 连接可能因为以下原因中断：

- 网络错误
- 服务器错误
- 用户主动关闭
- 超时

建议在 `onError` 回调中进行适当的错误提示和重试逻辑。

### 内存管理

务必在以下情况下关闭 SSE 连接：

- 组件卸载时 (`onUnmounted`)
- 用户导航离开页面时
- 用户主动取消操作时
- 接收到完成标记后

```javascript
// 示例：在组件卸载时清理
onUnmounted(() => {
	if (sseController.value) {
		sseController.value.close()
		sseController.value = null
	}
})
```

## 调试技巧

### 查看 SSE 消息

在浏览器开发者工具中：

1. 打开 Network 标签
2. 筛选 EventStream 类型
3. 查看 Messages 面板

### 测试 SSE 端点

使用 curl 测试：

```bash
curl -N -H "Accept: text/event-stream" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -X POST \
     -d '{"resumeId":"123","jd":"..."}' \
     http://localhost:3000/api/interview/resume/quiz/stream
```

## 常见问题

### Q: SSE 连接一直处于 pending 状态？

A: 检查后端是否正确设置了响应头：

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

### Q: 消息接收不完整？

A: 确保后端每条消息都以 `\n\n` 结尾，并且使用 `data: ` 前缀。

### Q: 如何处理认证？

A: Token 会自动从 `userStore` 中获取并添加到请求头中。

### Q: 支持重连吗？

A: 当前实现不支持自动重连，需要在 `onError` 中手动实现重试逻辑。
