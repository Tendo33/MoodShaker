<template>
	<button
		@click="toggleTheme"
		class="p-2 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-110"
		:class="[theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-800/10 hover:bg-gray-800/20']"
		aria-label="切换主题"
	>
		<Sun v-if="theme === 'dark'" class="h-5 w-5 text-white" />
		<Moon v-else class="h-5 w-5 text-gray-800" />

		<span class="sr-only">{{ theme === "dark" ? "切换到浅色模式" : "切换到深色模式" }}</span>
	</button>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Sun, Moon } from "lucide-vue-next";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { toggleTheme } = themeStore;

// const isDark = ref(theme.value === 'dark'); // Initialize based on initial theme value
// watch(theme, (newTheme) => {
//   isDark.value = newTheme === 'dark';
// });
</script>
