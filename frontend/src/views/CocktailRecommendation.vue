<template>
	<div class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
		<!-- 背景效果 -->
		<div class="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
			<div class="absolute top-1/4 right-1/4 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
			<div class="absolute bottom-1/3 left-1/3 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
		</div>

		<div class="container py-12 relative">
			<button class="mb-8 flex items-center text-white hover:bg-white/10 px-4 py-2 rounded-md" @click="handleBack">
				<ArrowLeft class="mr-2 h-4 w-4" /> 返回首页
			</button>

			<div v-if="isLoading" class="flex items-center justify-center min-h-[50vh]">
				<div class="text-center">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
					<p class="text-gray-300">正在为您准备鸡尾酒...</p>
				</div>
			</div>

			<div v-else-if="!cocktail" class="text-center py-12">
				<h2 class="text-xl font-medium mb-2">未找到鸡尾酒推荐</h2>
				<p class="text-gray-300 mb-4">抱歉，我们无法为您生成鸡尾酒推荐</p>
				<button
					@click="handleBack"
					class="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 border-0 text-white px-6 py-2 rounded-md"
				>
					返回首页
				</button>
			</div>

			<div v-else class="transition-all duration-500 transform translate-y-0 opacity-100">
				<div v-if="userFeedback" class="mb-8 bg-white/5 backdrop-blur-sm border-0 text-white rounded-lg">
					<div class="p-6">
						<h3 class="text-lg font-bold mb-2">您的需求</h3>
						<p class="text-gray-300">{{ userFeedback }}</p>
					</div>
				</div>

				<div class="grid gap-8 md:grid-cols-2">
					<div class="transition-all duration-500 transform translate-x-0 opacity-100">
						<div class="rounded-lg overflow-hidden shadow-lg border border-white/10 relative aspect-video">
							<div
								v-if="isImageLoading"
								class="absolute inset-0 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm"
							>
								<div class="text-center">
									<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
									<p class="text-gray-300">正在生成鸡尾酒图片...</p>
								</div>
							</div>
							<img
								v-if="imageData"
								:src="`data:image/jpeg;base64,${imageData}`"
								:alt="cocktail.name"
								class="w-full h-full object-cover"
							/>
							<img
								v-else
								src="/public/logo.png?height=400&width=600"
								:alt="cocktail.name"
								class="w-full h-full object-cover opacity-50"
							/>
						</div>

						<div class="mt-6 text-center">
							<h1
								class="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent inline-block"
							>
								{{ cocktail.name }}
							</h1>
							<p v-if="cocktail.english_name" class="text-gray-400 text-lg">{{ cocktail.english_name }}</p>
						</div>
					</div>

					<div class="transition-all duration-500 transform translate-x-0 opacity-100">
						<p class="text-gray-300 mb-6 italic">{{ cocktail.description }}</p>

						<div class="mb-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg">
							<h3 class="text-lg font-medium mb-2 text-amber-400">推荐理由</h3>
							<p class="text-gray-300">{{ cocktail.match_reason }}</p>
						</div>

						<div class="flex flex-wrap gap-4 mb-6">
							<div v-if="cocktail.time_required" class="flex items-center bg-white/5 backdrop-blur-sm p-2 rounded-lg">
								<Clock class="mr-2 h-5 w-5 text-amber-500" />
								<span>{{ cocktail.time_required }}</span>
							</div>
							<div class="flex items-center bg-white/5 backdrop-blur-sm p-2 rounded-lg">
								<Beaker class="mr-2 h-5 w-5 text-pink-500" />
								<span>基酒: {{ cocktail.base_spirit }}</span>
							</div>
							<div class="flex items-center bg-white/5 backdrop-blur-sm p-2 rounded-lg">
								<Droplet class="mr-2 h-5 w-5 text-blue-500" />
								<span>酒精度: {{ cocktail.alcohol_level }}</span>
							</div>
							<div class="flex items-center bg-white/5 backdrop-blur-sm p-2 rounded-lg">
								<GlassWater class="mr-2 h-5 w-5 text-green-500" />
								<span>酒杯: {{ cocktail.serving_glass }}</span>
							</div>
						</div>

						<div class="flex flex-wrap gap-2 mb-6">
							<span
								v-for="(flavor, index) in cocktail.flavor_profiles"
								:key="index"
								class="px-3 py-1 bg-white/10 rounded-full text-sm"
							>
								{{ flavor }}
							</span>
						</div>

						<div class="mb-6 bg-white/5 backdrop-blur-sm border-0 text-white shadow-lg rounded-lg">
							<div class="p-6 bg-gradient-to-r from-amber-500/20 to-pink-500/20">
								<h3 class="text-xl font-bold mb-2">配料</h3>
								<p class="text-gray-300">准备以下材料</p>
							</div>
							<div class="p-6">
								<ul class="space-y-2">
									<li
										v-for="(ingredient, index) in cocktail.ingredients"
										:key="index"
										class="flex justify-between border-b border-white/10 pb-2"
									>
										<span>{{ ingredient.name }}</span>
										<span class="text-amber-400 font-medium">
											{{ ingredient.amount }}
											{{ ingredient.unit ? ` ${ingredient.unit}` : "" }}
										</span>
									</li>
								</ul>
							</div>
						</div>

						<div class="mb-6 bg-white/5 backdrop-blur-sm border-0 text-white shadow-lg rounded-lg">
							<div class="p-6 bg-gradient-to-r from-pink-500/20 to-amber-500/20">
								<h3 class="text-xl font-bold mb-2">工具</h3>
								<p class="text-gray-300">您需要的调酒工具</p>
							</div>
							<div class="p-6">
								<ul class="space-y-2 grid grid-cols-2 gap-2">
									<li v-for="(tool, index) in cocktail.tools" :key="index" class="bg-white/5 p-2 rounded-md">
										{{ tool.name }}
										<span v-if="tool.alternative" class="block text-sm text-gray-400"
											>替代品: {{ tool.alternative }}</span
										>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div
					v-if="cocktail"
					class="mt-8 bg-white/5 backdrop-blur-sm border-0 text-white shadow-lg rounded-lg transition-all duration-500 transform translate-y-0 opacity-100"
				>
					<div class="p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20">
						<h3 class="text-xl font-bold mb-2">制作步骤</h3>
						<p class="text-gray-300">按照以下步骤制作您的鸡尾酒</p>
					</div>
					<div class="p-6">
						<ol class="space-y-4">
							<li v-for="step in cocktail.steps" :key="step.step_number" class="flex">
								<span
									class="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg"
								>
									{{ step.step_number }}
								</span>
								<div class="flex-1 pt-1">
									<p>{{ step.description }}</p>
									<p v-if="step.tips" class="text-sm text-amber-400 mt-1 italic">提示: {{ step.tips }}</p>
								</div>
							</li>
						</ol>
					</div>
				</div>

				<div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
					<button
						@click="handleTryAgain"
						class="flex items-center bg-white/5 hover:bg-white/10 border-0 text-white px-6 py-2 rounded-md"
					>
						<RefreshCw class="mr-2 h-4 w-4" /> 重新选择
					</button>
					<button
						class="flex items-center bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 border-0 text-white shadow-lg shadow-pink-500/20 px-6 py-2 rounded-md"
					>
						<ThumbsUp class="mr-2 h-4 w-4" /> 喜欢这个推荐
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Clock, Droplet, ThumbsUp, RefreshCw, Beaker, GlassWater } from "lucide-vue-next";
import { pollForCocktailImage } from "@/api/cocktail";

