# SEO 完整配置指南

本文档详细说明了网站的 SEO 配置方案，包括使用方法、最佳实践和维护指南。

## 📋 目录

- [概述](#概述)
- [核心文件说明](#核心文件说明)
- [快速开始](#快速开始)
- [详细使用指南](#详细使用指南)
- [搜索引擎优化配置](#搜索引擎优化配置)
- [结构化数据](#结构化数据)
- [最佳实践](#最佳实践)
- [维护与更新](#维护与更新)
- [常见问题](#常见问题)

---

## 概述

本网站已完成全面的 SEO 优化配置，支持以下搜索引擎：

- ✅ **Google** (谷歌)
- ✅ **Bing** (必应)
- ✅ **Baidu** (百度)
- ✅ **360搜索**
- ✅ **Sogou** (搜狗)

### 主要特性

- 🎯 完整的 Meta 标签配置
- 🔍 结构化数据（JSON-LD Schema.org）
- 🗺️ 自动生成的网站地图（Sitemap）
- 🤖 搜索引擎友好的 robots.txt
- 📱 移动端优化
- 🚀 性能优化（DNS 预解析、预连接等）
- 🔄 动态 SEO 管理
- 🍞 面包屑导航
- 📊 Open Graph 和 Twitter Card 支持

---

## 核心文件说明

### 1. SEO 配置文件

| 文件路径 | 说明 |
|---------|------|
| `app/constants/seo.js` | SEO 核心配置，包含所有 SEO 相关的常量和函数 |
| `app/composables/useSEO.js` | SEO Composable，用于在页面中快速配置 SEO |
| `app/utils/seo.js` | SEO 工具函数集合 |
| `app/components/SEOBreadcrumb.vue` | 面包屑导航组件 |

### 2. 搜索引擎文件

| 文件路径 | 说明 |
|---------|------|
| `public/robots.txt` | 搜索引擎爬虫控制文件 |
| `public/sitemap.xml` | 静态网站地图 |
| `server/api/sitemap.xml.js` | 动态网站地图生成 API |

### 3. 全局配置

| 文件路径 | 说明 |
|---------|------|
| `nuxt.config.js` | Nuxt 配置文件，包含全局 SEO 设置 |

---

## 快速开始

### 1. 基础配置

首先，确保在 `app/constants/seo.js` 中配置了正确的网站信息：

```javascript
export const SEO = {
  siteUrl: 'https://mianshiwangoffer.com',
  siteName: '面试汪',
  defaultTitle: '面试汪 - AI智能面试平台',
  defaultDescription: '您的网站描述...',
  // ... 其他配置
}
```

### 2. 在页面中使用 SEO

在任何页面的 `<script setup>` 中使用 `useSEO`：

```vue
<script setup>
// 基础使用
useSEO({
  title: '页面标题',
  description: '页面描述',
  keywords: '关键词1,关键词2,关键词3'
})
</script>
```

### 3. 添加面包屑导航

```vue
<template>
  <div>
    <SEOBreadcrumb :items="breadcrumbs" />
    <!-- 页面内容 -->
  </div>
</template>

<script setup>
const breadcrumbs = [
  { name: '首页', url: '/' },
  { name: '面试历史', url: '/history' },
  { name: '面试报告' }
]

useSEO({
  title: '面试报告',
  breadcrumbs
})
</script>
```

---

## 详细使用指南

### 基础页面 SEO

最简单的使用方式：

```vue
<script setup>
useSEO({
  title: '关于我们',
  description: '了解面试汪团队和我们的使命',
  keywords: '面试汪,关于我们,团队介绍'
})
</script>
```

### 文章页面 SEO

适用于博客、新闻等内容页面：

```vue
<script setup>
useArticleSEO({
  title: '如何准备技术面试',
  description: '本文介绍了准备技术面试的 10 个关键步骤...',
  keywords: '技术面试,面试准备,面试技巧',
  author: '面试汪团队',
  publishTime: '2025-12-04T10:00:00+08:00',
  modifiedTime: '2025-12-04T15:30:00+08:00',
  image: '/images/article-cover.jpg'
})
</script>
```

### 列表页面 SEO（带分页）

```vue
<script setup>
const route = useRoute()
const page = parseInt(route.query.page || '1')

useListSEO({
  title: '面试历史记录',
  description: '查看您的所有面试记录和表现分析',
  keywords: '面试记录,面试历史,面试分析',
  page: page,
  totalPages: 10,
  baseUrl: '/history'
})
</script>
```

### 禁止搜索引擎索引

某些页面（如登录、支付等）不希望被搜索引擎索引：

```vue
<script setup>
useSEO({
  title: '登录',
  description: '登录到面试汪平台',
  noIndex: true // 禁止索引
})
</script>
```

### 自定义结构化数据

```vue
<script setup>
import { jsonLdFAQPage } from '@/constants/seo'

const faqs = [
  {
    question: '如何开始使用面试汪？',
    answer: '注册账号后，选择您的职业和岗位即可开始 AI 面试训练。'
  },
  {
    question: '面试汪支持哪些职业？',
    answer: '我们支持程序员、产品经理、设计师等多种职业。'
  }
]

useSEO({
  title: '常见问题',
  description: '面试汪常见问题解答',
  structuredData: [
    jsonLdFAQPage(faqs)
  ]
})
</script>
```

---

## 搜索引擎优化配置

### 1. Google 优化

#### 验证网站所有权

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 添加网站并获取验证码
3. 在 `app/constants/seo.js` 中配置：

```javascript
export const SEO = {
  // ...
  googleVerification: '您的Google验证码',
}
```

#### 提交 Sitemap

在 Google Search Console 中提交：
```
https://mianshiwangoffer.com/sitemap.xml
```

### 2. Bing (必应) 优化

#### 验证网站所有权

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 添加网站并获取验证码
3. 在 `app/constants/seo.js` 中配置：

```javascript
export const SEO = {
  // ...
  bingVerification: '您的Bing验证码',
}
```

### 3. Baidu (百度) 优化

#### 验证网站所有权

1. 访问 [百度搜索资源平台](https://ziyuan.baidu.com/)
2. 添加网站并获取验证码
3. 在 `app/constants/seo.js` 中配置：

```javascript
export const SEO = {
  // ...
  baiduVerification: '您的百度验证码',
}
```

#### 百度特殊配置

百度对中国网站有特殊要求：

1. **防止转码**：已在配置中添加 `no-transform` 和 `no-siteapp` meta 标签
2. **移动适配**：使用 `mobile-agent` meta 标签声明移动版本
3. **主动推送**：建议配置百度主动推送 API（需后端支持）

### 4. 360搜索 优化

#### 验证网站所有权

1. 访问 [360搜索站长平台](https://zhanzhang.so.com/)
2. 添加网站并获取验证码
3. 在 `app/constants/seo.js` 中配置：

```javascript
export const SEO = {
  // ...
  so360Verification: '您的360验证码',
}
```

---

## 结构化数据

结构化数据帮助搜索引擎更好地理解网站内容，可以获得富文本摘要（Rich Snippets）。

### 可用的结构化数据类型

#### 1. WebSite（网站）

自动在全局配置中添加，无需手动配置。

#### 2. Organization（组织）

自动在全局配置中添加，描述公司/组织信息。

#### 3. WebPage（网页）

自动为每个页面添加，使用 `useSEO` 时会自动生成。

#### 4. BreadcrumbList（面包屑）

```vue
<script setup>
import { jsonLdBreadcrumb } from '@/constants/seo'

useSEO({
  title: '面试报告',
  breadcrumbs: [
    { name: '首页', url: '/' },
    { name: '面试历史', url: '/history' },
    { name: '面试报告' }
  ]
})
// breadcrumbs 会自动生成 jsonLdBreadcrumb
</script>
```

#### 5. FAQPage（常见问题）

```vue
<script setup>
import { jsonLdFAQPage } from '@/constants/seo'

const faqs = [
  { question: '问题1', answer: '答案1' },
  { question: '问题2', answer: '答案2' }
]

useSEO({
  title: '常见问题',
  structuredData: [jsonLdFAQPage(faqs)]
})
</script>
```

#### 6. SoftwareApplication（软件应用）

```vue
<script setup>
import { jsonLdSoftwareApplication } from '@/constants/seo'

useSEO({
  title: '产品介绍',
  structuredData: [
    jsonLdSoftwareApplication({
      name: '面试汪',
      description: 'AI智能面试平台',
      offers: [
        { name: '基础版', price: 0 },
        { name: '专业版', price: 99 }
      ],
      rating: {
        value: 4.8,
        count: 1250
      }
    })
  ]
})
</script>
```

### 验证结构化数据

使用以下工具验证结构化数据是否正确：

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## 最佳实践

### 1. 标题优化

✅ **推荐做法：**
- 长度：10-60 个字符
- 包含主要关键词
- 每个页面标题唯一
- 格式：`页面标题 - 网站名称`

❌ **避免：**
- 标题过长或过短
- 堆砌关键词
- 所有页面使用相同标题

示例：
```javascript
// 好的标题
useSEO({ title: 'AI面试训练 - 提升面试能力' })

// 不好的标题
useSEO({ title: '首页' }) // 太短
useSEO({ title: '面试,AI面试,智能面试,面试训练...' }) // 关键词堆砌
```

### 2. 描述优化

✅ **推荐做法：**
- 长度：50-160 个字符
- 准确描述页面内容
- 包含 1-2 个关键词
- 吸引用户点击

❌ **避免：**
- 描述过短或过长
- 与页面内容不符
- 所有页面使用相同描述

### 3. 关键词优化

✅ **推荐做法：**
- 5-10 个相关关键词
- 包含主关键词和长尾关键词
- 用逗号分隔
- 反映页面主题

❌ **避免：**
- 关键词堆砌
- 无关关键词
- 过多关键词

### 4. 图片优化

✅ **推荐做法：**
- Open Graph 图片尺寸：1200x630 像素
- 文件大小：< 1MB
- 格式：PNG 或 JPG
- 使用有意义的文件名
- 添加 alt 属性

### 5. URL 优化

✅ **推荐做法：**
- 使用简短、描述性的 URL
- 使用连字符分隔单词
- 避免使用特殊字符
- 使用 HTTPS

示例：
```
✅ 好的 URL: /interview/programmer
❌ 不好的 URL: /page?id=123&type=interview
```

### 6. 移动端优化

网站已默认配置移动端优化：
- 响应式设计
- viewport meta 标签
- 移动优先索引支持
- 触摸友好的界面

### 7. 性能优化

影响 SEO 的性能指标：
- **Core Web Vitals**
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

优化建议：
- 使用 CDN
- 图片懒加载
- 压缩资源
- 启用缓存

---

## 维护与更新

### 定期检查清单

每月检查：
- [ ] 检查 Google Search Console 中的错误
- [ ] 检查索引覆盖率
- [ ] 更新 Sitemap
- [ ] 检查死链
- [ ] 分析搜索表现

### 更新 SEO 配置

#### 1. 修改全局 SEO 设置

编辑 `app/constants/seo.js`：

```javascript
export const SEO = {
  siteUrl: 'https://mianshiwangoffer.com',
  siteName: '新的网站名称',
  defaultTitle: '新的默认标题',
  // ... 其他配置
}
```

#### 2. 添加新页面

在新页面中使用 `useSEO`：

```vue
<script setup>
useSEO({
  title: '新页面标题',
  description: '新页面描述',
  keywords: '关键词'
})
</script>
```

#### 3. 更新 Sitemap

编辑 `server/api/sitemap.xml.js`，添加新页面：

```javascript
const pages = [
  // ... 现有页面
  {
    loc: '/new-page',
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.8,
    mobile: true
  }
]
```

#### 4. 更新预设配置

如果某个页面的 SEO 配置是固定的，可以在 `app/constants/seo.js` 的 `PAGE_SEO_CONFIG` 中添加：

```javascript
export const PAGE_SEO_CONFIG = {
  // ... 现有配置
  '/new-page': {
    title: '新页面',
    description: '新页面描述',
    keywords: '关键词'
  }
}
```

这样在页面中只需要调用 `useSEO()` 即可自动应用配置。

---

## 常见问题

### Q1: 如何查看页面的 SEO 配置？

在浏览器开发者工具中：
1. 打开 Elements / 元素 标签
2. 查看 `<head>` 标签内容
3. 检查 meta 标签、link 标签和 JSON-LD 脚本

或使用 SEO 检查工具：
- [SEO Meta Inspector](https://chrome.google.com/webstore/detail/seo-meta-in-1-click/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Q2: 修改 SEO 配置后，搜索引擎多久能看到？

- Google：通常 1-7 天
- Bing：通常 3-14 天
- Baidu：通常 7-30 天

加快索引方法：
1. 在搜索引擎站长工具中手动提交 URL
2. 使用 API 主动推送（百度、Bing 支持）
3. 增加网站更新频率

### Q3: 为什么搜索引擎显示的标题/描述与设置的不同？

搜索引擎可能会根据搜索查询自动调整显示的标题和描述。这是正常现象。

解决方法：
1. 确保标题和描述准确描述页面内容
2. 不要使用关键词堆砌
3. 提供高质量的内容

### Q4: 如何提高网站排名？

SEO 是长期工程，需要：
1. **优质内容**：提供有价值的、原创的内容
2. **技术优化**：本配置已完成技术层面优化
3. **用户体验**：提升网站速度和易用性
4. **外部链接**：获取高质量的外部链接
5. **持续更新**：定期更新内容

### Q5: 如何测试 SEO 配置？

使用以下工具：
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [百度搜索资源平台](https://ziyuan.baidu.com/)

---

## 工具函数参考

### SEO Composables

#### `useSEO(options)`
通用 SEO 配置函数

```javascript
useSEO({
  title: string,              // 页面标题
  description: string,        // 页面描述
  keywords: string,           // 关键词
  image: string,              // 分享图片
  url: string,                // 页面URL
  type: string,               // OG类型 (website/article)
  author: string,             // 作者
  noIndex: boolean,           // 是否禁止索引
  publishTime: string,        // 发布时间 (ISO 8601)
  modifiedTime: string,       // 修改时间 (ISO 8601)
  breadcrumbs: Array,         // 面包屑
  structuredData: Array,      // 结构化数据
  prevPage: string,           // 上一页URL
  nextPage: string,           // 下一页URL
  autoConfig: boolean         // 自动配置 (默认true)
})
```

#### `useSimpleSEO(title, description, keywords)`
简化版 SEO 配置

```javascript
useSimpleSEO('页面标题', '页面描述', '关键词')
```

#### `useArticleSEO(options)`
文章页面 SEO 配置

```javascript
useArticleSEO({
  title: '文章标题',
  description: '文章描述',
  author: '作者',
  publishTime: '2025-12-04T10:00:00+08:00'
})
```

#### `useListSEO(options)`
列表页面 SEO 配置（带分页）

```javascript
useListSEO({
  title: '列表标题',
  page: 2,
  totalPages: 10,
  baseUrl: '/list'
})
```

### SEO 工具函数

详见 `app/utils/seo.js`

---

## 技术支持

如有问题，请：
1. 查看本文档
2. 检查代码注释
3. 联系技术团队

---

## 更新日志

### 2025-12-04
- ✅ 完成完整 SEO 配置
- ✅ 支持 Google、Bing、Baidu、360搜索
- ✅ 添加结构化数据支持
- ✅ 创建 SEO Composables
- ✅ 添加面包屑导航组件
- ✅ 完善文档说明

---

## 参考资源

### 官方文档
- [Google Search Central](https://developers.google.com/search)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)
- [百度搜索资源平台](https://ziyuan.baidu.com/college)
- [Schema.org](https://schema.org/)

### 推荐工具
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [百度搜索资源平台](https://ziyuan.baidu.com/)
- [Ahrefs](https://ahrefs.com/)
- [SEMrush](https://www.semrush.com/)

---

**祝您的网站排名节节高升！** 🚀

