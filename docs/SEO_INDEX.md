# SEO 配置索引

快速查找 SEO 相关文件和功能。

## 📑 文档索引

| 文档 | 用途 | 适合人群 | 阅读时间 |
|------|------|----------|----------|
| **[SEO_README.md](./SEO_README.md)** | 快速总览和入门 | 所有人 | 3-5 分钟 |
| **[SEO_EXAMPLES.md](./SEO_EXAMPLES.md)** | 代码使用示例 | 开发者 | 5-10 分钟 |
| **[SEO_GUIDE.md](./SEO_GUIDE.md)** | 完整详细指南 | SEO 管理员 | 30-60 分钟 |
| **[SEO_CHECKLIST.md](./SEO_CHECKLIST.md)** | 配置检查清单 | 运维人员 | 15-30 分钟 |

## 🗂️ 核心文件索引

### 配置文件

| 文件 | 路径 | 说明 | 主要功能 |
|------|------|------|----------|
| **SEO 核心配置** | `app/constants/seo.js` | 所有 SEO 配置的中心 | 配置网站基本信息、Meta 标签、结构化数据生成器 |
| **Nuxt 配置** | `nuxt.config.js` | 全局 SEO 设置 | 设置默认 Meta、结构化数据、主题 |
| **Robots.txt** | `public/robots.txt` | 爬虫控制文件 | 控制搜索引擎爬取行为 |
| **Sitemap** | `public/sitemap.xml` | 静态网站地图 | 列出网站所有页面 |

### Composables

| 文件 | 路径 | 主要函数 | 用途 |
|------|------|----------|------|
| **SEO Composable** | `app/composables/useSEO.js` | `useSEO()` | 通用 SEO 配置 |
| | | `useSimpleSEO()` | 简化版 SEO 配置 |
| | | `useArticleSEO()` | 文章页面 SEO |
| | | `useListSEO()` | 列表页面 SEO（带分页）|
| | | `useSEOInfo()` | 获取当前 SEO 信息 |

### 组件

| 组件 | 路径 | Props | 说明 |
|------|------|-------|------|
| **面包屑导航** | `app/components/SEOBreadcrumb.vue` | `items`, `separator`, `showHome` | SEO 友好的面包屑组件，自动生成结构化数据 |

### 工具函数

| 文件 | 路径 | 主要函数 |
|------|------|----------|
| **SEO 工具** | `app/utils/seo.js` | 12+ 个工具函数 |

<details>
<summary>展开查看所有工具函数</summary>

- `createStructuredDataScript()` - 创建结构化数据脚本
- `getCurrentPageUrl()` - 获取当前页面完整 URL
- `getPaginationUrl()` - 生成分页 URL
- `extractKeywords()` - 从文本提取关键词
- `isExternalLink()` - 判断是否外部链接
- `getExternalLinkRel()` - 获取外部链接 rel 属性
- `generateShareLinks()` - 生成社交分享链接
- `generateOGImage()` - 生成 OG 图片
- `checkSEOHealth()` - SEO 健康检查
- `formatDateForSchema()` - 格式化日期为 Schema 格式
- `generateBreadcrumbs()` - 自动生成面包屑
- `preloadResources()` - 预加载资源
- `generateCanonicalUrl()` - 生成规范链接
- `getPageType()` - 获取页面类型

</details>

### API

| API | 路径 | 访问 URL | 说明 |
|-----|------|----------|------|
| **动态 Sitemap** | `server/api/sitemap.xml.js` | `/api/sitemap.xml` | 自动生成和更新网站地图 |

## 🎯 快速查找

### 我想...

#### 配置网站基本信息
📍 编辑：`app/constants/seo.js`
```javascript
export const SEO = {
  siteUrl: 'https://mianshiwangoffer.com',
  siteName: '面试汪',
  defaultTitle: '...',
  // ...
}
```

#### 在页面中使用 SEO
📍 在页面中：
```vue
<script setup>
useSEO({
  title: '页面标题',
  description: '页面描述',
  keywords: '关键词'
})
</script>
```
📖 参考：[SEO_EXAMPLES.md](./SEO_EXAMPLES.md)

