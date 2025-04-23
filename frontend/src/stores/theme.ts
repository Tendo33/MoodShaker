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

		// 默认返回深色主题
		return "dark";
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

		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(newTheme);

		// 更新 meta 标签以支持移动设备的主题色
		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		if (metaThemeColor) {
			metaThemeColor.setAttribute("content", newTheme === "dark" ? "#111827" : "#ffffff");
		}
	};

	// 切换主题
	const toggleTheme = (): void => {
		theme.value = theme.value === "light" ? "dark" : "light";
	};

	// 获取当前主题的文本颜色类
	const getTextColorClass = (defaultClass: string = ""): string => {
		if (theme.value === "dark") {
			return defaultClass || "text-white";
		}
		return defaultClass || "text-gray-900";
	};

	// 获取当前主题的次要文本颜色类
	const getSecondaryTextColorClass = (): string => {
		if (theme.value === "dark") {
			return "text-gray-300";
		}
		return "text-gray-700";
	};

	// 获取当前主题的静音文本颜色类
	const getMutedTextColorClass = (): string => {
		if (theme.value === "dark") {
			return "text-gray-400";
		}
		return "text-gray-600";
	};

	return {
		theme,
		initTheme,
		toggleTheme,
		getTextColorClass,
		getSecondaryTextColorClass,
		getMutedTextColorClass,
	};
});
