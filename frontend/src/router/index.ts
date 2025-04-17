import { createRouter, createWebHistory } from "vue-router";
import BartenderView from "@/views/bartender/index.vue";
import UserView from "@/views/user/index.vue";
import LoginView from "@/views/login/index.vue";
import RegisterView from "@/views/login/register.vue";
import { useUserStore } from "@/stores/user";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "bartender",
			component: BartenderView,
			meta: {
				title: "调酒师助手",
				requiresAuth: true
			},
		},
		{
			path: "/user",
			name: "user",
			component: UserView,
			meta: {
				title: "用户管理",
				requiresAuth: true
			},
		},
		{
			path: "/login",
			name: "login",
			component: LoginView,
			meta: {
				title: "登录",
			},
		},
		{
			path: "/register",
			name: "register",
			component: RegisterView,
			meta: {
				title: "注册",
			},
		},
		{
			path: "/:pathMatch(.*)*",
			redirect: "/"
		}
	],
});

// 路由守卫
router.beforeEach((to, from, next) => {
	const userStore = useUserStore();
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

	// 设置页面标题
	document.title = to.meta.title as string || '调酒师助手';

	if (requiresAuth && !userStore.token) {
		// 需要登录但未登录，重定向到登录页
		next({
			path: '/login',
			query: { redirect: to.fullPath }
		});
	} else if ((to.path === '/login' || to.path === '/register') && userStore.token) {
		// 已登录但访问登录页或注册页，重定向到首页
		next('/');
	} else {
		next();
	}
});

export default router;
