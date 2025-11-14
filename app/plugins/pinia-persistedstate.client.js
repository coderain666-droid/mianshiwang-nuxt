import { defineNuxtPlugin } from '#imports'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.$pinia.use(piniaPluginPersistedstate)
})
