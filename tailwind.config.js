// tailwind.config.js
module.exports = {
	darkMode: 'class', // 与 Nuxt 的 color-mode 模块配合更舒服
	content: [
		'./app/components/**/*.{vue,js,ts}',
		'./app/layouts/**/*.vue',
		'./app/pages/**/*.vue',
		'./app/plugins/**/*.{js,ts}',
		'./app/app.vue',
		'./error.vue' // Nuxt 根级错误页
	],
	theme: {
		extend: {
			height: {
				header: '72px',
				main: 'calc(100vh - 72px)'
			},
			fontSize: {
				xs: ['0.75rem', '1rem'], // 12px
				sm: ['0.875rem', '1.25rem'], // 14px
				base: ['1rem', '1.5rem'], // 16px
				lg: ['1.125rem', '1.75rem'], // 18px
				xl: ['1.25rem', '1.75rem'], // 20px
				'2xl': ['1.5rem', '2rem'], // 24px
				'3xl': ['1.875rem', '2.25rem'], // 30px
				'4xl': ['2.25rem', '2.5rem'] // 36px
			},
			boxShadow: {
				'l-white': '-10px 0 10px white',
				'l-zinc': '-10px 0 10px #18181b',
				'resume-card': '0 4px 20px rgba(0, 0, 0, 0.08)',
				'resume-card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)'
			},
			colors: {
				// 主色调 - 专业蓝色系
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a'
				},
				// 辅助色 - 温暖橙色
				accent: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#f97316',
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12'
				},
				// 中性色
				neutral: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					900: '#171717'
				},
				// 功能色
				success: {
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e'
				},
				warning: {
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b'
				},
				error: {
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444'
				},
				// 背景色
				background: {
					primary: '#ffffff',
					secondary: '#f8fafc',
					dark: '#0f172a'
				}
			},
			backdropBlur: {
				'4xl': '240px'
			},
			variants: {
				scrollbar: ['dark']
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio')
	]
}
