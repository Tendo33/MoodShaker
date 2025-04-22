<template>
	<div class="min-h-screen transition-colors duration-300" :class="themeClasses">
		<!-- Enhanced background effects -->
		<div class="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
			<div class="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
			<div
				class="absolute bottom-1/3 left-1/3 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-pulse"
				style="animation-delay: 1.5s"
			></div>
			<div
				class="absolute top-2/3 right-1/3 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"
				style="animation-delay: 3s"
			></div>
		</div>

		<div class="container py-12 relative">
			<button
				class="mb-8 flex items-center hover:bg-white/10 px-4 py-2 rounded-md transition-colors duration-300 group"
				:class="textColorClass"
				@click="handleBack"
			>
				<ArrowLeft class="mr-2 h-4 w-4 group-hover:translate-x-[-4px] transition-transform" /> 返回首页
			</button>

			<div v-if="isLoading" class="flex items-center justify-center min-h-[50vh]">
				<div class="text-center">
					<div class="relative w-16 h-16 mx-auto mb-4">
						<div class="absolute inset-0 rounded-full border-4 border-amber-500/20"></div>
						<div
							class="absolute inset-0 rounded-full border-4 border-b-amber-500 border-r-pink-500 border-t-transparent border-l-transparent animate-spin"
						></div>
					</div>
					<p class="text-gray-300 font-medium">正在为您准备鸡尾酒...</p>
				</div>
			</div>

			<div v-else-if="!cocktail" class="text-center py-12 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl">
				<h2 class="text-2xl font-medium mb-4" :class="textColorClass">未找到鸡尾酒推荐</h2>
				<p class="text-gray-300 mb-6">抱歉，我们无法为您生成鸡尾酒推荐</p>
				<button
					@click="handleBack"
					class="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 border-0 text-white px-8 py-3 rounded-lg shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-105"
				>
					返回首页
				</button>
			</div>

			<div v-else class="transition-all duration-500 transform translate-y-0 opacity-100">
				<div
					v-if="userFeedback"
					class="mb-8 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl transition-colors duration-300"
					:class="cardClasses"
				>
					<div class="p-6 bg-gradient-to-r from-amber-500/10 to-pink-500/10">
						<h3 class="text-lg font-bold mb-2" :class="textColorClass">您的需求</h3>
						<p class="text-gray-300">{{ userFeedback }}</p>
					</div>
				</div>

				<div class="grid gap-10 md:grid-cols-2">
					<div class="transition-all duration-500 transform translate-x-0 opacity-100">
						<div
							class="rounded-xl overflow-hidden shadow-2xl border transition-colors duration-300 group"
							:class="[borderClasses, 'relative aspect-video']"
						>
							<div
								v-if="isImageLoading"
								class="absolute inset-0 flex items-center justify-center backdrop-blur-sm transition-colors duration-300"
								:class="loadingOverlayClasses"
							>
								<div class="text-center">
									<div class="relative w-12 h-12 mx-auto mb-4">
										<div class="absolute inset-0 rounded-full border-4 border-amber-500/20"></div>
										<div
											class="absolute inset-0 rounded-full border-4 border-b-amber-500 border-r-pink-500 border-t-transparent border-l-transparent animate-spin"
										></div>
									</div>
									<p class="text-gray-300 font-medium">正在生成鸡尾酒图片...</p>
								</div>
							</div>
							<img
								v-if="imageData"
								:src="`data:image/jpeg;base64,${imageData}`"
								:alt="cocktail.name"
								class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>
							<img
								v-else
								src="/public/logo.png?height=400&width=600"
								:alt="cocktail.name"
								class="w-full h-full object-cover opacity-50"
							/>
						</div>

						<div class="mt-8 text-center">
							<h1
								class="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent inline-block"
							>
								{{ cocktail.name }}
							</h1>
							<p v-if="cocktail.english_name" class="text-gray-400 text-lg">{{ cocktail.english_name }}</p>
						</div>
					</div>

					<div class="transition-all duration-500 transform translate-x-0 opacity-100">
						<p class="text-gray-300 mb-6 italic text-lg leading-relaxed">{{ cocktail.description }}</p>

						<div
							class="mb-6 p-5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl transition-colors duration-300"
							:class="cardClasses"
						>
							<h3 class="text-lg font-medium mb-3 text-amber-400">推荐理由</h3>
							<p class="text-gray-300 leading-relaxed">{{ cocktail.match_reason }}</p>
						</div>

						<div class="flex flex-wrap gap-4 mb-6">
							<div
								v-if="cocktail.time_required"
								class="flex items-center backdrop-blur-sm p-3 rounded-lg border border-white/10 transition-colors duration-300 hover:bg-white/5"
								:class="cardClasses"
							>
								<Clock class="mr-2 h-5 w-5 text-amber-500" />
								<span :class="textColorClass">{{ cocktail.time_required }}</span>
							</div>
							<div
								class="flex items-center backdrop-blur-sm p-3 rounded-lg border border-white/10 transition-colors duration-300 hover:bg-white/5"
								:class="cardClasses"
							>
								<Beaker class="mr-2 h-5 w-5 text-pink-500" />
								<span :class="textColorClass">基酒: {{ cocktail.base_spirit }}</span>
							</div>
							<div
								class="flex items-center backdrop-blur-sm p-3 rounded-lg border border-white/10 transition-colors duration-300 hover:bg-white/5"
								:class="cardClasses"
							>
								<Droplet class="mr-2 h-5 w-5 text-blue-500" />
								<span :class="textColorClass">酒精度: {{ cocktail.alcohol_level }}</span>
							</div>
							<div
								class="flex items-center backdrop-blur-sm p-3 rounded-lg border border-white/10 transition-colors duration-300 hover:bg-white/5"
								:class="cardClasses"
							>
								<GlassWater class="mr-2 h-5 w-5 text-green-500" />
								<span :class="textColorClass">酒杯: {{ cocktail.serving_glass }}</span>
							</div>
						</div>

						<div class="flex flex-wrap gap-2 mb-6">
							<span
								v-for="(flavor, index) in cocktail.flavor_profiles"
								:key="index"
								class="px-4 py-2 backdrop-blur-sm rounded-full text-sm border border-white/10 transition-colors duration-300 hover:bg-white/5"
								:class="tagClasses"
							>
								{{ flavor }}
							</span>
						</div>

						<div
							class="mb-6 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl overflow-hidden transition-colors duration-300"
							:class="cardClasses"
						>
							<div class="p-6 bg-gradient-to-r from-amber-500/20 to-pink-500/20">
								<h3 class="text-xl font-bold mb-2" :class="textColorClass">配料</h3>
								<p class="text-gray-300">准备以下材料</p>
							</div>
							<div class="p-6">
								<ul class="space-y-3">
									<li
										v-for="(ingredient, index) in cocktail.ingredients"
										:key="index"
										class="flex justify-between py-2 border-b transition-colors duration-300"
										:class="borderColorClass"
									>
										<span :class="textColorClass" class="font-medium">{{ ingredient.name }}</span>
										<span class="text-amber-400 font-medium">
											{{ ingredient.amount }}
											{{ ingredient.unit ? ` ${ingredient.unit}` : "" }}
										</span>
									</li>
								</ul>
							</div>
						</div>

						<div
							class="mb-6 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl overflow-hidden transition-colors duration-300"
							:class="cardClasses"
						>
							<div class="p-6 bg-gradient-to-r from-pink-500/20 to-amber-500/20">
								<h3 class="text-xl font-bold mb-2" :class="textColorClass">工具</h3>
								<p class="text-gray-300">您需要的调酒工具</p>
							</div>
							<div class="p-6">
								<ul class="grid grid-cols-2 gap-3">
									<li
										v-for="(tool, index) in cocktail.tools"
										:key="index"
										class="backdrop-blur-sm p-3 rounded-lg border border-white/10 transition-colors duration-300 hover:bg-white/5"
										:class="toolCardClasses"
									>
										<span :class="textColorClass" class="font-medium">{{ tool.name }}</span>
										<span v-if="tool.alternative" class="block text-sm text-gray-400 mt-1"
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
					class="mt-10 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl overflow-hidden transition-colors duration-300"
					:class="cardClasses"
				>
					<div class="p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20">
						<h3 class="text-xl font-bold mb-2" :class="textColorClass">制作步骤</h3>
						<p class="text-gray-300">按照以下步骤制作您的鸡尾酒</p>
					</div>
					<div class="p-6">
						<ol class="space-y-6">
							<li v-for="step in cocktail.steps" :key="step.step_number" class="flex">
								<span
									class="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg"
								>
									{{ step.step_number }}
								</span>
								<div class="flex-1 pt-1">
									<p :class="textColorClass" class="text-lg">{{ step.description }}</p>
									<p v-if="step.tips" class="text-sm text-amber-400 mt-2 italic">提示: {{ step.tips }}</p>
								</div>
							</li>
						</ol>
					</div>
				</div>

				<div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
					<button
						@click="handleTryAgain"
						class="flex items-center backdrop-blur-sm hover:bg-white/10 border border-white/20 rounded-lg transition-all duration-300 group"
						:class="[textColorClass, buttonClasses, 'px-6 py-3']"
					>
						<RefreshCw class="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" /> 重新选择
					</button>
					<button
						class="flex items-center bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 border-0 text-white shadow-lg shadow-pink-500/20 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
					>
						<ThumbsUp class="mr-2 h-5 w-5" /> 喜欢这个推荐
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Clock, Droplet, ThumbsUp, RefreshCw, Beaker, GlassWater } from "lucide-vue-next";
import { pollForCocktailImage } from "@/api/cocktail";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

