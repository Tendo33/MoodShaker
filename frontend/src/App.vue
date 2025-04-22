<template>
	<div class="min-h-screen transition-colors duration-300" :class="themeClasses">
		<header
			class="sticky top-0 z-10 border-b backdrop-blur-lg transition-colors duration-300 shadow-md"
			:class="headerClasses"
		>
			<div class="container flex h-16 items-center justify-between">
				<router-link
					to="/"
					class="font-bold text-xl bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent transition-transform hover:scale-105"
				>
					{{ $t("MoodShaker") }}
				</router-link>
				<div class="flex items-center gap-4">
					<LanguageSelector />
					<ThemeToggle />
				</div>
			</div>
		</header>

		<ErrorAlert :message="errorStore.message" @close="errorStore.clearError()" />

		<main class="flex-1 relative">
			<router-view v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</main>

		<!-- Added footer -->
		<footer class="border-t transition-colors duration-300 py-8" :class="footerClasses">
			<div class="container">
				<div class="flex flex-col md:flex-row justify-between items-center">
					<div class="mb-4 md:mb-0">
						<div class="font-bold text-lg bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
							MoodShaker
						</div>
						<p class="text-sm text-gray-400 mt-1">找到适合您心情的鸡尾酒</p>
					</div>
					<div class="flex space-x-6">
						<a href="#" class="text-gray-400 hover:text-amber-500 transition-colors">关于我们</a>
						<a href="#" class="text-gray-400 hover:text-amber-500 transition-colors">联系方式</a>
						<a href="#" class="text-gray-400 hover:text-amber-500 transition-colors">隐私政策</a>
					</div>
				</div>
				<div class="mt-6 pt-6 border-t text-center text-sm text-gray-400" :class="borderColorClass">
					© 2024 MoodShaker. 保留所有权利。
				</div>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/stores/theme";
import { useErrorStore } from "@/stores/error";
import ThemeToggle from "@/components/ThemeToggle.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";
import ErrorAlert from "@/components/ErrorAlert.vue";

const themeStore = useThemeStore();
const errorStore = useErrorStore();
const { theme } = storeToRefs(themeStore);

// 计算属性：主题相关样式
const themeClasses = computed(() => {
	const darkTheme = theme.value === "dark";
	return {
		"bg-gradient-to-b from-black to-gray-900 text-white": darkTheme,
		"bg-gradient-to-b from-amber-50 to-white text-gray-900": !darkTheme,
	};
});

// 计算属性：头部样式
const headerClasses = computed(() => {
	const darkTheme = theme.value === "dark";
	return {
		"border-gray-800 bg-black/90": darkTheme,
		"border-amber-100 bg-white/90": !darkTheme,
	};
});

// 计算属性：页脚样式
const footerClasses = computed(() => {
	const darkTheme = theme.value === "dark";
	return {
		"border-gray-800 bg-black/30 backdrop-blur-sm": darkTheme,
		"border-amber-100 bg-white/80 backdrop-blur-sm": !darkTheme,
	};
});

// 计算属性：边框颜色
const borderColorClass = computed(() => {
	const darkTheme = theme.value === "dark";
	return {
		"border-gray-800": darkTheme,
		"border-amber-100": !darkTheme,
	};
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
