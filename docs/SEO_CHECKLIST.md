# SEO 配置检查清单

快速检查和配置 SEO 的所有必要步骤。

## ✅ 立即配置（必需）

### 1. 更新基础信息
打开 `app/constants/seo.js`，更新以下内容：

- [ ] `siteUrl`: 确认为 `https://mianshiwangoffer.com`
- [ ] `siteName`: 确认网站名称
- [ ] `defaultTitle`: 优化默认标题
- [ ] `defaultDescription`: 优化默认描述
- [ ] `defaultKeywords`: 添加核心关键词
- [ ] `contactEmail`: 添加联系邮箱
- [ ] `companyName`: 添加公司名称（如有）

### 2. 验证文件更新
确认以下文件已正确更新：

- [ ] `public/robots.txt` - 使用正确的域名
- [ ] `public/sitemap.xml` - 使用正确的域名和日期
- [ ] `nuxt.config.js` - 集成了完整的 SEO 配置

### 3. 测试本地配置
```bash
# 启动开发服务器
npm run dev

# 访问以下页面，检查 head 标签
# 1. http://localhost:3000/
# 2. http://localhost:3000/interview
# 3. http://localhost:3000/history
```

在浏览器开发者工具中检查：
- [ ] `<title>` 标签正确
- [ ] `<meta name="description">` 存在
- [ ] `<meta name="keywords">` 存在
- [ ] `<meta property="og:...">` Open Graph 标签存在
- [ ] `<script type="application/ld+json">` 结构化数据存在
- [ ] `<link rel="canonical">` 规范链接正确

---

## 🔍 搜索引擎验证（部署后）

### Google (谷歌)

1. **注册 Google Search Console**
   - [ ] 访问 https://search.google.com/search-console
   - [ ] 添加网站：`https://mianshiwangoffer.com`
   - [ ] 获取 HTML 标签验证码：`<meta name="google-site-verification" content="xxx">`
   - [ ] 在 `app/constants/seo.js` 中更新 `googleVerification`

2. **提交 Sitemap**
   - [ ] 在 Search Console 中提交：`https://mianshiwangoffer.com/sitemap.xml`

3. **检查索引状态**
   - [ ] 等待 1-3 天，检查网站是否被索引
   - [ ] 使用 Google 搜索：`site:mianshiwangoffer.com`

### Bing (必应)

1. **注册 Bing Webmaster Tools**
   - [ ] 访问 https://www.bing.com/webmasters
   - [ ] 添加网站：`https://mianshiwangoffer.com`
   - [ ] 获取验证码：`<meta name="msvalidate.01" content="xxx">`
   - [ ] 在 `app/constants/seo.js` 中更新 `bingVerification`

2. **提交 Sitemap**
   - [ ] 在 Webmaster Tools 中提交：`https://mianshiwangoffer.com/sitemap.xml`

3. **检查索引状态**
   - [ ] 等待 3-7 天，检查网站是否被索引
   - [ ] 使用 Bing 搜索：`site:mianshiwangoffer.com`

### Baidu (百度)

1. **注册百度搜索资源平台**
   - [ ] 访问 https://ziyuan.baidu.com/
   - [ ] 添加网站：`https://mianshiwangoffer.com`
   - [ ] 获取验证码：`<meta name="baidu-site-verification" content="xxx">`
   - [ ] 在 `app/constants/seo.js` 中更新 `baiduVerification`

2. **提交 Sitemap**
   - [ ] 在资源平台中提交：`https://mianshiwangoffer.com/sitemap.xml`

3. **配置百度统计（可选）**
   - [ ] 访问 https://tongji.baidu.com/
   - [ ] 创建站点，获取统计代码
   - [ ] 在 `app/constants/seo.js` 中更新 `baiduSiteId`

4. **主动推送（推荐）**
   - [ ] 在百度搜索资源平台获取推送接口
   - [ ] 配置自动推送（需后端支持）

5. **检查索引状态**
   - [ ] 等待 7-14 天，检查网站是否被索引
   - [ ] 使用百度搜索：`site:mianshiwangoffer.com`