// 主题相关计算属性
const themeClasses = computed(() => ({
	"bg-gradient-to-b from-black to-gray-900 text-white": theme.value === "dark",
	"bg-gradient-to-b from-amber-50 to-white text-gray-900": theme.value === "light",
}));

const textColorClass = computed(() => ({
	"text-white": theme.value === "dark",
	"text-gray-900": theme.value === "light",
}));

const cardClasses = computed(() => ({
	"bg-white/10 text-white": theme.value === "dark",
	"bg-white/80 text-gray-900": theme.value === "light",
}));

const borderClasses = computed(() => ({
	"border-white/10": theme.value === "dark",
	"border-gray-200": theme.value === "light",
}));

const loadingOverlayClasses = computed(() => ({
	"bg-gray-800/50": theme.value === "dark",
	"bg-white/50": theme.value === "light",
}));

const tagClasses = computed(() => ({
	"bg-white/10 text-white": theme.value === "dark",
	"bg-white/90 text-gray-900": theme.value === "light",
}));

const toolCardClasses = computed(() => ({
	"bg-white/5 text-white": theme.value === "dark",
	"bg-white/90 text-gray-900": theme.value === "light",
}));

const buttonClasses = computed(() => ({
	"bg-white/5": theme.value === "dark",
	"bg-white/90": theme.value === "light",
}));

const borderColorClass = computed(() => ({
	"border-white/10": theme.value === "dark",
	"border-gray-200": theme.value === "light",
}));

// 模拟用户ID和会话ID，实际应用中应从认证系统获取
const MOCK_USER_ID = 1;
const MOCK_SESSION_ID = "session-123";

const router = useRouter();
const cocktail = ref(null);
const userFeedback = ref("");
const isLoading = ref(true);
const imageData = ref(null);
const isImageLoading = ref(true);

// Initialize imageData and isImageLoading to null and true respectively
// to avoid conditional hook calls.
onMounted(() => {
	isLoading.value = true;
	imageData.value = null;
	isImageLoading.value = true;

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
