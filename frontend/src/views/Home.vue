<template>
	<div class="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
		<header class="sticky top-0 z-10 border-b border-gray-800 bg-black/80 backdrop-blur">
			<div class="container flex h-16 items-center justify-between">
				<div class="font-bold text-xl bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
					MoodShaker
				</div>
			</div>
		</header>
		<main class="flex-1 relative">
			<!-- Decorative elements -->
			<div class="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
				<div class="absolute -top-10 -right-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
				<div class="absolute top-1/3 -left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl"></div>
				<div class="absolute -bottom-10 right-1/4 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
			</div>

			<section class="container py-12 md:py-24 lg:py-32 relative">
				<div class="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
					<div class="inline-block mb-4 p-2 bg-white/5 backdrop-blur-sm rounded-full">
						<div
							class="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center"
						>
							<span class="text-2xl">🍹</span>
						</div>
					</div>
					<h1 class="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
						找到适合您心情的鸡尾酒
					</h1>
					<p class="max-w-[700px] text-lg text-gray-300 md:text-xl">通过回答几个简单问题，让我们为您推荐完美的鸡尾酒</p>
					<router-link to="/questions" class="w-full sm:w-auto mt-8">
						<button
							class="w-full sm:w-auto px-8 py-3 text-base font-medium bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-pink-500/30 rounded-md flex items-center justify-center"
						>
							开始探索 <ArrowRight class="ml-2 h-4 w-4" />
						</button>
					</router-link>
				</div>
			</section>
		</main>
	</div>
</template>

<script setup>
import { ArrowRight } from "lucide-vue-next";
</script>
