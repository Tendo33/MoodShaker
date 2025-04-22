import { createRouter, createWebHistory } from "vue-router";
import QuestionsView from "@/views/QuestionsView.vue";

import HomeView from '@/views/Home.vue'

import CocktailRecommendationView from '@/views/CocktailRecommendation.vue'

const routes = [
	{
		path: "/",
		component: HomeView
	},
	{
		path: "/questions",
		name: "questions",
		component: QuestionsView
	},
	{
		path: "/recommendations",
		name: "recommendationss",
		component: CocktailRecommendationView
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;
