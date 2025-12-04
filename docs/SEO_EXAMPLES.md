# SEO 使用示例

本文档提供各种场景下的 SEO 配置示例代码。

## 目录
- [基础页面](#基础页面)
- [带面包屑的页面](#带面包屑的页面)
- [文章/博客页面](#文章博客页面)
- [列表页面（带分页）](#列表页面带分页)
- [常见问题页面](#常见问题页面)
- [产品介绍页面](#产品介绍页面)
- [禁止索引的页面](#禁止索引的页面)
- [动态页面](#动态页面)

---

## 基础页面

最简单的使用方式，适用于普通页面。

```vue
<!-- pages/about.vue -->
<template>
  <div>
    <h1>关于我们</h1>
    <p>面试汪是一个专业的 AI 面试训练平台...</p>
  </div>
</template>

<script setup>
useSEO({
  title: '关于我们',
  description: '面试汪是一个专业的 AI 面试训练平台，帮助求职者提升面试能力，快速拿到心仪offer。',
  keywords: '关于面试汪,AI面试平台,团队介绍'
})
</script>
```

---

## 带面包屑的页面

添加面包屑导航，提升用户体验和 SEO。

```vue
<!-- pages/interview/report.vue -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <SEOBreadcrumb :items="breadcrumbs" />
    
    <h1>面试报告</h1>
    <div>
      <!-- 报告内容 -->
    </div>
  </div>
</template>

<script setup>
const breadcrumbs = [
  { name: '首页', url: '/' },
  { name: '面试历史', url: '/history' },
  { name: '面试报告' } // 最后一项不需要 url
]

useSEO({
  title: '面试报告详情',
  description: '查看您的面试表现分析、得分详情和改进建议。',
  keywords: '面试报告,面试分析,面试评分',
  breadcrumbs // 自动生成结构化数据
})
</script>
```

---

## 文章/博客页面

适用于文章、新闻、博客等内容页面，包含发布时间和作者信息。

```vue
<!-- pages/blog/[slug].vue -->
<template>
  <article>
    <SEOBreadcrumb :items="breadcrumbs" />
    
    <h1>{{ article.title }}</h1>
    <div class="meta">
      <span>作者：{{ article.author }}</span>
      <span>发布时间：{{ formatDate(article.publishedAt) }}</span>
    </div>
    
    <div v-html="article.content"></div>
  </article>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

// 假设从 API 获取文章数据
const { data: article } = await useFetch(`/api/articles/${slug}`)

const breadcrumbs = [
  { name: '首页', url: '/' },
  { name: '博客', url: '/blog' },
  { name: article.value.title }
]

// 使用 useArticleSEO（适用于文章类页面）
useArticleSEO({
  title: article.value.title,
  description: article.value.excerpt || article.value.content.substring(0, 150),
  keywords: article.value.tags.join(','),
  author: article.value.author,
  publishTime: article.value.publishedAt, // ISO 8601 格式
  modifiedTime: article.value.updatedAt,
  image: article.value.coverImage,
  breadcrumbs
})
</script>
```

---

## 列表页面（带分页）

适用于有分页的列表页，自动处理分页 SEO。

```vue
<!-- pages/history.vue -->
<template>
  <div>
    <h1>面试历史记录</h1>
    
    <!-- 列表内容 -->
    <div v-for="interview in interviews" :key="interview.id">
      <!-- 面试项 -->
    </div>
    
    <!-- 分页 -->
    <div class="pagination">
      <button v-if="page > 1" @click="goToPage(page - 1)">上一页</button>
      <button v-if="page < totalPages" @click="goToPage(page + 1)">下一页</button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// 获取当前页码
const page = computed(() => parseInt(route.query.page || '1'))

// 假设从 API 获取数据
const { data: response } = await useFetch('/api/interviews', {
  query: { page }
})

const interviews = computed(() => response.value?.data || [])
const totalPages = computed(() => response.value?.totalPages || 1)

// 使用 useListSEO（自动处理分页）
useListSEO({
  title: '面试历史记录',
  description: '查看您的所有面试记录，分析面试表现，持续提升面试能力。',
  keywords: '面试记录,面试历史,面试分析,面试回顾',
  page: page.value,
  totalPages: totalPages.value,
  baseUrl: '/history'
})

const goToPage = (newPage) => {
  router.push({ path: '/history', query: { page: newPage } })
}
</script>
```

---

## 常见问题页面

使用 FAQ 结构化数据，可能获得富文本摘要。

```vue
<!-- pages/faq.vue -->
<template>
  <div>
    <h1>常见问题</h1>
    
    <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
      <h3>{{ faq.question }}</h3>
      <p>{{ faq.answer }}</p>
    </div>
  </div>
</template>

<script setup>
import { jsonLdFAQPage } from '@/constants/seo'

const faqs = [
  {
    question: '如何开始使用面试汪？',
    answer: '注册账号后，选择您的职业和岗位，即可开始 AI 智能面试训练。我们提供详细的面试反馈和改进建议。'
  },
  {
    question: '面试汪支持哪些职业？',
    answer: '我们支持程序员、产品经理、设计师、律师、医生等多种职业的面试训练。'
  },
  {
    question: '面试汪的 AI 技术有多准确？',
    answer: '我们的 AI 技术基于大量真实面试数据训练，准确率超过 90%，能够提供专业的面试评估和建议。'
  },
  {
    question: '如何获得最佳的面试训练效果？',
    answer: '建议定期进行面试训练，认真分析每次的面试报告，针对弱项进行重点练习。'
  },
  {
    question: '面试汪提供哪些服务？',
    answer: '我们提供 AI 模拟面试、面试题库、简历优化、面试技巧培训等全方位的面试服务。'
  }
]

useSEO({
  title: '常见问题',
  description: '面试汪平台常见问题解答，了解如何使用 AI 面试训练、支持的职业、服务内容等信息。',
  keywords: '常见问题,FAQ,帮助中心,使用指南,面试汪问答',
  structuredData: [
    jsonLdFAQPage(faqs) // 添加 FAQ 结构化数据
  ]
})
</script>
```

---

## 产品介绍页面

使用 SoftwareApplication 结构化数据。

```vue
<!-- pages/pricing.vue -->
<template>
  <div>
    <h1>产品定价</h1>
    
    <div class="pricing-cards">
      <div v-for="plan in plans" :key="plan.name" class="plan">
        <h3>{{ plan.name }}</h3>
        <p class="price">¥{{ plan.price }}</p>
        <ul>
          <li v-for="feature in plan.features" :key="feature">
            {{ feature }}
          </li>
        </ul>
        <button>选择方案</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { jsonLdSoftwareApplication } from '@/constants/seo'

const plans = [
  {
    name: '免费版',
    price: 0,
    features: ['基础面试训练', '每月 3 次面试机会', '基础面试报告']
  },
  {
    name: '专业版',
    price: 99,
    features: ['无限面试训练', '详细面试报告', '简历优化建议', '优先客服支持']
  },
  {
    name: '企业版',
    price: 999,
    features: ['所有专业版功能', '团队管理', '定制化面试题库', '专属客户经理']
  }
]

useSEO({
  title: '产品定价',
  description: '面试汪提供免费版、专业版和企业版三种方案，满足不同用户的面试训练需求。',
  keywords: '面试汪定价,会员价格,面试训练套餐,VIP服务',
  structuredData: [
    jsonLdSoftwareApplication({
      name: '面试汪',
      description: 'AI智能面试训练平台',
      offers: plans.map(plan => ({
        name: plan.name,
        price: plan.price
      })),
      rating: {
        value: 4.8,
        count: 1250
      }
    })
  ]
})
</script>
```

---

## 禁止索引的页面

某些页面不希望被搜索引擎索引（如登录、支付、个人信息等）。

```vue
<!-- pages/payment.vue -->
<template>
  <div>
    <h1>支付页面</h1>
    <div>
      <!-- 支付内容 -->
    </div>
  </div>
</template>

<script setup>
useSEO({
  title: '支付',
  description: '完成支付以使用面试汪服务',
  noIndex: true // 禁止搜索引擎索引
})
</script>
```

```vue
<!-- pages/login.vue -->
<template>
  <div>
    <h1>登录</h1>
    <!-- 登录表单 -->
  </div>
</template>

<script setup>
useSEO({
  title: '登录',
  description: '登录到面试汪平台',
  noIndex: true // 禁止索引
})
</script>
```

---

## 动态页面

根据路由参数动态生成 SEO 配置。

```vue
<!-- pages/category/[category].vue -->
<template>
  <div>
    <SEOBreadcrumb :items="breadcrumbs" />
    
    <h1>{{ categoryInfo.title }}</h1>
    <p>{{ categoryInfo.description }}</p>
    
    <div>
      <!-- 分类内容 -->
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const category = route.params.category

// 分类信息映射
const categoryMap = {
  programmer: {
    title: '程序员面试',
    description: '程序员面试题库和训练，包括算法、数据结构、系统设计等内容。',
    keywords: '程序员面试,编程面试,算法面试,技术面试'
  },
  'product-manager': {
    title: '产品经理面试',
    description: '产品经理面试题库和训练，包括产品设计、用户研究、数据分析等内容。',
    keywords: '产品经理面试,PM面试,产品设计,产品面试题'
  },
  designer: {
    title: '设计师面试',
    description: 'UI/UX 设计师面试题库和训练，包括设计理论、作品集展示等内容。',
    keywords: '设计师面试,UI面试,UX面试,设计面试题'
  }
}

const categoryInfo = computed(() => 
  categoryMap[category] || {
    title: '职业面试',
    description: '专业的面试训练和题库',
    keywords: '面试训练'
  }
)

const breadcrumbs = computed(() => [
  { name: '首页', url: '/' },
  { name: '面试分类', url: '/category' },
  { name: categoryInfo.value.title }
])

useSEO({
  title: categoryInfo.value.title,
  description: categoryInfo.value.description,
  keywords: categoryInfo.value.keywords,
  breadcrumbs: breadcrumbs.value
})
</script>
```

---

## 完整示例：复杂页面

综合使用多种 SEO 功能。

```vue
<!-- pages/interview/[id]/report.vue -->
<template>
  <div class="interview-report">
    <!-- 面包屑导航 -->
    <SEOBreadcrumb :items="breadcrumbs" />
    
    <!-- 标题 -->
    <h1>{{ report.title }}</h1>
    
    <!-- 元信息 -->
    <div class="meta">
      <span>职位：{{ report.position }}</span>
      <span>时间：{{ formatDate(report.completedAt) }}</span>
      <span>得分：{{ report.score }}</span>
    </div>
    
    <!-- 报告内容 -->
    <div class="report-content">
      <section>
        <h2>表现概览</h2>
        <!-- 内容 -->
      </section>
      
      <section>
        <h2>详细分析</h2>
        <!-- 内容 -->
      </section>
      
      <section>
        <h2>改进建议</h2>
        <!-- 内容 -->
      </section>
    </div>
    
    <!-- 分享按钮 -->
    <div class="share-buttons">
      <button @click="share('weibo')">分享到微博</button>
      <button @click="share('wechat')">分享到微信</button>
    </div>
  </div>
</template>

<script setup>
import { generateShareLinks } from '@/utils/seo'

const route = useRoute()
const reportId = route.params.id

// 获取报告数据
const { data: report } = await useFetch(`/api/reports/${reportId}`)

// 面包屑
const breadcrumbs = [
  { name: '首页', url: '/' },
  { name: '面试历史', url: '/history' },
  { name: `${report.value.position}面试报告` }
]

// 生成分享链接
const shareLinks = computed(() => 
  generateShareLinks({
    url: `/interview/${reportId}/report`,
    title: `我的${report.value.position}面试得分${report.value.score}分 - 面试汪`,
    description: `查看我在面试汪的面试报告，得分${report.value.score}分！`,
    image: report.value.shareImage || undefined
  })
)

// SEO 配置
useArticleSEO({
  title: `${report.value.position}面试报告`,
  description: `${report.value.position}面试详细分析报告，得分${report.value.score}分，包含表现分析和改进建议。`,
  keywords: `${report.value.position}面试,面试报告,面试分析,面试得分`,
  author: '面试汪 AI',
  publishTime: report.value.completedAt,
  image: report.value.shareImage,
  breadcrumbs,
  // 自定义 Open Graph 标签（用于社交分享）
  type: 'article'
})

const share = (platform) => {
  const url = shareLinks.value[platform]
  if (platform === 'wechat') {
    // 显示二维码
    showQRCode(url)
  } else {
    window.open(url, '_blank', 'width=600,height=400')
  }
}
</script>
```

---

## 使用 SEO 工具函数

```vue
<script setup>
import { 
  generateBreadcrumbs,
  checkSEOHealth,
  generateShareLinks 
} from '@/utils/seo'

const route = useRoute()

// 自动生成面包屑
const breadcrumbs = generateBreadcrumbs(route)

// 检查 SEO 健康度（开发环境）
if (process.dev) {
  const seoConfig = {
    title: '页面标题',
    description: '页面描述',
    keywords: '关键词'
  }
  
  const health = checkSEOHealth(seoConfig)
  console.log('SEO健康度:', health.score)
  console.log('问题:', health.issues)
}

// 生成分享链接
const shareLinks = generateShareLinks({
  url: route.path,
  title: '分享标题',
  description: '分享描述'
})
</script>
```

---

## 调试 SEO

在开发环境中查看 SEO 配置：

```vue
<script setup>
// 使用 useSEO 并获取返回值
const seoInfo = useSEO({
  title: '测试页面',
  description: '测试描述'
})

// 在控制台查看 SEO 配置
console.log('SEO配置:', seoInfo)
// 输出：
// {
//   title: '测试页面 - 面试汪',
//   description: '测试描述',
//   url: 'https://mianshiwangoffer.com/test',
//   config: { ... } // 完整的 head 配置
// }
</script>
```

---

## 最佳实践总结

1. **每个页面都应该配置 SEO**
   ```vue
   <script setup>
   useSEO({ title: '...', description: '...', keywords: '...' })
   </script>
   ```

2. **重要页面添加面包屑**
   ```vue
   <SEOBreadcrumb :items="breadcrumbs" />
   ```

3. **内容页面添加结构化数据**
   ```vue
   useSEO({ structuredData: [jsonLdFAQPage(faqs)] })
   ```

4. **列表页面使用 useListSEO**
   ```vue
   useListSEO({ page, totalPages, baseUrl })
   ```

5. **私密页面禁止索引**
   ```vue
   useSEO({ noIndex: true })
   ```

---

## 下一步

- 阅读 [SEO_GUIDE.md](./SEO_GUIDE.md) 了解详细配置
- 在 [Google Search Console](https://search.google.com/search-console) 验证网站
- 使用 [Lighthouse](https://developers.google.com/web/tools/lighthouse) 测试 SEO 得分
- 定期检查和更新 SEO 配置

---

**祝您的网站获得更好的搜索排名！** 🎉