#### 添加面包屑导航
📍 在模板中：
```vue
<template>
  <SEOBreadcrumb :items="breadcrumbs" />
</template>

<script setup>
const breadcrumbs = [
  { name: '首页', url: '/' },
  { name: '当前页' }
]
</script>
```
📖 参考：[SEO_EXAMPLES.md#带面包屑的页面](./SEO_EXAMPLES.md#带面包屑的页面)

#### 添加结构化数据
📍 使用预设函数：
```vue
<script setup>
import { jsonLdFAQPage } from '@/constants/seo'

useSEO({
  structuredData: [
    jsonLdFAQPage([
      { question: '问题', answer: '答案' }
    ])
  ]
})
</script>
```
📖 参考：[SEO_GUIDE.md#结构化数据](./SEO_GUIDE.md#结构化数据)

#### 配置搜索引擎验证
📍 编辑：`app/constants/seo.js`
```javascript
export const SEO = {
  // ...
  googleVerification: 'Google验证码',
  bingVerification: 'Bing验证码',
  baiduVerification: '百度验证码',
  so360Verification: '360验证码',
}
```
📖 参考：[SEO_CHECKLIST.md#搜索引擎验证](./SEO_CHECKLIST.md#搜索引擎验证)

#### 更新 Sitemap
📍 方式1: 编辑静态文件 `public/sitemap.xml`
📍 方式2: 编辑动态 API `server/api/sitemap.xml.js`
```javascript
const pages = [
  // 添加新页面
  {
    loc: '/new-page',
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.8
  }
]
```
📖 参考：[SEO_GUIDE.md#维护与更新](./SEO_GUIDE.md#维护与更新)

#### 更新 Robots.txt
📍 编辑：`public/robots.txt`
```txt
User-agent: *
Allow: /
Disallow: /private/

Sitemap: https://mianshiwangoffer.com/sitemap.xml
```

#### 检查 SEO 配置是否完整
📖 使用：[SEO_CHECKLIST.md](./SEO_CHECKLIST.md)

#### 学习如何使用（代码示例）
📖 查看：[SEO_EXAMPLES.md](./SEO_EXAMPLES.md)

#### 深入了解 SEO 最佳实践
📖 阅读：[SEO_GUIDE.md](./SEO_GUIDE.md)

## 🔧 常用代码片段

### 基础页面 SEO
```vue
<script setup>
useSEO({
  title: '页面标题',
  description: '页面描述（50-160字符）',
  keywords: '关键词1,关键词2,关键词3'
})
</script>
```

### 带面包屑的页面
```vue
<template>
  <SEOBreadcrumb :items="breadcrumbs" />
  <!-- 页面内容 -->
</template>

<script setup>
const breadcrumbs = [
  { name: '首页', url: '/' },
  { name: '父级', url: '/parent' },
  { name: '当前页' }
]

useSEO({
  title: '当前页标题',
  description: '描述',
  breadcrumbs
})
</script>
```

### FAQ 页面
```vue
<script setup>
import { jsonLdFAQPage } from '@/constants/seo'

const faqs = [
  { question: '问题1', answer: '答案1' },
  { question: '问题2', answer: '答案2' }
]

useSEO({
  title: '常见问题',
  description: 'FAQ',
  structuredData: [jsonLdFAQPage(faqs)]
})
</script>
```

### 列表页（带分页）
```vue
<script setup>
const route = useRoute()
const page = parseInt(route.query.page || '1')

useListSEO({
  title: '列表页',
  description: '描述',
  page: page,
  totalPages: 10,
  baseUrl: '/list'
})
</script>
```

### 禁止索引的页面
```vue
<script setup>
useSEO({
  title: '登录',
  description: '登录页面',
  noIndex: true // 禁止搜索引擎索引
})
</script>
```

## 🧪 测试和验证

### 本地测试
```bash
npm run dev
# 访问 http://localhost:3000
# F12 查看 <head> 标签
```

### 线上验证（部署后）

| 测试项 | 工具 | URL |
|--------|------|-----|
| SEO 评分 | PageSpeed Insights | https://pagespeed.web.dev/ |
| 结构化数据 | Rich Results Test | https://search.google.com/test/rich-results |
| Open Graph | Facebook Debugger | https://developers.facebook.com/tools/debug/ |
| Sitemap | 直接访问 | https://mianshiwangoffer.com/sitemap.xml |
| Robots | 直接访问 | https://mianshiwangoffer.com/robots.txt |

## 📚 外部资源

### 搜索引擎站长平台

| 搜索引擎 | 站长工具 | 用途 |
|----------|----------|------|
| Google | [Search Console](https://search.google.com/search-console) | 网站验证、索引管理、数据分析 |
| Bing | [Webmaster Tools](https://www.bing.com/webmasters) | 网站验证、Sitemap 提交 |
| Baidu | [搜索资源平台](https://ziyuan.baidu.com/) | 网站验证、主动推送、数据统计 |
| 360 | [站长平台](https://zhanzhang.so.com/) | 网站验证、Sitemap 提交 |

### 学习资源

| 资源 | 链接 |
|------|------|
| Google SEO 入门指南 | https://developers.google.com/search/docs/beginner/seo-starter-guide |
| Schema.org | https://schema.org/ |
| Moz SEO 指南 | https://moz.com/beginners-guide-to-seo |
| 百度搜索学院 | https://ziyuan.baidu.com/college |

## 🎯 功能特性速查

| 特性 | 支持 | 位置 |
|------|------|------|
| Meta 标签 | ✅ | `nuxt.config.js` + `useSEO` |
| Open Graph | ✅ | `nuxt.config.js` + `useSEO` |
| Twitter Card | ✅ | `nuxt.config.js` + `useSEO` |
| 结构化数据 | ✅ | `app/constants/seo.js` |
| Sitemap | ✅ | `public/sitemap.xml` + `server/api/sitemap.xml.js` |
| Robots.txt | ✅ | `public/robots.txt` |
| 面包屑导航 | ✅ | `app/components/SEOBreadcrumb.vue` |
| Canonical URL | ✅ | `useSEO` |
| 分页支持 | ✅ | `useListSEO` |
| 多语言 | ⏳ | 可扩展 |
| AMP | ❌ | 未实现 |

## 📊 代码统计

```
SEO 配置总计:
├── 核心文件: 6 个
├── 文档文件: 5 个
├── Composables: 4 个函数
├── 工具函数: 12+ 个
├── 结构化数据类型: 6 种
├── Meta 标签: 30+ 个
└── 代码总行数: 2000+ 行
```

## 🔄 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2025-12-04 | 1.0.0 | 完成完整 SEO 配置系统 |

## 📞 需要帮助？

1. 📖 查看文档（见上方文档索引）
2. 💻 查看代码注释（所有代码都有详细注释）
3. 🔍 使用搜索引擎（Google: "Nuxt SEO"）
4. 👥 联系技术团队

---

**快速导航**
- [📚 查看完整指南](./SEO_GUIDE.md)
- [💡 查看代码示例](./SEO_EXAMPLES.md)
- [✅ 使用配置清单](./SEO_CHECKLIST.md)
- [🎯 回到总览](./SEO_README.md)

---

_更新时间: 2025-12-04_