### 360搜索

1. **注册360搜索站长平台**
   - [ ] 访问 https://zhanzhang.so.com/
   - [ ] 添加网站：`https://mianshiwangoffer.com`
   - [ ] 获取验证码：`<meta name="360-site-verification" content="xxx">`
   - [ ] 在 `app/constants/seo.js` 中更新 `so360Verification`

2. **提交 Sitemap**
   - [ ] 在站长平台中提交：`https://mianshiwangoffer.com/sitemap.xml`

3. **检查索引状态**
   - [ ] 等待 7-14 天，检查网站是否被索引
   - [ ] 使用 360 搜索：`site:mianshiwangoffer.com`

---

## 📊 测试和验证工具

### SEO 基础检查

- [ ] **Google PageSpeed Insights**
  - 访问 https://pagespeed.web.dev/
  - 输入：`https://mianshiwangoffer.com`
  - 检查 Performance 和 SEO 评分（目标：90+）

- [ ] **Lighthouse**
  - 打开 Chrome 开发者工具
  - 运行 Lighthouse 报告
  - 检查 SEO 评分（目标：95+）

- [ ] **Mobile-Friendly Test**
  - 访问 https://search.google.com/test/mobile-friendly
  - 测试移动端适配

### 结构化数据验证

- [ ] **Google Rich Results Test**
  - 访问 https://search.google.com/test/rich-results
  - 测试结构化数据是否正确

- [ ] **Schema.org Validator**
  - 访问 https://validator.schema.org/
  - 验证 JSON-LD 格式

### Open Graph 检查

- [ ] **Facebook Sharing Debugger**
  - 访问 https://developers.facebook.com/tools/debug/
  - 检查 Open Graph 标签

- [ ] **Twitter Card Validator**
  - 访问 https://cards-dev.twitter.com/validator
  - 检查 Twitter Card 配置

### Robots.txt 验证

- [ ] **Google Robots Testing Tool**
  - 在 Google Search Console 中测试 robots.txt

- [ ] **手动访问**
  - 访问 https://mianshiwangoffer.com/robots.txt
  - 确认内容正确

### Sitemap 验证

- [ ] **手动访问**
  - 访问 https://mianshiwangoffer.com/sitemap.xml
  - 确认格式正确，包含所有页面

- [ ] **XML Sitemap Validator**
  - 访问 https://www.xml-sitemaps.com/validate-xml-sitemap.html
  - 验证 sitemap 格式

---

## 🚀 性能优化检查

### Core Web Vitals
使用 PageSpeed Insights 检查：

- [ ] **LCP** (Largest Contentful Paint) < 2.5s
- [ ] **FID** (First Input Delay) < 100ms
- [ ] **CLS** (Cumulative Layout Shift) < 0.1

### 图片优化

- [ ] 所有图片使用 WebP 格式（或 AVIF）
- [ ] 添加图片 `alt` 属性
- [ ] 使用懒加载（`loading="lazy"`）
- [ ] Open Graph 图片尺寸：1200x630px

### 资源优化

- [ ] 启用 Gzip/Brotli 压缩
- [ ] 配置浏览器缓存
- [ ] 使用 CDN（如果可能）
- [ ] 压缩 CSS 和 JavaScript

---

## 📝 页面 SEO 检查

为每个重要页面检查：

### 首页 (/)
- [ ] 标题唯一且吸引人
- [ ] 描述准确（50-160 字符）
- [ ] 包含主要关键词
- [ ] H1 标签存在且唯一
- [ ] 内容质量高

### 开始面试 (/interview)
- [ ] 使用 `useSEO` 配置
- [ ] 标题包含关键词
- [ ] 描述清晰
- [ ] 面包屑导航（如适用）

### 面试历史 (/history)
- [ ] 使用 `useSEO` 配置
- [ ] 如有分页，使用 `useListSEO`
- [ ] 添加 `rel="prev"` 和 `rel="next"`

### 个人中心 (/profile)
- [ ] 配置 `noIndex: true`（私密页面）

