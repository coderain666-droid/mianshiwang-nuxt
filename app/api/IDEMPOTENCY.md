# 幂等性控制实现说明

## 什么是幂等性？

幂等性（Idempotency）是指：**同一个操作执行多次，产生的结果与执行一次相同**。

在 Web 应用中，幂等性用于防止：
- 用户快速重复点击按钮
- 网络波动导致的重复请求
- 前端 Bug 导致的多次调用

## 实现原理

### 核心思想

使用 `requestId`（唯一请求标识符）来标识一次业务操作：
- **相同的 requestId** → 后端识别为同一个请求 → 返回缓存结果或拒绝重复处理
- **不同的 requestId** → 后端识别为不同请求 → 正常处理

### 关键点

1. **requestId 必须稳定**：同一次业务操作的多次重试应使用相同的 requestId
2. **requestId 必须唯一**：不同的业务操作必须使用不同的 requestId
3. **生成时机很重要**：在正确的时机生成 requestId

## 我们的实现方案

### 方案选择：在确认时生成

```javascript
// ✅ 正确：在用户点击"立即押题"时生成
const handlePredictClick = () => {
  const requestId = uuidv4() // 生成一次
  
  globalModal.showModal({
    contentProps: {
      onConfirm: () => {
        startPredictionProcess(requestId) // 使用同一个 requestId
      }
    }
  })
}

// 接收并使用 requestId
const startPredictionProcess = async (requestId) => {
  const params = {
    // ...
    requestId // 使用传入的 requestId
  }
}
```

### 为什么这样做？

| 场景 | 行为 | 结果 |
|------|------|------|
| 用户点击"立即押题" | 生成 requestId-A | ✅ 正常 |
| 用户在确认弹窗中点击"开始押题" | 使用 requestId-A 发送请求 | ✅ 正常处理 |
| 用户快速点击多次"开始押题" | 多次使用 requestId-A 发送请求 | ✅ 后端识别为重复请求，拒绝处理 |
| 网络波动导致重试 | 重试时仍使用 requestId-A | ✅ 后端识别为重复请求，返回缓存结果 |
| 用户修改表单后重新点击"立即押题" | 生成新的 requestId-B | ✅ 后端识别为新请求，正常处理 |

## 错误示例

### ❌ 错误 1：每次调用都生成新 ID

```javascript
const startPredictionProcess = async () => {
  const params = {
    requestId: uuidv4() // ❌ 每次调用都生成新的
  }
}
```

**问题**：用户快速点击多次，每次都生成不同的 requestId，后端无法识别为重复请求。

### ❌ 错误 2：全局只生成一次

```javascript
const GLOBAL_REQUEST_ID = uuidv4() // ❌ 组件初始化时生成一次

const startPredictionProcess = async () => {
  const params = {
    requestId: GLOBAL_REQUEST_ID // 一直使用同一个
  }
}
```

**问题**：用户修改表单后重新提交，仍使用相同的 requestId，后端会拒绝处理新的请求。

## 其他可选方案

### 方案 2：基于业务数据生成（适合特定场景）

```javascript
import { v5 as uuidv5 } from 'uuid'

const generateRequestId = (businessData) => {
  const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
  const key = JSON.stringify(businessData)
  return uuidv5(key, NAMESPACE)
}

const startPredictionProcess = async () => {
  const businessData = {
    resumeId: interviewStore.resumeId,
    jd: interviewStore.selectedPosition.jd
  }
  
  const params = {
    // 相同的业务数据 → 相同的 requestId
    requestId: generateRequestId(businessData)
  }
}
```

**优点**：
- 自动去重：相同的业务数据自动生成相同的 requestId
- 无需手动管理 requestId 的生命周期

**缺点**：
- 如果用户想用相同的数据重新押题，会被拒绝
- 不适合我们的场景（用户可能想用相同的 JD 多次押题）

### 方案 3：使用 ref 缓存（适合表单场景）

```javascript
const currentRequestId = ref(null)

// 监听表单变化，重置 requestId
watch(
  () => interviewStore.selectedPosition.jd,
  () => {
    currentRequestId.value = uuidv4()
  },
  { immediate: true }
)

const startPredictionProcess = async () => {
  const params = {
    requestId: currentRequestId.value
  }
}
```

**优点**：
- 表单内容变化时自动生成新的 requestId
- 表单内容不变时，多次提交使用相同的 requestId

**缺点**：
- 需要准确识别哪些字段变化应该重置 requestId
- 逻辑相对复杂

## 后端处理

后端应该：

1. **存储 requestId**：将 requestId 与处理结果关联存储（如 Redis）
2. **检查重复**：收到请求时，先检查 requestId 是否已处理
3. **返回结果**：
   - 如果是重复请求 → 返回缓存的结果或 409 Conflict
   - 如果是新请求 → 正常处理并存储结果

```typescript
// 伪代码示例
async handleResumeQuiz(dto: ResumeQuizDto) {
  const { requestId } = dto
  
  // 检查是否已处理
  const cached = await redis.get(`quiz:${requestId}`)
  if (cached) {
    return JSON.parse(cached) // 返回缓存结果
  }
  
  // 设置处理中标记（防止并发）
  const locked = await redis.set(
    `quiz:${requestId}:lock`,
    '1',
    'EX', 300, // 5分钟过期
    'NX' // 只在不存在时设置
  )
  
  if (!locked) {
    throw new ConflictException('请求正在处理中，请勿重复提交')
  }
  
  try {
    // 实际处理逻辑
    const result = await this.processQuiz(dto)
    
    // 缓存结果（24小时）
    await redis.set(
      `quiz:${requestId}`,
      JSON.stringify(result),
      'EX',
      86400
    )
    
    return result
  } finally {
    // 释放锁
    await redis.del(`quiz:${requestId}:lock`)
  }
}
```

## 测试场景

### 场景 1：正常流程
1. 用户填写表单
2. 点击"立即押题" → 生成 requestId-A
3. 点击"开始押题" → 使用 requestId-A 发送请求
4. 后端处理成功 ✅

### 场景 2：防止重复提交
1. 用户点击"立即押题" → 生成 requestId-A
2. 用户快速点击 3 次"开始押题"
3. 第 1 次请求：使用 requestId-A → 后端正常处理 ✅
4. 第 2、3 次请求：使用 requestId-A → 后端识别为重复，拒绝处理 ✅

### 场景 3：网络重试
1. 用户点击"开始押题" → 使用 requestId-A 发送请求
2. 网络超时，前端自动重试
3. 重试请求：仍使用 requestId-A → 后端返回缓存结果 ✅

### 场景 4：修改表单后重新提交
1. 用户点击"立即押题" → 生成 requestId-A
2. 用户点击"开始押题" → 使用 requestId-A 发送请求
3. 用户返回修改表单
4. 用户再次点击"立即押题" → 生成新的 requestId-B
5. 用户点击"开始押题" → 使用 requestId-B 发送请求
6. 后端识别为新请求，正常处理 ✅

## 总结

✅ **我们的实现**：
- 在用户点击"立即押题"时生成 requestId
- 在确认后的处理函数中使用该 requestId
- 确保了幂等性，同时支持用户修改表单后重新提交

✅ **优点**：
- 逻辑清晰：一次"确认"对应一个 requestId
- 用户体验好：防止重复提交，同时不影响正常使用
- 实现简单：无需复杂的状态管理

🎯 **关键原则**：
> requestId 应该在"用户发起操作"时生成，而不是在"执行操作"时生成

