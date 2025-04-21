import { createRouter, createWebHistory } from "vue-router";
import GuideQuestions from "@/views/GuideQuestions.vue";
import CocktailResult from "@/views/CocktailResult.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "Home",
			component: GuideQuestions,
		},
		{
			path: "/result",
			name: "CocktailResult",
			component: CocktailResult,
		},
	],
});

export default router;
