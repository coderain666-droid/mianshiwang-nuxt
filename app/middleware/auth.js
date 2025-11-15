export default defineNuxtRouteMiddleware((to, from) => {
	const userStore = useUserStore()
	
	if (!userStore.isLogin) {
		return navigateTo({
			path: '/login',
			query: { redirect: to.fullPath }
		})
	}
})