### 常见问题 (/faq)
- [ ] 使用 `jsonLdFAQPage` 结构化数据
- [ ] 问题格式化为 H2 或 H3

### 联系我们 (/contact)
- [ ] 包含联系方式
- [ ] 添加公司地址（如适用）
- [ ] 考虑添加 LocalBusiness 结构化数据

---

## 🔄 定期维护（每月）

### 检查搜索引擎状态
- [ ] Google Search Console - 检查错误和警告
- [ ] Bing Webmaster Tools - 检查索引状态
- [ ] 百度搜索资源平台 - 查看抓取情况
- [ ] 360站长平台 - 检查收录情况

### 更新内容
- [ ] 更新 Sitemap（如有新页面）
- [ ] 检查死链（404 页面）
- [ ] 更新过时内容
- [ ] 添加新的关键词

### 分析数据
- [ ] 查看搜索流量趋势
- [ ] 分析热门关键词
- [ ] 检查页面排名
- [ ] 分析用户行为

### 技术检查
- [ ] 检查网站速度
- [ ] 检查移动端体验
- [ ] 检查 HTTPS 证书（有效期）
- [ ] 检查结构化数据

---

## 📈 高级优化（可选）

### 内容营销
- [ ] 创建博客/文章（如适用）
- [ ] 定期更新内容
- [ ] 内部链接优化
- [ ] 外部链接建设

### 社交媒体
- [ ] 创建社交媒体账号
- [ ] 定期分享内容
- [ ] 在 `app/constants/seo.js` 中添加社交媒体链接

### 本地 SEO（如适用）
- [ ] 注册 Google My Business
- [ ] 添加 LocalBusiness 结构化数据
- [ ] 在本地目录中注册

### 国际化（如适用）
- [ ] 添加多语言支持
- [ ] 配置 hreflang 标签
- [ ] 为不同地区优化内容

---

## 🆘 问题排查

### 网站未被索引？
1. 检查 robots.txt 是否允许抓取
2. 在搜索引擎站长工具中手动提交
3. 检查是否有 `noindex` meta 标签
4. 确认网站可访问（无登录墙）

### 搜索排名低？
1. 检查页面加载速度
2. 优化内容质量
3. 增加内部和外部链接
4. 提升用户体验
5. 持续更新内容

### 结构化数据不显示？
1. 使用 Rich Results Test 验证
2. 检查 JSON-LD 格式
3. 等待搜索引擎重新抓取（可能需要数周）

### Open Graph 图片不显示？
1. 确认图片 URL 是绝对路径
2. 图片尺寸建议：1200x630px
3. 文件大小 < 1MB
4. 使用 Facebook Debugger 刷新缓存

---

## 📚 参考资源

### 官方文档
- [Google Search Central](https://developers.google.com/search)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help)
- [百度搜索资源平台](https://ziyuan.baidu.com/college)
- [Schema.org](https://schema.org/)

### 工具
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [百度搜索资源平台](https://ziyuan.baidu.com/)
- [360站长平台](https://zhanzhang.so.com/)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/)

### 学习资源
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [百度搜索学院](https://ziyuan.baidu.com/college)

---

## ✨ 完成状态

当你完成所有检查项后：

- [ ] 所有必需配置已完成
- [ ] 网站在主要搜索引擎中已验证
- [ ] Sitemap 已提交
- [ ] SEO 评分 > 90
- [ ] 所有页面都有适当的 SEO 配置
- [ ] 结构化数据验证通过
- [ ] 性能优化完成

**恭喜！您的网站 SEO 配置已完成！** 🎉

---

## 📞 需要帮助？

如遇问题，请参考：
1. [SEO_GUIDE.md](./SEO_GUIDE.md) - 详细使用指南
2. [SEO_EXAMPLES.md](./SEO_EXAMPLES.md) - 代码示例
3. 项目代码注释
4. 联系技术团队

---

**记住：SEO 是一个持续的过程，需要耐心和坚持。祝您成功！** 🚀