// 模拟用户ID和会话ID，实际应用中应从认证系统获取
const MOCK_USER_ID = 1;
const MOCK_SESSION_ID = "session-123";

const router = useRouter();
const cocktail = ref(null);
const userFeedback = ref("");
const isLoading = ref(true);
const imageData = ref(null);
const isImageLoading = ref(true);

onMounted(() => {
	isLoading.value = true;

	// 从本地存储获取推荐结果
	if (typeof window !== "undefined") {
		const savedRecommendation = localStorage.getItem("moodshaker-recommendation");
		if (savedRecommendation) {
			cocktail.value = JSON.parse(savedRecommendation);
		}

		// 获取用户反馈
		const feedback = localStorage.getItem("moodshaker-feedback");
		if (feedback) {
			userFeedback.value = feedback;
		}
	}

	isLoading.value = false;

	// 开始轮询获取鸡尾酒图片
	if (cocktail.value) {
		// Only poll if cocktail data exists
		pollForCocktailImage(MOCK_USER_ID, MOCK_SESSION_ID, (data) => {
			imageData.value = data;
			isImageLoading.value = false;
		});
	} else {
		isImageLoading.value = false; // Ensure loading state is handled even without cocktail data
	}
});

const handleBack = () => {
	router.push("/");
};

const handleTryAgain = () => {
	// 清除本地存储的答案，重新开始问题流程
	if (typeof window !== "undefined") {
		localStorage.removeItem("moodshaker-answers");
		localStorage.removeItem("moodshaker-feedback");
		localStorage.removeItem("moodshaker-recommendation");
		localStorage.removeItem("moodshaker-base-spirits");
	}
	router.push("/questions");
};
</script>
