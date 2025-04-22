<template>
	<button
		@click="toggleTheme"
		class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
		:title="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
	>
		<Sun v-if="theme === 'dark'" class="h-5 w-5 text-yellow-400" />
		<Moon v-else class="h-5 w-5 text-blue-400" />
	</button>
</template>

<script setup lang="ts">
import { Sun, Moon } from "lucide-vue-next";
import { useThemeStore } from "../stores/theme";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { toggleTheme } = themeStore;
</script>
