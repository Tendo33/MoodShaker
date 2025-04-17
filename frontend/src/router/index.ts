import { createRouter, createWebHistory } from "vue-router";
import BartenderView from "@/views/bartender/index.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			redirect: "/bartender"
		},
		{
			path: "/bartender",
			name: "bartender",
			component: BartenderView,
			meta: {
				title: "调酒师助手",
			},
		},
		{
			path: "/:pathMatch(.*)*",
			redirect: "/bartender"
		}
	],
});

export default router;
