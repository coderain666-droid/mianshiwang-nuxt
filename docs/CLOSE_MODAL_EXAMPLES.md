# closeModal() 使用示例

## 📋 快速开始

### 基本用法

```javascript
import { useGlobalModal } from '@/composables/useGlobalModal'

const globalModal = useGlobalModal()

// 显示模态框
globalModal.showModal({
  title: '提示',
  content: '这是一个提示信息'
})

// 在某个时机关闭
globalModal.closeModal()
```

## 🎯 实际应用场景

### 场景 1: 面试确认弹窗（当前项目实际使用）

**之前的代码：**
```javascript
// resume.vue
onMounted(() => {
  const controller = globalModal.showModal({
    title: '准备开始简历押题',
    contentComponent: SpecialInterviewConfirm,
    contentProps: {
      onConfirm: () => {
        controller.close()  // ❌ 需要保存 controller 引用
      }
    }
  })
})
```

**现在的代码：**
```javascript
// resume.vue
onMounted(() => {
  globalModal.showModal({
    title: '准备开始简历押题',
    contentComponent: SpecialInterviewConfirm,
    contentProps: {
      onConfirm: () => {
        globalModal.closeModal()  // ✅ 直接调用，无需保存引用
        startInterview()
      }
    },
    buttons: [],
    preventClose: true
  })
})
```

### 场景 2: 加载提示框

```javascript
const showLoadingModal = () => {
  globalModal.showModal({
    title: '处理中',
    content: '请稍候...',
    buttons: [],
    preventClose: true
  })
}

const processData = async () => {
  showLoadingModal()
  
  try {
    await api.process()
    globalModal.closeModal('success')
    toast.add({ title: '处理成功' })
  } catch (error) {
    globalModal.closeModal('error')
    toast.add({ title: '处理失败', color: 'red' })
  }
}
```

### 场景 3: 定时自动关闭

```javascript
const showNotification = (message) => {
  globalModal.showModal({
    title: '通知',
    content: message,
    buttons: []
  })
  
  // 3 秒后自动关闭
  setTimeout(() => {
    globalModal.closeModal('timeout')
  }, 3000)
}
```

### 场景 4: 表单提交后关闭

```javascript
const showEditForm = (userId) => {
  globalModal.showModal({
    title: '编辑用户',
    contentComponent: UserEditForm,
    contentProps: {
      userId,
      onSubmit: async (formData) => {
        try {
          await api.updateUser(userId, formData)
          globalModal.closeModal('submitted')
          toast.add({ title: '保存成功' })
          refreshUserList()
        } catch (error) {
          toast.add({ title: '保存失败', color: 'red' })
          // 不关闭模态框，让用户重试
        }
      }
    },
    buttons: []
  })
}
```

### 场景 5: 多步骤流程

```javascript
const startWizard = () => {
  let currentStep = 1
  
  const showStep = (step) => {
    if (step > 1) {
      globalModal.closeModal('next-step')
    }
    
    globalModal.showModal({
      title: `步骤 ${step}/3`,
      contentComponent: getStepComponent(step),
      contentProps: {
        onNext: () => {
          if (step < 3) {
            showStep(step + 1)
          } else {
            globalModal.closeModal('completed')
            handleWizardComplete()
          }
        },
        onBack: () => {
          if (step > 1) {
            showStep(step - 1)
          }
        }
      },
      buttons: []
    })
  }
  
  showStep(1)
}
```

### 场景 6: 条件性关闭

```javascript
const showConfirmDialog = () => {
  globalModal.showModal({
    title: '确认操作',
    content: '此操作不可撤销，确定继续吗？',
    buttons: [
      {
        label: '取消',
        variant: 'outline',
        onClick: () => {
          globalModal.closeModal('cancelled')
        }
      },
      {
        label: '确认',
        color: 'red',
        onClick: async () => {
          const result = await performDangerousOperation()
          if (result.success) {
            globalModal.closeModal('confirmed')
            toast.add({ title: '操作成功' })
          } else {
            // 不关闭，显示错误
            toast.add({ 
              title: '操作失败', 
              description: result.error,
              color: 'red' 
            })
          }
        }
      }
    ]
  })
}
```

### 场景 7: 组件内使用

