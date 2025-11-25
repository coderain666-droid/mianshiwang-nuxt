# 路由重构说明

## 📋 改动概览

将专项面试从 Step 容器模式改为独立路由模式，与简历押题、综合面试保持一致。

---

## 🗂️ 新增文件

### 1. **布局文件**

- `app/layouts/interview.vue`
  - 专门为面试页面设计的布局
  - 包含顶部导航栏（面包屑 + AI 服务状态）
  - 保持与 `start.vue` 一致的 UI 风格

### 2. **专项面试路由**

- `app/pages/interview/special.vue`

  - 专项面试主页面
  - 使用 `interview` 布局
  - 包含路由守卫：检查是否已选择岗位和简历

- `app/pages/interview/special/report.vue`
  - 专项面试报告页面
  - 包含路由守卫：检查是否已生成报告

---

## 🔄 修改文件

### 1. **InterviewStep1.vue**

```javascript
// 修改前：专项面试触发 emit('next')
if (serviceId === SERVICE_TAGS.SPECIAL) {
	emit('next', serviceId)
	return
}

// 修改后：统一跳转到对应路由
const serviceRouteMap = {
	[SERVICE_TAGS.RESUME]: '/services/resume',
	[SERVICE_TAGS.SPECIAL]: '/interview/special', // ✅ 新增
	[SERVICE_TAGS.BEHAVIOR]: '/services/behavior'
}
await navigateTo(routeMap[serviceId])
```

### 2. **start.vue**

```vue
<!-- 修改前：动态渲染 Step1/2/3 -->
<component :is="currentStepComponent" />

<!-- 修改后：只渲染 Step1 -->
<InterviewStep1 class="h-full" />
```

- 移除了 `InterviewStep2`、`InterviewStep3` 的导入
- 移除了 `handleStep1Next`、`handleStep2Complete` 等方法
- 简化了 `currentStep` 逻辑（固定为 1）

### 3. **stores/interview.js**

```javascript
// 更新字段注释
resumeType: null,  // 简历类型：'resume' | 'text'
resumeId: null,    // 简历 ID（当 type='resume' 时）
resumeText: ''     // 简历文本（当 type='text' 时）

// 修复 getter
canGoToNextStep: (state) => {
  return state.selectedPosition && (state.resumeId || state.resumeText)
  // 之前错误地使用了 state.resumeUrl
}
```

---

## 🎯 路由结构

### **修改前**

```
/start                    # Step 容器
  ├─ Step 1: 选择岗位     # InterviewStep1
  ├─ Step 2: 专项面试     # InterviewStep2 ❌
  └─ Step 3: 查看报告     # InterviewStep3 ❌
```

### **修改后**

```
/start                          # 选择岗位和简历（InterviewStep1）
  ↓ 选择服务后跳转：

/interview/special              # 专项面试 ✅
  ↓ 完成后跳转：
  /interview/special/report     # 专项面试报告 ✅

/services/resume                # 简历押题（已存在）
/services/behavior              # 综合面试（已存在）
```

---

## 🔒 路由守卫

### **专项面试页面守卫**

```javascript
// /pages/interview/special.vue
onMounted(() => {
	// 1. 检查是否选择岗位
	if (!interviewStore.selectedPosition) {
		navigateTo('/interview/start')
		return
	}

	// 2. 检查服务类型是否匹配
	if (interviewStore.selectedService !== SERVICE_TAGS.SPECIAL) {
		navigateTo('/interview/start')
		return
	}
})
```

### **报告页面守卫**

```javascript
// /pages/interview/special/report.vue
onMounted(() => {
	// 检查是否已生成报告
	if (!interviewStore.report || !interviewStore.reportGenerated) {
		navigateTo('/interview/special')
		return
	}
})
```

---

## ✅ 优势

1. **URL 可分享**：`/interview/special` 比 `/start?step=2` 更语义化
2. **代码解耦**：每个服务独立管理，互不影响
3. **状态清晰**：路由即状态，无需额外的 `currentStep` 字段
4. **易于扩展**：新增服务只需添加新路由，无需修改 `start.vue`
5. **权限控制**：每个路由可独立配置 middleware

---

## 🧪 测试清单

- [ ] 从 `/start` 选择专项面试 → 跳转到 `/interview/special`
- [ ] 在 `/interview/special` 点击"开始面试" → 显示确认弹窗
- [ ] 完成面试 → 跳转到 `/interview/special/report`
- [ ] 在报告页点击"重新开始" → 跳转回 `/start`
- [ ] 直接访问 `/interview/special`（未选择岗位）→ 重定向到 `/start`
- [ ] 直接访问 `/interview/special/report`（未生成报告）→ 重定向到 `/interview/special`
- [ ] 选择简历押题 → 跳转到 `/services/resume`
- [ ] 选择综合面试 → 跳转到 `/services/behavior`

---

## 📝 后续工作

1. **综合面试**：参考专项面试，创建 `/pages/interview/behavior.vue` 和 `/pages/interview/behavior/report.vue`
2. **简历押题**：考虑是否也统一到 `/interview/resume` 路由（可选）
3. **中间件**：为不同服务添加余额检查中间件（如 `check-special-balance`）
4. **404 处理**：添加面试相关的 404 页面

---

## 🚨 注意事项

1. **Pinia 持久化**：确保 `interviewStore` 已配置 `persist: true`，否则刷新页面会丢失状态
2. **浏览器回退**：用户在面试页点击浏览器后退按钮会回到 `/start`，需确保状态正确恢复
3. **并发面试**：当前设计假设用户同时只能进行一个面试，如需支持多个面试需调整 store 结构
