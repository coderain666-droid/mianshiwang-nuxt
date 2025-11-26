// nuxt.config.ts
import * as path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defineNuxtConfig } from 'nuxt/config'
import { SEO, jsonLdWebsite, jsonLdOrganization } from './app/constants/seo'

const useLightningCSS = true

export default defineNuxtConfig({
	// 源码目录
	srcDir: 'app',

	// 兼容性日期（用于 Nitro/平台兼容提示）
	compatibilityDate: '2025-11-11',

	// 开发服务器：绑定到 0.0.0.0 以便局域网访问
	devServer: {
		host: '0.0.0.0'
	},

	// 站点基础信息由 app/constants/seo.ts 统一管理

	// —— 全局 <head> ——（精简且规范）
	app: {
		head: {
			title: SEO.defaultTitle,
			htmlAttrs: { lang: 'zh-CN' },
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'description', content: SEO.defaultDescription },
				{ name: 'keywords', content: SEO.defaultKeywords },
				{ name: 'robots', content: 'index,follow' },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: SEO.defaultTitle },
				{ property: 'og:description', content: SEO.defaultDescription },
				{ property: 'og:url', content: SEO.siteUrl },
				{ property: 'og:image', content: SEO.ogImage },
				{ property: 'og:locale', content: 'zh_CN' },
				{ name: 'twitter:card', content: SEO.twitterCard },
				{ name: 'twitter:title', content: SEO.defaultTitle },
				{ name: 'twitter:description', content: SEO.defaultDescription },
				{ name: 'twitter:image', content: SEO.ogImage },
				{ name: 'application-name', content: '面试汪' },
				{ name: 'apple-mobile-web-app-title', content: '面试汪' }
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'canonical', href: SEO.siteUrl }
			],
			script: [
				{
					type: 'application/ld+json',
					innerHTML: JSON.stringify(jsonLdWebsite(SEO))
				},
				{
					type: 'application/ld+json',
					innerHTML: JSON.stringify(jsonLdOrganization(SEO))
				}
			]
		}
	},

	// —— 路由级规则（模板仅预渲染首页）——
	routeRules: {
		'/': { prerender: true },
		// 忽略 API 路径，避免被 Vue Router 处理
		'/dev-api/**': { ssr: false, index: false }
	},

	// —— 模块（保留基础依赖）——
	modules: [
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'@nuxt/devtools',
		['@nuxt/ui', { fonts: false }]
	],
	colorMode: {
		classSuffix: '', // 如果你想去掉默认的类后缀（如 dark 会变为 dark-mode）
		preference: 'light', // 默认根据系统的颜色模式，值为 'light', 'dark' 或 'system'
		fallback: 'light', // 如果浏览器不支持 color-mode，则默认为 light 模式
		storageKey: 'nuxt-color-mode', // 存储在本地存储中的 key 名
		watch: ['colorMode.preference'] // 监听 colorMode.preference 的变化
	},

	// —— 资源与样式 ——（注意不要让 body/html 首帧 opacity: 0）
	css: ['~/assets/css/style.css'],

	// 别名
	alias: { '@': path.resolve(__dirname, './app') },

	runtimeConfig: {
		public: {
			appVersion: process.env.npm_package_version,
			buildTime: new Date().toISOString(),
			apiBase: process.env.VITE_API_BASE_URL || '/dev-api',
			resumePreviewUrl:
				process.env.VITE_RESUME_PREVIEW_URL || 'https://www.lgdsunday.club/'
		}
	},

	nitro: {
		devProxy: {
			// '/dev-api/': {
			// 	target: 'https://test.api.lgdsunday.club',
			// 	changeOrigin: true,
			// 	rewrite: (p) => p.replace(/^\/dev-api/, '')
			// }
			'/dev-api/': {
				target: 'http://localhost:8888',
				changeOrigin: true,
				rewrite: (p) => p.replace(/^\/dev-api/, '')
			}
		}
	},

	// —— Vite 构建优化（精简） ——
	vite: {
		plugins: [
			createSvgIconsPlugin({
				iconDirs: [path.resolve(process.cwd(), 'app/assets/icons')],
				symbolId: 'icon-[name]'
			})
		],
		esbuild: { drop: ['console', 'debugger'] },
		resolve: {
			alias: { '@': path.resolve(__dirname, './app') }
		},
		optimizeDeps: { include: ['vue', 'vue-router', 'pinia'] },
		build: {
			minify: 'esbuild',
			cssMinify: useLightningCSS ? 'lightningcss' : 'esbuild',
			target: 'esnext',
			modulePreload: { polyfill: false },
			sourcemap: false,
			assetsInlineLimit: 2048,
			cssCodeSplit: true,
			chunkSizeWarningLimit: 700
		},
		define: {
			__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
			__BUILD_TIME__: JSON.stringify(new Date().toISOString())
		}
	}
})