```vue
<template>
  <div>
    <UButton @click="showSettings">打开设置</UButton>
  </div>
</template>

<script setup>
import { useGlobalModal } from '@/composables/useGlobalModal'
import SettingsPanel from './SettingsPanel.vue'

const globalModal = useGlobalModal()

const showSettings = () => {
  globalModal.showModal({
    title: '设置',
    contentComponent: SettingsPanel,
    contentProps: {
      onSave: (settings) => {
        saveSettings(settings)
        globalModal.closeModal('saved')
      },
      onCancel: () => {
        globalModal.closeModal('cancelled')
      }
    },
    buttons: []
  })
}
</script>
```

### 场景 8: 错误处理

```javascript
const uploadFile = async (file) => {
  globalModal.showModal({
    title: '上传中',
    content: '正在上传文件，请稍候...',
    buttons: [],
    preventClose: true
  })
  
  try {
    const result = await api.upload(file)
    globalModal.closeModal('success')
    
    // 显示成功消息
    globalModal.showModal({
      title: '上传成功',
      content: `文件 ${file.name} 已成功上传`,
      buttons: [
        {
          label: '确定',
          onClick: () => globalModal.closeModal('acknowledged')
        }
      ]
    })
  } catch (error) {
    globalModal.closeModal('error')
    
    // 显示错误消息
    globalModal.showModal({
      title: '上传失败',
      content: error.message,
      buttons: [
        {
          label: '重试',
          onClick: () => {
            globalModal.closeModal('retry')
            uploadFile(file)
          }
        },
        {
          label: '取消',
          variant: 'outline',
          onClick: () => globalModal.closeModal('cancelled')
        }
      ]
    })
  }
}
```

## 🔄 closeModal vs controller.close

### 使用 controller.close（适用于特定模态框）

```javascript
// 当你需要精确控制某个特定模态框时
const loadingModal = globalModal.showModal({
  title: '加载中'
})

const warningModal = globalModal.showModal({
  title: '警告'
})

// 只关闭加载模态框
loadingModal.close()

// 警告模态框仍然保持打开
```

### 使用 closeModal（适用于最后一个模态框）

```javascript
// 当你只关心最后打开的模态框时
globalModal.showModal({ title: '提示 1' })
globalModal.showModal({ title: '提示 2' })
globalModal.showModal({ title: '提示 3' })

// 关闭"提示 3"
globalModal.closeModal()

// 关闭"提示 2"
globalModal.closeModal()

// 关闭"提示 1"
globalModal.closeModal()
```

### 使用 closeAllModals（关闭所有）

```javascript
// 打开多个模态框
globalModal.showModal({ title: '提示 1' })
globalModal.showModal({ title: '提示 2' })
globalModal.showModal({ title: '提示 3' })

// 一次性全部关闭
globalModal.closeAllModals('cleanup')
```

## 📊 对比表

| 方法 | 使用场景 | 优点 | 缺点 |
|------|---------|------|------|
| `controller.close()` | 需要精确控制特定模态框 | 精确控制 | 需要保存引用 |
| `closeModal()` | 关闭最后一个模态框 | 简单方便，无需保存引用 | 只能关闭最后一个 |
| `closeAllModals()` | 清理所有模态框 | 一次性清理 | 无法选择性关闭 |

## ✅ 最佳实践

1. **在自定义组件的回调中使用 `closeModal()`**
   ```javascript
   contentProps: {
     onConfirm: () => {
       globalModal.closeModal('confirmed')
       handleConfirm()
     }
   }
   ```

2. **在异步操作中使用 `closeModal()`**
   ```javascript
   try {
     await someAsyncOperation()
     globalModal.closeModal('success')
   } catch (error) {
     globalModal.closeModal('error')
   }
   ```

3. **在组件卸载时清理**
   ```javascript
   onUnmounted(() => {
     globalModal.closeAllModals('component-unmounted')
   })
   ```

4. **使用有意义的 reason**
   ```javascript
   globalModal.closeModal('user-confirmed')
   globalModal.closeModal('timeout')
   globalModal.closeModal('validation-failed')
   ```

## 🎉 总结

新增的 `closeModal()` 方法让模态框管理更加简单：

- ✅ 无需保存 controller 引用
- ✅ 代码更简洁
- ✅ 适合大多数使用场景
- ✅ 支持传递关闭原因
- ✅ 与 `closeAllModals()` 配合使用更强大

