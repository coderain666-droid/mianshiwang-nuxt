# useGlobalModal API 文档

## 📋 概述

`useGlobalModal` 是一个用于程序化创建和管理模态框的 Vue 3 Composable，支持多模态框管理、自动清理和灵活配置。

## 🎯 新增功能

### ✅ 新增方法

1. **`closeModal(reason)`** - 关闭最后一个打开的模态框
2. **`closeAllModals(reason)`** - 关闭所有打开的模态框

## 📦 API 参考

### 1. `showModal(options)`

创建并显示一个模态框。

#### 参数

```typescript
interface ModalOptions {
  // 标题
  title?: string
  
  // 描述文本
  description?: string
  
  // 文本内容（与 contentComponent 二选一）
  content?: string
  
  // 自定义组件（与 content 二选一）
  contentComponent?: Component
  
  // 传递给自定义组件的 props
  contentProps?: Record<string, any>
  
  // 按钮配置数组
  buttons?: Array<{
    label: string
    color?: 'primary' | 'neutral' | 'red' | 'green' | ...
    variant?: 'solid' | 'outline' | 'ghost' | 'soft'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    icon?: string
    disabled?: boolean
    block?: boolean
    closeOnClick?: boolean  // 默认 true
    onClick?: () => void | Promise<void> | boolean
    reason?: string
  }>
  
  // 是否阻止通过点击遮罩或 ESC 关闭
  preventClose?: boolean
  
  // 自定义 UI 配置
  ui?: {
    content?: string  // 自定义内容区域类名
    // ... 其他 UModal 的 ui 配置
  }
  
  // 关闭回调
  onClose?: (reason: string) => void
}
```

#### 返回值

```typescript
{
  close: (reason?: string) => void
}
```

#### 示例

```javascript
const globalModal = useGlobalModal()

// 显示一个简单的确认对话框
const controller = globalModal.showModal({
  title: '确认删除',
  description: '此操作不可撤销',
  content: '确定要删除这条记录吗？',
  buttons: [
    {
      label: '取消',
      variant: 'outline',
      onClick: () => {
        console.log('用户取消')
      }
    },
    {
      label: '确认删除',
      color: 'red',
      onClick: async () => {
        await deleteRecord()
        console.log('删除成功')
      }
    }
  ]
})

// 手动关闭
controller.close('manual')
```

### 2. `closeModal(reason)` ⭐ 新增

关闭最后一个打开的模态框。

#### 参数

- `reason` (string, 可选): 关闭原因，默认为 `'programmatic'`

#### 示例

```javascript
const globalModal = useGlobalModal()

// 显示模态框
globalModal.showModal({
  title: '加载中',
  content: '请稍候...',
  buttons: [],
  preventClose: true
})

// 在某个时机关闭最后一个模态框
setTimeout(() => {
  globalModal.closeModal('timeout')
}, 3000)
```

### 3. `closeAllModals(reason)` ⭐ 新增

关闭所有打开的模态框。

#### 参数

- `reason` (string, 可选): 关闭原因，默认为 `'programmatic'`

#### 示例

```javascript
const globalModal = useGlobalModal()

// 显示多个模态框
globalModal.showModal({ title: '模态框 1' })
globalModal.showModal({ title: '模态框 2' })
globalModal.showModal({ title: '模态框 3' })

// 一次性关闭所有模态框
globalModal.closeAllModals('cleanup')
```

## 💡 使用场景

### 场景 1: 简单的确认对话框

```javascript
const globalModal = useGlobalModal()

const confirmDelete = () => {
  globalModal.showModal({
    title: '确认删除',
    description: '此操作不可撤销',
    buttons: [
      { label: '取消', variant: 'outline' },
      { 
        label: '删除', 
        color: 'red',
        onClick: async () => {
          await deleteItem()
          toast.add({ title: '删除成功' })
        }
      }
    ]
  })
}
```

### 场景 2: 自定义组件模态框

```javascript
import MyCustomForm from '@/components/MyCustomForm.vue'

const globalModal = useGlobalModal()

globalModal.showModal({
  title: '编辑信息',
  contentComponent: MyCustomForm,
  contentProps: {
    userId: 123,
    onSave: (data) => {
      console.log('保存数据:', data)
      globalModal.closeModal('saved')
    }
  },
  buttons: []  // 不显示默认按钮
})
```

### 场景 3: 加载状态模态框

```javascript
const globalModal = useGlobalModal()

// 显示加载模态框
globalModal.showModal({
  title: '处理中',
  content: '请稍候，正在处理您的请求...',
  buttons: [],
  preventClose: true
})

// 执行异步操作
try {
  await processData()
  globalModal.closeModal('success')
  toast.add({ title: '处理成功' })
} catch (error) {
  globalModal.closeModal('error')
  toast.add({ title: '处理失败', color: 'red' })
}
```

### 场景 4: 面试确认弹窗（实际应用）

```javascript
import SpecialInterviewConfirm from '@/components/interview/SpecialInterviewConfirm.vue'

const globalModal = useGlobalModal()
const interviewStore = useInterviewStore()

onMounted(() => {
  globalModal.showModal({
    title: '准备开始专项面试',
    description: '请确认以下信息后再开始面试',
    contentComponent: SpecialInterviewConfirm,
    contentProps: {
      serviceType: 'special',
      positionName: '前端工程师',
      company: interviewStore.targetCompany,
      remainingCount: 5,
      onCompanyUpdate: (company) => {
        interviewStore.setTargetCompany(company)
      },
      onConfirm: () => {
        globalModal.closeModal('confirmed')
        startInterview()
      }
    },
    buttons: [],
    preventClose: true
  })
})
```

