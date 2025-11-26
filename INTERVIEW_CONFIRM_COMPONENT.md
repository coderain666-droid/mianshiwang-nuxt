# 面试确认组件重构文档

## 📋 概述

`SpecialInterviewConfirm` 组件已重构为通用的面试确认组件，支持三种不同的面试服务场景：
- **简历押题** (resume)
- **专项面试** (special)
- **行测 + HR 面试** (behavior)

## 🎯 组件特性

### 1. **统一接口，多场景适配**
通过 `serviceType` prop 自动适配不同服务场景，无需创建多个组件。

### 2. **动态配置**
- 不同的边框颜色和图标颜色
- 不同的服务说明文案
- 不同的时长和余额提示
- 不同的按钮文案

### 3. **余额校验**
- 自动检测余额是否充足
- 余额不足时禁用按钮并显示提示

### 4. **公司信息编辑**
- 支持输入目标公司（选填）
- 自动同步到 store

## 📦 组件 Props

```javascript
{
  serviceType: String,      // 必填: 'resume' | 'special' | 'behavior'
  positionName: String,     // 目标岗位名称
  company: String,          // 目标公司（初始值）
  remainingCount: Number,   // 剩余次数
  onCompanyUpdate: Function, // 公司信息更新回调
  onConfirm: Function       // 确认按钮回调
}
```

## 🎨 三种服务场景配置

### 简历押题 (resume)
- **主题色**: 蓝色 (blue)
- **时长**: 3-5 分钟
- **按钮**: "开始押题"
- **余额字段**: `userStore.userInfo.resumeRemainingCount`
- **特点**: 基于岗位 JD 生成押题清单

### 专项面试 (special)
- **主题色**: 主色调 (primary)
- **时长**: 约 1 小时
- **按钮**: "开始面试"
- **余额字段**: `userStore.userInfo.specialRemainingCount`
- **特点**: 专项技能面试模拟，AI 即时反馈

### 行测 + HR 面试 (behavior)
- **主题色**: 紫色 (purple)
- **时长**: 约 45 分钟
- **按钮**: "开始面试"
- **余额字段**: `userStore.userInfo.behaviorRemainingCount`
- **特点**: 行测题库 + HR 面试，全面评估软技能

## 💻 使用示例

### 在 resume.vue 中使用

```vue
<script setup>
import { onMounted, computed } from 'vue'
import { useGlobalModal } from '@/composables/useGlobalModal'
import { useInterviewStore } from '@/stores/interview'
import { useUserStore } from '@/stores/user'
import SpecialInterviewConfirm from '@/components/interview/SpecialInterviewConfirm.vue'

const globalModal = useGlobalModal()
const interviewStore = useInterviewStore()
const userStore = useUserStore()

const positionName = computed(
  () => interviewStore.selectedPosition?.name || '通用岗位'
)

const resumeBalance = computed(
  () => userStore.userInfo?.resumeRemainingCount ?? 0
)

onMounted(() => {
  globalModal.showModal({
    title: '准备开始简历押题',
    description: '请确认以下信息后再开始押题流程',
    contentComponent: SpecialInterviewConfirm,
    contentProps: {
      serviceType: 'resume',  // 关键：指定服务类型
      positionName: positionName.value,
      company: interviewStore.targetCompany,
      remainingCount: resumeBalance.value,
      onCompanyUpdate: (company) => {
        interviewStore.setTargetCompany(company)
      },
      onConfirm: () => {
        globalModal.closeModal()
        // 开始押题流程
      }
    },
    buttons: [],
    preventClose: true
  })
})
</script>
```

### 在 special.vue 中使用

```vue
contentProps: {
  serviceType: 'special',  // 专项面试
  positionName: positionName.value,
  company: interviewStore.targetCompany,
  remainingCount: specialBalance.value,
  // ... 其他配置
}
```

### 在 behavior.vue 中使用

```vue
contentProps: {
  serviceType: 'behavior',  // 综合面试
  positionName: positionName.value,
  company: interviewStore.targetCompany,
  remainingCount: behaviorBalance.value,
  // ... 其他配置
}
```

## 🔄 数据流

```
用户进入页面
    ↓
onMounted 触发
    ↓
显示确认弹窗 (SpecialInterviewConfirm)
    ↓
用户填写/确认信息
    ↓
点击确认按钮
    ↓
onCompanyUpdate 回调 → 更新 store
    ↓
onConfirm 回调 → 关闭弹窗 + 开始服务流程
```

## 📊 配置对比表

| 配置项 | 简历押题 | 专项面试 | 综合面试 |
|--------|---------|---------|---------|
| serviceType | `resume` | `special` | `behavior` |
| 主题色 | 蓝色 | 主色调 | 紫色 |
| 边框类 | `border-blue-200` | `border-primary-200` | `border-purple-200` |
| 图标色 | `text-blue-500` | `text-primary-500` | `text-purple-500` |
| 时长 | 3-5 分钟 | 约 1 小时 | 约 45 分钟 |
| 按钮文案 | 开始押题 | 开始面试 | 开始面试 |
| 余额字段 | `resumeRemainingCount` | `specialRemainingCount` | `behaviorRemainingCount` |

## ✅ 优势

1. **代码复用**: 一个组件适配三种场景，减少重复代码
2. **易于维护**: 配置集中管理，修改方便
3. **类型安全**: serviceType 有 validator 校验
4. **用户体验**: 
   - 余额不足自动禁用
   - 不同服务有不同的视觉主题
   - 清晰的服务说明和时长提示
5. **扩展性强**: 未来新增服务类型只需添加配置

## 🎯 最佳实践

1. **始终传入正确的 serviceType**
   ```javascript
   serviceType: SERVICE_TAGS.RESUME  // 使用常量，避免拼写错误
   ```

2. **确保余额数据准确**
   ```javascript
   remainingCount: computed(() => userStore.userInfo?.resumeRemainingCount ?? 0)
   ```

3. **处理公司信息更新**
   ```javascript
   onCompanyUpdate: (company) => {
     interviewStore.setTargetCompany(company)
   }
   ```

4. **在 onConfirm 中关闭弹窗**
   ```javascript
   onConfirm: () => {
     globalModal.closeModal()
     // 开始服务流程
   }
   ```

## 🔧 技术细节

### 动态配置实现
使用 `computed` 属性根据 `serviceType` 动态返回配置：

```javascript
const serviceConfig = computed(() => {
  const configs = {
    [SERVICE_TAGS.RESUME]: { /* 简历押题配置 */ },
    [SERVICE_TAGS.SPECIAL]: { /* 专项面试配置 */ },
    [SERVICE_TAGS.BEHAVIOR]: { /* 综合面试配置 */ }
  }
  return configs[props.serviceType] || configs[SERVICE_TAGS.SPECIAL]
})
```

### 动态样式绑定
```vue
<div :class="serviceConfig.borderColor">
  <UIcon :class="serviceConfig.iconColor" />
</div>
```

### HTML 内容渲染
使用 `v-html` 支持富文本内容：
```vue
<span v-html="item.text"></span>
```

## 📝 待办事项

- [ ] 实现实际的服务启动逻辑（目前是 console.log）
- [ ] 添加余额不足时的充值引导
- [ ] 考虑添加服务预览功能
- [ ] 优化移动端显示效果

## 🐛 已知问题

无

## 📅 更新日志

### 2025-11-26
- ✅ 重构组件为通用确认组件
- ✅ 支持三种服务场景
- ✅ 添加余额校验
- ✅ 优化视觉设计（不同主题色）
- ✅ 在 resume.vue、special.vue、behavior.vue 中集成

