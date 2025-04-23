import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { requestCocktailRecommendation, pollForCocktailImage, AlcoholLevel, DifficultyLevel, Cocktail, BartenderRequest, Ingredient, Tool, Step } from "@/api/cocktail";

// 模拟用户ID和会话ID，实际应用中应从认证系统获取
const MOCK_USER_ID = 1;
const MOCK_SESSION_ID = "session-123";

export const useCocktailStore = defineStore("cocktail", () => {
	// 状态
	const answers = ref<Record<string, string>>({});
	const userFeedback = ref<string>("");
	const baseSpirits = ref<string[]>([]);
	const recommendation = ref<Cocktail | null>(null);
	const imageData = ref<string | null>(null);
	const isLoading = ref<boolean>(false);
	const isImageLoading = ref<boolean>(false);
	const error = ref<string | null>(null);

	// 计算属性
	const progressPercentage = computed((): number => {
		const totalQuestions = 4; // 问题总数
		const answeredCount = Object.keys(answers.value).length;
		return (answeredCount / totalQuestions) * 100;
	});

	// 是否已回答特定问题
	const isQuestionAnswered = (questionId: string): boolean => {
		return answers.value[questionId] !== undefined;
	};

	// 加载保存的数据
	const loadSavedData = (): void => {
		try {
			// 加载用户答案
			const savedAnswers = localStorage.getItem("moodshaker-answers");
			if (savedAnswers) {
				answers.value = JSON.parse(savedAnswers);
			}

			// 加载用户反馈
			const savedFeedback = localStorage.getItem("moodshaker-feedback");
			if (savedFeedback) {
				userFeedback.value = savedFeedback;
			}

			// 加载基酒选择
			const savedSpirits = localStorage.getItem("moodshaker-base-spirits");
			if (savedSpirits) {
				baseSpirits.value = JSON.parse(savedSpirits);
			}

			// 加载推荐结果
			const savedRecommendation = localStorage.getItem("moodshaker-recommendation");
			if (savedRecommendation) {
				recommendation.value = JSON.parse(savedRecommendation);
			}
		} catch (e) {
			console.error("Error loading saved data:", e);
			error.value = "加载保存的数据时出错";
		}
	};

	// 保存答案
	const saveAnswer = (questionId: string, optionId: string): void => {
		answers.value = { ...answers.value, [questionId]: optionId };
		localStorage.setItem("moodshaker-answers", JSON.stringify(answers.value));
	};

	// 保存用户反馈
	const saveFeedback = (feedback: string): void => {
		userFeedback.value = feedback;
		localStorage.setItem("moodshaker-feedback", userFeedback.value);
	};

	// 保存基酒选择
	const saveBaseSpirits = (spirits: string[]): void => {
		baseSpirits.value = spirits;
		localStorage.setItem("moodshaker-base-spirits", JSON.stringify(baseSpirits.value));
	};

	// 切换基酒选择
	interface SpiritOption {
		id: string;
		name: string;
	}

	const toggleBaseSpirit = (spiritId: string, allSpiritsOptions: SpiritOption[]): void => {
		let newSpirits = [...baseSpirits.value];

		if (spiritId === "all") {
			if (baseSpirits.value.includes("all")) {
				newSpirits = [];
			} else {
				newSpirits = allSpiritsOptions.filter((option) => option.id !== "all").map((option) => option.id);
			}
		} else {
			if (baseSpirits.value.includes(spiritId)) {
				newSpirits = baseSpirits.value.filter((id) => id !== spiritId && id !== "all");
			} else {
				newSpirits = [...baseSpirits.value.filter((id) => id !== "all"), spiritId];

				// 检查是否选择了所有基酒
				const allOtherSpirits = allSpiritsOptions.filter((option) => option.id !== "all").map((option) => option.id);

				if (allOtherSpirits.every((id) => newSpirits.includes(id))) {
					newSpirits.push("all");
				}
			}
		}

		saveBaseSpirits(newSpirits);
	};

	// 创建请求对象
	const createRequestObject = (): BartenderRequest => {
		// 将用户选择映射到API请求格式
		let alcoholLevel = AlcoholLevel.ANY;
		if (answers.value[3] === "low") alcoholLevel = AlcoholLevel.LOW;
		else if (answers.value[3] === "medium") alcoholLevel = AlcoholLevel.MEDIUM;
		else if (answers.value[3] === "high") alcoholLevel = AlcoholLevel.HIGH;

		let difficultyLevel = DifficultyLevel.ANY;
		if (answers.value[4] === "easy") difficultyLevel = DifficultyLevel.EASY;
		else if (answers.value[4] === "medium") difficultyLevel = DifficultyLevel.MEDIUM;
		else if (answers.value[4] === "hard") difficultyLevel = DifficultyLevel.HARD;

		const hasTools = answers.value[2] === "yes" ? true : answers.value[2] === "no" ? false : null;

		return {
			message: userFeedback.value || "推荐一款适合我的鸡尾酒",
			alcohol_level: alcoholLevel,
			has_tools: hasTools,
			difficulty_level: difficultyLevel,
			base_spirits: baseSpirits.value.length > 0 ? baseSpirits.value : null,
			user_id: MOCK_USER_ID,
			session_id: MOCK_SESSION_ID
		};
	};

	// 提交请求获取推荐
	const submitRequest = async (): Promise<Cocktail> => {
		isLoading.value = true;
		error.value = null;

		try {
			// 创建请求对象
			const request = createRequestObject();

			// 保存请求对象
			localStorage.setItem("moodshaker-request", JSON.stringify(request));

			// 发送请求
			const result = await requestCocktailRecommendation(request);
			recommendation.value = result;

			// 保存推荐结果
			localStorage.setItem("moodshaker-recommendation", JSON.stringify(result));

			// 开始轮询图片
			startImagePolling();

			return result;
		} catch (e) {
			console.error("Error submitting request:", e);
			error.value = "获取推荐时出错，请稍后再试";
			throw e;
		} finally {
			isLoading.value = false;
		}
	};

	// 开始轮询图片
	const startImagePolling = (): void => {
		isImageLoading.value = true;

		pollForCocktailImage(MOCK_USER_ID, MOCK_SESSION_ID, (data: string) => {
			imageData.value = data;
			isImageLoading.value = false;
		});
	};

	// 重置所有数据
	const resetAll = (): void => {
		answers.value = {};
		userFeedback.value = "";
		baseSpirits.value = [];
		recommendation.value = null;
		imageData.value = null;
		error.value = null;

		// 清除本地存储
		localStorage.removeItem("moodshaker-answers");
		localStorage.removeItem("moodshaker-feedback");
		localStorage.removeItem("moodshaker-base-spirits");
		localStorage.removeItem("moodshaker-recommendation");
		localStorage.removeItem("moodshaker-request");
	};

	return {
		// 状态
		answers,
		userFeedback,
		baseSpirits,
		recommendation,
		imageData,
		isLoading,
		isImageLoading,
		error,

		// 计算属性
		progressPercentage,

		// 方法
		loadSavedData,
		saveAnswer,
		saveFeedback,
		saveBaseSpirits,
		toggleBaseSpirit,
		submitRequest,
		isQuestionAnswered,
		resetAll,
		startImagePolling,
	};
});
