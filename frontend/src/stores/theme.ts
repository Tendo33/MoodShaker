import { defineStore } from "pinia";
import { ref, watch } from "vue";

type ThemeType = "light" | "dark";

export const useThemeStore = defineStore("theme", () => {
	// 检查系统偏好和本地存储
	const getInitialTheme = (): ThemeType => {
		// 如果不在浏览器环境中，返回默认主题
		if (typeof window === "undefined") return "dark";

		const savedTheme = localStorage.getItem("moodshaker-theme");
		if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

		// 检查系统偏好
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			return "dark";
		}

		return "light";
	};

	const theme = ref<ThemeType>(getInitialTheme());

	// 初始化主题
	const initTheme = (): void => {
		applyTheme(theme.value);
	};

	// 监听主题变化并应用
	watch(theme, (newTheme) => {
		localStorage.setItem("moodshaker-theme", newTheme);
		applyTheme(newTheme);
	});

	// 应用主题到文档
	const applyTheme = (newTheme: ThemeType): void => {
		if (typeof document === "undefined") return;

		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	// 切换主题
	const toggleTheme = (): void => {
		theme.value = theme.value === "light" ? "dark" : "light";
	};

	return {
		theme,
		initTheme,
		toggleTheme,
	};
});
