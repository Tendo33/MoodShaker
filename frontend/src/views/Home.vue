<template>
	<div class="flex-1 relative">
		<!-- Enhanced decorative elements with animation -->
		<div class="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
			<div class="absolute -top-10 -right-10 w-80 h-80 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute top-1/3 -left-10 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
			<div class="absolute -bottom-10 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 4s"></div>
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
				<h1 class="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
					找到适合您心情的鸡尾酒
				</h1>
				<p class="max-w-[700px] text-xl text-gray-300 md:text-2xl leading-relaxed">通过回答几个简单问题，让我们为您推荐完美的鸡尾酒</p>
				<router-link to="/questions" class="w-full sm:w-auto mt-10">
					<button
						class="w-full sm:w-auto px-10 py-4 text-lg font-medium bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white border-0 shadow-xl shadow-pink-500/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 group"
					>
						开始探索 <ArrowRight class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</button>
				</router-link>
				
				<!-- Added feature highlights -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
					<div class="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 text-left shadow-xl transition-transform duration-300 hover:scale-105">
						<div class="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mb-4">
							<span class="text-2xl">🧪</span>
						</div>
						<h3 class="text-xl font-bold mb-2">个性化推荐</h3>
						<p class="text-gray-300">根据您的口味偏好和心情，为您量身定制鸡尾酒推荐</p>
					</div>
					<div class="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 text-left shadow-xl transition-transform duration-300 hover:scale-105">
						<div class="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mb-4">
							<span class="text-2xl">📝</span>
						</div>
						<h3 class="text-xl font-bold mb-2">详细配方</h3>
						<p class="text-gray-300">获取完整的配料清单和制作步骤，轻松在家调制美味鸡尾酒</p>
					</div>
					<div class="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 text-left shadow-xl transition-transform duration-300 hover:scale-105">
						<div class="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mb-4">
							<span class="text-2xl">✨</span>
						</div>
						<h3 class="text-xl font-bold mb-2">创意灵感</h3>
						<p class="text-gray-300">发现新的口味组合和创意调酒技巧，提升您的调酒体验</p>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>


<script setup>
import { ArrowRight } from "lucide-vue-next";
</script>