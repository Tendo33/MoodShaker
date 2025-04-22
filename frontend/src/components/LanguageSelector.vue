<template>
	<div class="relative">
		<button
			@click="isOpen = !isOpen"
			class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center"
		>
			<Globe class="h-5 w-5" :class="theme === 'dark' ? 'text-white' : 'text-gray-800'" />
		</button>

		<div
			v-if="isOpen"
			class="absolute right-0 mt-2 w-40 rounded-md shadow-lg z-10"
			:class="theme === 'dark' ? 'bg-gray-800' : 'bg-white'"
		>
			<div class="py-1">
				<button
					v-for="(lang, code) in availableLanguages"
					:key="code"
					@click="changeLanguage(code)"
					class="w-full text-left px-4 py-2 text-sm transition-colors"
					:class="[
						currentLocale === code
							? theme === 'dark'
								? 'bg-gray-700 text-white'
								: 'bg-amber-100 text-gray-900'
							: theme === 'dark'
								? 'text-gray-300 hover:bg-gray-700'
								: 'text-gray-700 hover:bg-gray-100',
					]"
				>
					{{ lang }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Globe } from "lucide-vue-next";
import { useThemeStore } from "../stores/theme";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { locale } = useI18n();

const isOpen = ref(false);
const currentLocale = computed(() => locale.value);

const availableLanguages: Record<string, string> = {
	zh: "中文",
	en: "English",
};

const changeLanguage = (lang: string): void => {
	locale.value = lang;
	localStorage.setItem("moodshaker-language", lang);
	isOpen.value = false;
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent): void => {
	if (isOpen.value) {
		isOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);

	// 从本地存储加载语言设置
	const savedLanguage = localStorage.getItem("moodshaker-language");
	if (savedLanguage && availableLanguages[savedLanguage]) {
		locale.value = savedLanguage;
	}
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
