import { createRouter, createWebHistory } from "vue-router";
import BartenderView from "@/views/bartender/index.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "bartender",
			component: BartenderView,
			meta: {
				title: "调酒师助手",
			},
		},
		{
			path: "/:pathMatch(.*)*",
			redirect: "/"
		}
	],
});

export default router;
