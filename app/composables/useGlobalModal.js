import { computed, createApp, defineComponent, h, onMounted, ref } from 'vue'
import { UModal, UButton, UIcon } from '#components'

const buildFallbackButtons = (options = {}) => {
	if (Array.isArray(options.buttons)) {
		return options.buttons
	}

	return []
}

const createContainer = () => {
	const container = document.createElement('div')
	document.body.appendChild(container)
	return container
}

const destroyContainer = (container, app) => {
	if (!container) return
	// 延迟 200 ms ，保证动画
	setTimeout(() => {
		if (app) {
			app.unmount()
		}
		container.remove()
	}, 200)
}

const ModalHost = defineComponent({
	name: 'ProgrammaticModalHost',
	props: {
		options: {
			type: Object,
			required: true
		},
		onResolve: {
			type: Function,
			required: true
		},
		onReady: {
			type: Function,
			default: null
		}
	},
	setup(props) {
		const open = ref(true)
		const loadingIndex = ref(null)
		const closed = ref(false)

		const modalUi = computed(() => ({
			content: 'max-w-[560px]',
			...(props.options.ui || {})
		}))

		const buttons = computed(() => buildFallbackButtons(props.options))

		const close = (reason = 'dismiss') => {
			if (closed.value) return
			closed.value = true
			open.value = false
			props.onResolve(reason)
		}

		const handleUpdateOpen = (value) => {
			if (!value) {
				close('dismiss')
			}
		}

		const handleButtonClick = async (button, index) => {
			if (!button || button.disabled) return
			if (loadingIndex.value !== null && loadingIndex.value !== index) return

			let shouldClose = button.closeOnClick ?? true

			try {
				const result = button.onClick ? button.onClick() : undefined
				if (result && typeof result.then === 'function') {
					loadingIndex.value = index
					const resolved = await result
					if (resolved === false) {
						shouldClose = false
					}
				} else if (result === false) {
					shouldClose = false
				}
			} catch (error) {
				console.error('Modal button execution failed:', error)
				shouldClose = false
			} finally {
				if (loadingIndex.value === index) {
					loadingIndex.value = null
				}
			}

			if (shouldClose) {
				close(button.reason || 'action')
			}
		}

		onMounted(() => {
			props.onReady?.({
				close: (reason = 'programmatic') => close(reason)
			})
		})

		return () => {
			return h(
				UModal,
				{
					open: open.value,
					title: props.options.title,
					description: props.options.description,
					'onUpdate:open': handleUpdateOpen,
					preventClose: props.options.preventClose ?? false,
					ui: modalUi.value
				},
				{
					body: () =>
						h('div', { class: '' }, [
							props.options.contentComponent
								? h(
										props.options.contentComponent,
										props.options.contentProps || {}
								  )
								: props.options.content
								? h(
										'div',
										{
											class:
												'text-sm text-neutral-600 leading-relaxed whitespace-pre-line'
										},
										props.options.content
								  )
								: null,
							buttons.value.length
								? h(
										'div',
										{
											class:
												'flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4'
										},
										buttons.value.map((button, index) =>
											h(
												UButton,
												{
													key:
														button.key ?? `${button.label || 'btn'}-${index}`,
													color: button.color || 'primary',
													variant: button.variant || 'solid',
													size: button.size || 'md',
													block: button.block ?? false,
													class: ['w-full', 'sm:w-auto', button.class || ''],
													loading: loadingIndex.value === index,
													disabled:
														button.disabled ||
														(loadingIndex.value !== null &&
															loadingIndex.value !== index),
													onClick: () => handleButtonClick(button, index)
												},
												() =>
													h(
														'span',
														{
															class:
																'inline-flex items-center justify-center gap-2'
														},
														[
															button.icon
																? h(UIcon, {
																		name: button.icon,
																		class: 'w-4 h-4'
																  })
																: null,
															h('span', null, button.label || '确认')
														]
													)
											)
										)
								  )
								: null
						])
				}
			)
		}
	}
})

// 全局模态框控制器管理
const modalControllers = new Set()

export const useGlobalModal = () => {
	const showModal = (options = {}) => {
		if (typeof window === 'undefined' || typeof document === 'undefined') {
			console.warn(
				'[useGlobalModal] Modal rendering is only available in the browser.'
			)
			return { close: () => {} }
		}

		const container = createContainer()
		let app = null

		let controller = {
			close: () => {}
		}

		const handleResolve = (reason) => {
			options.onClose?.(reason)
			modalControllers.delete(controller)
			destroyContainer(container, app)
		}

		const vnode = h(ModalHost, {
			options,
			onResolve: handleResolve,
			onReady: (api) => {
				controller = api
				modalControllers.add(controller)
			}
		})

		// 创建 Vue 应用实例并挂载
		app = createApp(vnode)

		// 获取当前 Nuxt 应用实例，复用其插件和配置
		const nuxtApp = window?.__NUXT__?.vueApp
		if (nuxtApp) {
			// 复制全局属性和配置
			app.config.globalProperties = { ...nuxtApp.config.globalProperties }
			// 如果有全局组件，也复制过来
			Object.entries(nuxtApp._context.components || {}).forEach(
				([name, component]) => {
					app.component(name, component)
				}
			)
		}

		app.mount(container)

		return controller
	}

	/**
	 * 关闭最后一个打开的模态框
	 * @param {string} reason - 关闭原因，默认为 'programmatic'
	 */
	const closeModal = (reason = 'programmatic') => {
		if (modalControllers.size === 0) {
			console.warn('[useGlobalModal] No modal to close.')
			return
		}

		// 获取最后一个打开的模态框（Set 的最后一个元素）
		const controllers = Array.from(modalControllers)
		const lastController = controllers[controllers.length - 1]
		lastController?.close(reason)
	}

	/**
	 * 关闭所有打开的模态框
	 * @param {string} reason - 关闭原因，默认为 'programmatic'
	 */
	const closeAllModals = (reason = 'programmatic') => {
		modalControllers.forEach((controller) => {
			controller?.close(reason)
		})
		modalControllers.clear()
	}

	return {
		showModal,
		closeModal,
		closeAllModals
	}
}
