<template>
	<div class="flex-1 relative">
		<!-- Enhanced decorative elements with animation -->
		<div class="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
			<div
				class="absolute -top-10 -right-10 w-80 h-80 bg-amber-500 rounded-full blur-3xl animate-pulse"
				style="animation-duration: 8s"
			></div>
			<div
				class="absolute top-1/3 -left-10 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-pulse"
				style="animation-duration: 10s; animation-delay: 2s"
			></div>
			<div
				class="absolute -bottom-10 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse"
				style="animation-duration: 12s; animation-delay: 4s"
			></div>
		</div>

		<section class="container py-16 md:py-28 lg:py-36 relative" style="margin: 0 auto">
			<div class="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center">
				<div class="inline-block mb-6 p-3 bg-white/5 backdrop-blur-sm rounded-full shadow-xl">
					<div
						class="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20"
					>
						<span class="text-3xl">🍹</span>
					</div>
				</div>
				<h1
					class="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
				>
					找到适合您心情的鸡尾酒
				</h1>
				<p class="max-w-[700px] text-xl text-gray-300 md:text-2xl leading-relaxed">
					通过回答几个简单问题，让我们为您推荐完美的鸡尾酒
				</p>

				<!-- 会话选择区域 -->
				<div class="w-full sm:w-auto mt-10 flex flex-col items-center">
					<div
						v-if="hasSavedSession"
						class="w-full mb-6 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md"
					>
						<div class="flex items-center mb-4">
							<div
								class="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mr-3"
							>
								<History class="h-5 w-5 text-amber-500" />
							</div>
							<h3 class="text-xl font-bold text-white">检测到未完成的问卷</h3>
						</div>
						<p class="text-gray-300 mb-5">您有一个未完成的鸡尾酒推荐问卷。您想继续之前的问卷还是开始一个新的？</p>
						<div class="flex flex-col sm:flex-row gap-3">
							<button
								@click="continueSession"
								class="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white rounded-full shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-105 whitespace-nowrap"
							>
								继续上次问卷
							</button>
							<button
								@click="startNewSession"
								class="flex-1 px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all duration-300 whitespace-nowrap"
							>
								开始新问卷
							</button>
						</div>
					</div>

					<!-- 如果没有保存的会话，只显示开始按钮 -->
					<button
						v-if="!hasSavedSession"
						@click="startNewSession"
						class="w-full sm:w-auto px-10 py-4 text-lg font-medium bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white border-0 shadow-xl shadow-pink-500/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 group whitespace-nowrap"
					>
						开始探索 <ArrowRight class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</button>
				</div>

				<!-- Added feature highlights -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
					<div
						class="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-left shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-white/5 hover:to-white/10"
					>
						<div
							class="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mb-4"
						>
							<span class="text-2xl">🧪</span>
						</div>
						<h3 class="text-xl font-bold mb-2 whitespace-nowrap">个性化推荐</h3>
						<p class="text-gray-300">根据您的口味偏好和心情，为您量身定制鸡尾酒推荐</p>
					</div>
					<div
						class="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-left shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-white/5 hover:to-white/10"
					>
						<div
							class="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mb-4"
						>
							<span class="text-2xl">📝</span>
						</div>
						<h3 class="text-xl font-bold mb-2 whitespace-nowrap">详细配方</h3>
						<p class="text-gray-300">获取完整的配料清单和制作步骤，轻松在家调制美味鸡尾酒</p>
					</div>
					<div
						class="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-left shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-white/5 hover:to-white/10"
					>
						<div
							class="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mb-4"
						>
							<span class="text-2xl">✨</span>
						</div>
						<h3 class="text-xl font-bold mb-2 whitespace-nowrap">创意灵感</h3>
						<p class="text-gray-300">发现新的口味组合和创意调酒技巧，提升您的调酒体验</p>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowRight, History } from "lucide-vue-next";

const router = useRouter();
const hasSavedSession = ref(false);
const savedAnswers = ref(null); // Initialize savedAnswers

onMounted(() => {
	// 检查是否有保存的会话
	if (typeof window !== "undefined") {
		savedAnswers.value = localStorage.getItem("moodshaker-answers");
		hasSavedSession.value = !!savedAnswers.value;
	}
});

// 继续上次会话
const continueSession = () => {
	router.push("/questions");
};

// 开始新会话
const startNewSession = () => {
	router.push("/questions?new=true");
};
</script>

<style scoped>
/* 确保所有按钮文字不换行 */
button {
	white-space: nowrap;
}
</style>
