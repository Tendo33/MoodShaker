import { createRouter, createWebHistory } from "vue-router";
import BartenderView from "@/views/bartender/index.vue";
import UserView from "@/views/user/index.vue";
import LoginView from "@/views/login/index.vue";
import RegisterView from "@/views/login/register.vue";
import ProfileView from "@/views/user/profile.vue";
import ChangePasswordView from "@/views/user/change-password.vue";
import { useUserStore } from "@/stores/user";
import MainLayout from '../components/layout/MainLayout.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'

const routes = [
	{
		path: "/",
		component: MainLayout,
		children: [
			{
				path: "",
				redirect: "/chat"
			},
			{
				path: "chat",
				component: ChatWindow,
				meta: {
					requiresAuth: true
				}
			}
		]
	},
	{
		path: "/bartender",
		name: "bartender",
		component: BartenderView,
		meta: {
			title: "MoodShaker",
			requiresAuth: false
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
		path: "/profile",
		name: "profile",
		component: ProfileView,
		meta: {
			title: "个人信息",
			requiresAuth: true
		},
	},
	{
		path: "/change-password",
		name: "changePassword",
		component: ChangePasswordView,
		meta: {
			title: "修改密码",
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
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
	const userStore = useUserStore();
	const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

	// 设置页面标题
	document.title = to.meta.title as string || 'MoodShaker';

	if (requiresAuth && !isAuthenticated) {
		// 需要登录但未登录，重定向到登录页
		next('/');
	} else if ((to.path === '/login' || to.path === '/register') && !isAuthenticated) {
		// 已登录但访问登录页或注册页，重定向到首页
		next('/');
	} else {
		next();
	}
});

export default router;