### 场景 5: 多步骤向导

```javascript
const globalModal = useGlobalModal()
let currentStep = 1

const showStep = (step) => {
  globalModal.closeModal('next-step')  // 关闭当前步骤
  
  globalModal.showModal({
    title: `步骤 ${step}/3`,
    contentComponent: getStepComponent(step),
    buttons: [
      step > 1 ? { 
        label: '上一步', 
        variant: 'outline',
        onClick: () => showStep(step - 1)
      } : null,
      { 
        label: step < 3 ? '下一步' : '完成',
        onClick: () => {
          if (step < 3) {
            showStep(step + 1)
          } else {
            globalModal.closeModal('completed')
          }
        }
      }
    ].filter(Boolean)
  })
}

showStep(1)
```

## 🔧 技术细节

### 模态框生命周期

```
showModal() 调用
    ↓
创建 DOM 容器
    ↓
创建 Vue 应用实例
    ↓
挂载模态框组件
    ↓
注册到 modalControllers
    ↓
用户交互
    ↓
close() 调用
    ↓
触发 onClose 回调
    ↓
从 modalControllers 移除
    ↓
延迟 200ms（动画时间）
    ↓
卸载 Vue 应用
    ↓
移除 DOM 容器
```

### 全局控制器管理

```javascript
// 内部使用 Set 管理所有打开的模态框
const modalControllers = new Set()

// showModal 时添加
modalControllers.add(controller)

// close 时移除
modalControllers.delete(controller)

// closeModal 关闭最后一个
const lastController = Array.from(modalControllers).pop()
lastController?.close()

// closeAllModals 关闭所有
modalControllers.forEach(c => c.close())
modalControllers.clear()
```

## 📊 关闭原因 (reason) 类型

| reason | 说明 | 触发场景 |
|--------|------|---------|
| `dismiss` | 用户主动关闭 | 点击遮罩、ESC 键 |
| `action` | 按钮操作 | 点击模态框按钮 |
| `programmatic` | 程序化关闭 | 调用 `closeModal()` |
| `confirmed` | 用户确认 | 自定义确认操作 |
| `cancelled` | 用户取消 | 自定义取消操作 |
| `timeout` | 超时关闭 | 定时器触发 |
| `error` | 错误关闭 | 异常处理 |
| `success` | 成功关闭 | 操作成功 |
| 自定义 | 自定义原因 | 业务逻辑需要 |

## ⚠️ 注意事项

1. **服务端渲染 (SSR)**
   - `useGlobalModal` 仅在浏览器环境中工作
   - 在 SSR 环境中调用会返回空操作函数

2. **内存管理**
   - 模态框关闭后会自动清理 DOM 和 Vue 实例
   - 延迟 200ms 以确保关闭动画完成

3. **多模态框管理**
   - 支持同时打开多个模态框
   - `closeModal()` 关闭最后打开的模态框（栈顶）
   - `closeAllModals()` 关闭所有模态框

4. **按钮 onClick 返回值**
   - 返回 `false` 可阻止模态框关闭
   - 返回 `Promise` 会显示加载状态
   - Promise resolve `false` 也可阻止关闭

5. **preventClose**
   - 设置为 `true` 时，用户无法通过点击遮罩或 ESC 关闭
   - 必须通过按钮或程序化调用 `close()` 关闭

## 🎨 样式自定义

```javascript
globalModal.showModal({
  title: '自定义样式',
  ui: {
    content: 'sm:max-w-2xl',  // 更大的宽度
    // ... 其他 UModal 的 ui 配置
  }
})
```

## 🔄 迁移指南

### 从旧版本迁移

**之前：**
```javascript
const controller = globalModal.showModal({ ... })
controller.close()
```

**现在：**
```javascript
// 方式 1: 仍然使用 controller（推荐用于特定模态框）
const controller = globalModal.showModal({ ... })
controller.close()

// 方式 2: 使用新的 closeModal（推荐用于最后一个模态框）
globalModal.showModal({ ... })
globalModal.closeModal()

// 方式 3: 关闭所有模态框
globalModal.closeAllModals()
```

## 📝 最佳实践

1. **使用 controller 控制特定模态框**
   ```javascript
   const loadingModal = globalModal.showModal({ title: '加载中' })
   // ... 稍后
   loadingModal.close()
   ```

2. **使用 closeModal 关闭最近的模态框**
   ```javascript
   globalModal.showModal({ title: '提示' })
   // 在组件的其他地方
   globalModal.closeModal()
   ```

3. **在组件卸载时清理**
   ```javascript
   onUnmounted(() => {
     globalModal.closeAllModals('component-unmounted')
   })
   ```

4. **处理异步操作**
   ```javascript
   globalModal.showModal({
     buttons: [{
       label: '保存',
       onClick: async () => {
         const result = await saveData()
         if (!result.success) {
           return false  // 阻止关闭
         }
         // 返回 undefined 或 true 会关闭模态框
       }
     }]
   })
   ```

## 🎉 总结

`useGlobalModal` 现在提供了更强大的模态框管理能力：

- ✅ 程序化创建模态框
- ✅ 灵活的按钮配置
- ✅ 自定义组件支持
- ✅ 多模态框管理
- ✅ **新增**: `closeModal()` 方法
- ✅ **新增**: `closeAllModals()` 方法
- ✅ 自动内存清理
- ✅ 完整的生命周期管理

