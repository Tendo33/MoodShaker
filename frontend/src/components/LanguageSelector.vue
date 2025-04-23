<template>
	<div class="relative">
		<!-- 语言选择按钮 -->
		<button
			@click.stop="isOpen = !isOpen"
			class="p-2.5 rounded-full transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
			:class="[
				theme === 'dark'
					? 'bg-white/10 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-pink-500/20'
					: 'bg-gray-100 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-pink-500/20',
			]"
			aria-label="选择语言"
		>
			<span
				class="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"
			></span>
			<Globe
				class="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
				:class="theme === 'dark' ? 'text-white' : 'text-gray-800'"
			/>
			<span
				class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs font-medium transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-bottom-6"
				:class="theme === 'dark' ? 'text-white/70' : 'text-gray-600'"
			>
				{{ currentLanguageName }}
			</span>
		</button>

		<!-- 语言下拉菜单 -->
		<transition
			enter-active-class="transition ease-out duration-200"
			enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="transition ease-in duration-150"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<div
				v-if="isOpen"
				class="absolute right-0 mt-3 w-48 rounded-xl shadow-lg z-10 border overflow-hidden"
				:class="
					theme === 'dark'
						? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
						: 'bg-white/90 backdrop-blur-sm border-gray-100'
				"
				@click.stop
			>
				<div class="py-1.5">
					<div class="px-3 py-1.5 text-xs font-medium" :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'">
						选择语言
					</div>

					<div class="mt-1">
						<button
							v-for="(lang, code) in availableLanguages"
							:key="code"
							@click.stop="changeLanguage(code)"
							class="w-full text-left px-4 py-2.5 flex items-center space-x-3 transition-all duration-200"
							:class="[
								currentLocale === code
									? theme === 'dark'
										? 'bg-gradient-to-r from-amber-500/20 to-pink-500/20 text-white'
										: 'bg-gradient-to-r from-amber-500/10 to-pink-500/10 text-gray-900'
									: theme === 'dark'
										? 'text-gray-300 hover:bg-gray-700/50'
										: 'text-gray-700 hover:bg-gray-100',
							]"
						>
							<div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
								<span v-if="code === 'zh-CN'" class="text-lg">🇨🇳</span>
								<span v-if="code === 'en'" class="text-lg">🇺🇸</span>
							</div>
							<span>{{ lang }}</span>
							<div
								v-if="currentLocale === code"
								class="ml-auto flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full"
								:class="theme === 'dark' ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-500/20 text-amber-600'"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						</button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Globe } from "lucide-vue-next";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { loadLanguageAsync } from "@/modules/i18n";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { locale } = useI18n();

const isOpen = ref(false);
const currentLocale = computed(() => locale.value);

const availableLanguages: Record<string, string> = {
	"zh-CN": "中文",
	en: "English",
};

// 计算当前语言名称
const currentLanguageName = computed(() => {
	return availableLanguages[currentLocale.value] || availableLanguages["zh-CN"];
});

const changeLanguage = async (lang: string): Promise<void> => {
	try {
		await loadLanguageAsync(lang);
		localStorage.setItem("moodshaker-language", lang);
		isOpen.value = false;
	} catch (error) {
		console.error("Failed to change language:", error);
	}
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
		changeLanguage(savedLanguage);
	}
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
