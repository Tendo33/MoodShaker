import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorStore = defineStore("error", () => {
	const message = ref<string>("");

	const setError = (errorMessage: string): void => {
		message.value = errorMessage;

		// 5秒后自动清除错误
		setTimeout(() => {
			if (message.value === errorMessage) {
				clearError();
			}
		}, 5000);
	};

	const clearError = (): void => {
		message.value = "";
	};

	return {
		message,
		setError,
		clearError,
	};
});
