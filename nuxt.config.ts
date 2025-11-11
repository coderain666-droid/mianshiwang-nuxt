// nuxt.config.ts
import * as path from 'path'
import { defineNuxtConfig } from 'nuxt/config'

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


	// —— 站点基础信息（模板占位）——
	site: {
		url: 'http://localhost:3000',
		name: '面试汪',
		description: '一个精简的 Nuxt 3 项目基础框架'
	},

	// —— 全局 <head> ——（精简且规范）
	app: {
		head: {
			title: '面试汪',
			htmlAttrs: { lang: 'zh-CN' },
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'description', content: '基于 Nuxt 3 的基础项目模板' }
			],
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
		}
	},

	// —— 路由级规则（模板仅预渲染首页）——
	routeRules: {
		'/': { prerender: true }
	},

	// —— 模块（保留基础依赖）——
	modules: ['@pinia/nuxt', '@nuxt/devtools', ['@nuxt/ui', { fonts: false }]],

	// —— 模板不内置 sitemap/robots ——

	// —— 不加载业务插件 ——
	plugins: [],

	// —— 资源与样式 ——（注意不要让 body/html 首帧 opacity: 0）
	css: ['~/assets/css/style.css'],

	// 别名
	alias: { '@': path.resolve(__dirname, './app') },

	runtimeConfig: {
		public: {
			appVersion: process.env.npm_package_version,
			buildTime: new Date().toISOString(),
			apiBase: process.env.VITE_API_BASE_URL || '/dev-api'
		}
	},

	// —— 模板不包含本地代理与额外预渲染 ——
	nitro: {},

	// —— Vite 构建优化（精简） ——
	vite: {
		plugins: [],
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
