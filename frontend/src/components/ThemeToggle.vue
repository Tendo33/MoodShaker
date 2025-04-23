<template>
	<button
		@click="toggleTheme"
		class="p-2 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-110 group"
		:class="[theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-800/10 hover:bg-gray-800/20']"
		aria-label="切换主题"
	>
		<Sun v-if="theme === 'dark'" class="h-5 w-5 text-white" />
		<Moon v-else class="h-5 w-5 text-gray-800" />

		<!-- 悬停提示 -->
		<span
			class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
			:class="theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-md'"
		>
			{{ theme === "dark" ? "切换到浅色模式" : "切换到深色模式" }}
		</span>
	</button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Sun, Moon } from "lucide-vue-next";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { toggleTheme } = themeStore;
</script>
