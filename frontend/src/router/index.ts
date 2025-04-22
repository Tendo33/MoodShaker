import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: () => import("@/views/Home.vue"),
		meta: {
			title: "Home"
		}
	},
	{
		path: "/questions",
		name: "questions",
		component: () => import("@/views/QuestionsView.vue"),
		meta: {
			title: "Questions"
		}
	},
	{
		path: "/recommendations",
		name: "recommendations",
		component: () => import("@/views/CocktailRecommendation.vue"),
		meta: {
			title: "Recommendations"
		}
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

// 全局前置守卫
router.beforeEach((to, from, next) => {
	// 设置页面标题
	document.title = `${to.meta.title} - MoodShaker`;
	next();
});

export default router;
