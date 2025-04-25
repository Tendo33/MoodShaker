"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import {
	requestCocktailRecommendation,
	pollForCocktailImage,
	AlcoholLevel,
	DifficultyLevel,
	AgentType,
	type Cocktail,
	type BartenderRequest,
} from "@/api/cocktail";
import { useAuth } from "@/hooks/useAuth";
import { getFromStorage, saveToStorage, clearStorageWithPrefix } from "@/utils/localStorage";

// 存储键常量
const STORAGE_KEYS = {
	ANSWERS: "moodshaker-answers",
	FEEDBACK: "moodshaker-feedback",
	BASE_SPIRITS: "moodshaker-base-spirits",
	RECOMMENDATION: "moodshaker-recommendation",
	SESSION_ID: "moodshaker-session-id",
	USER_ID: "moodshaker-user-id",
	REQUEST: "moodshaker-request",
};

interface SpiritOption {
	id: string;
	name: string;
	description?: string;
}

interface CocktailContextType {
	answers: Record<string, string>;
	userFeedback: string;
	baseSpirits: string[];
	recommendation: Cocktail | null;
	imageData: string | null;
	isLoading: boolean;
	isImageLoading: boolean;
	error: string | null;
	progressPercentage: number;
	loadSavedData: () => void;
	saveAnswer: (questionId: string, optionId: string) => void;
	saveFeedback: (feedback: string) => void;
	saveBaseSpirits: (spirits: string[]) => void;
	toggleBaseSpirit: (spiritId: string, allSpiritsOptions: SpiritOption[]) => void;
	submitRequest: () => Promise<Cocktail>;
	isQuestionAnswered: (questionId: string) => boolean;
	resetAll: () => void;
	startImagePolling: () => void;
}

const CocktailContext = createContext<CocktailContextType | undefined>(undefined);

interface CocktailProviderProps {
	children: ReactNode;
}

/**
 * 鸡尾酒上下文提供者组件
 * 管理鸡尾酒推荐相关的状态和操作
 */
export const CocktailProvider = ({ children }: CocktailProviderProps) => {
	const { user } = useAuth();
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [userFeedback, setUserFeedback] = useState<string>("");
	const [baseSpirits, setBaseSpirits] = useState<string[]>([]);
	const [recommendation, setRecommendation] = useState<Cocktail | null>(null);
	const [imageData, setImageData] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState<string>("");

	// 初始化会话ID
	useEffect(() => {
		if (!sessionId) {
			const savedSessionId = getFromStorage<string>(STORAGE_KEYS.SESSION_ID, "");
			if (savedSessionId) {
				setSessionId(savedSessionId);
			} else {
				const newSessionId = `session-${Math.random().toString(36).substring(2, 15)}`;
				setSessionId(newSessionId);
				saveToStorage(STORAGE_KEYS.SESSION_ID, newSessionId);
			}
		}
	}, [sessionId]);

	// 计算进度百分比
	const progressPercentage = useMemo(() => {
		const totalQuestions = 4; // 问题总数
		const answeredCount = Object.keys(answers).length;
		return (answeredCount / totalQuestions) * 100;
	}, [answers]);

	// 检查问题是否已回答
	const isQuestionAnswered = useCallback(
		(questionId: string): boolean => {
			return answers[questionId] !== undefined;
		},
		[answers]
	);

	// 加载保存的数据
	const loadSavedData = useCallback((): void => {
		try {
			const savedAnswers = getFromStorage<Record<string, string>>(STORAGE_KEYS.ANSWERS, {});
			const savedFeedback = getFromStorage<string>(STORAGE_KEYS.FEEDBACK, "");
			const savedSpirits = getFromStorage<string[]>(STORAGE_KEYS.BASE_SPIRITS, []);
			const savedRecommendation = getFromStorage<Cocktail | null>(STORAGE_KEYS.RECOMMENDATION, null);
			const savedSessionId = getFromStorage<string>(STORAGE_KEYS.SESSION_ID, "");

			setAnswers(savedAnswers);
			setUserFeedback(savedFeedback);
			setBaseSpirits(savedSpirits);
			setRecommendation(savedRecommendation);

			if (savedSessionId && savedSessionId !== sessionId) {
				setSessionId(savedSessionId);
			}
		} catch (e) {
			console.error("Error loading saved data:", e);
			setError("加载保存的数据时出错");
		}
	}, [sessionId]);

	// 保存答案
	const saveAnswer = useCallback(
		(questionId: string, optionId: string): void => {
			const newAnswers = { ...answers, [questionId]: optionId };
			setAnswers(newAnswers);
			saveToStorage(STORAGE_KEYS.ANSWERS, newAnswers);
		},
		[answers]
	);

	// 保存用户反馈
	const saveFeedback = useCallback((feedback: string): void => {
		setUserFeedback(feedback);
		saveToStorage(STORAGE_KEYS.FEEDBACK, feedback);
	}, []);

	// 保存基酒选择
	const saveBaseSpirits = useCallback((spirits: string[]): void => {
		setBaseSpirits(spirits);
		saveToStorage(STORAGE_KEYS.BASE_SPIRITS, spirits);
	}, []);

	// 切换基酒选择
	const toggleBaseSpirit = useCallback(
		(spiritId: string, allSpiritsOptions: SpiritOption[]): void => {
			let newSpirits = [...baseSpirits];

			if (spiritId === "all") {
				if (baseSpirits.includes("all")) {
					newSpirits = [];
				} else {
					newSpirits = allSpiritsOptions.filter((option) => option.id !== "all").map((option) => option.id);
				}
			} else {
				if (baseSpirits.includes(spiritId)) {
					newSpirits = baseSpirits.filter((id) => id !== spiritId && id !== "all");
				} else {
					newSpirits = [...baseSpirits.filter((id) => id !== "all"), spiritId];

					// 检查是否选择了所有基酒
					const allOtherSpirits = allSpiritsOptions.filter((option) => option.id !== "all").map((option) => option.id);

					if (allOtherSpirits.every((id) => newSpirits.includes(id))) {
						newSpirits.push("all");
					}
				}
			}

			saveBaseSpirits(newSpirits);
		},
		[baseSpirits, saveBaseSpirits]
	);

	// 创建请求对象
	const createRequestObject = useCallback((): BartenderRequest => {
		const alcoholLevel = (answers[3] as AlcoholLevel) || AlcoholLevel.MEDIUM;
		const hasTools = answers[2] === "yes";
		const difficultyLevel = (answers[4] as DifficultyLevel) || DifficultyLevel.MEDIUM;
		const filteredSpirits = baseSpirits.filter((spirit) => spirit !== "");

		return {
			message: userFeedback,
			alcohol_level: alcoholLevel,
			has_tools: hasTools,
			difficulty_level: difficultyLevel,
			base_spirits: filteredSpirits.length > 0 ? filteredSpirits : null,
			user_id: user?.id.toString() || "",
			session_id: sessionId,
		};
	}, [answers, baseSpirits, sessionId, user, userFeedback]);

	// 提交请求获取推荐
	const submitRequest = async (): Promise<Cocktail> => {
		setIsLoading(true);
		setError(null);

		try {
			// 创建请求对象
			const request = createRequestObject();

			// 保存请求对象
			saveToStorage(STORAGE_KEYS.REQUEST, request);
			saveToStorage(STORAGE_KEYS.USER_ID, user?.id.toString() || "");

			// 确定使用哪种调酒师类型
			const bartenderType = answers[1] === "classic" ? AgentType.CLASSIC_BARTENDER : AgentType.CREATIVE_BARTENDER;

			console.log("Submitting request:", JSON.stringify(request, null, 2));
			console.log("Using bartender type:", bartenderType);

			// 发送请求
			const result = await requestCocktailRecommendation(request, bartenderType);

			console.log("Received recommendation:", result);

			// 确保我们不使用默认数据，除非API调用失败
			if (result) {
				setRecommendation(result);
				// 保存推荐结果
				saveToStorage(STORAGE_KEYS.RECOMMENDATION, result);
			}

			// 开始轮询图片
			startImagePolling();

			return result;
		} catch (e) {
			console.error("Error submitting request:", e);
			setError(`获取推荐时出错: ${e instanceof Error ? e.message : "未知错误"}`);
			throw e;
		} finally {
			setIsLoading(false);
		}
	};

	// 开始轮询图片
	const startImagePolling = useCallback((): void => {
		setIsImageLoading(true);

		if (!user) {
			setError("请先登录");
			setIsImageLoading(false);
			return;
		}

		pollForCocktailImage(user.id.toString(), sessionId, (data: string) => {
			setImageData(data);
			setIsImageLoading(false);
		});
	}, [user, sessionId]);

	// 重置所有数据
	const resetAll = useCallback((): void => {
		setAnswers({});
		setUserFeedback("");
		setBaseSpirits([]);
		setRecommendation(null);
		setImageData(null);
		setError(null);

		// 生成新的会话ID
		const newSessionId = `session-${Math.random().toString(36).substring(2, 15)}`;
		setSessionId(newSessionId);
		saveToStorage(STORAGE_KEYS.SESSION_ID, newSessionId);

		// 清除本地存储
		clearStorageWithPrefix("moodshaker-");
	}, []);

	// 上下文值
	const contextValue = useMemo(
		() => ({
			answers,
			userFeedback,
			baseSpirits,
			recommendation,
			imageData,
			isLoading,
			isImageLoading,
			error,
			progressPercentage,
			loadSavedData,
			saveAnswer,
			saveFeedback,
			saveBaseSpirits,
			toggleBaseSpirit,
			submitRequest,
			isQuestionAnswered,
			resetAll,
			startImagePolling,
		}),
		[
			answers,
			userFeedback,
			baseSpirits,
			recommendation,
			imageData,
			isLoading,
			isImageLoading,
			error,
			progressPercentage,
			loadSavedData,
			saveAnswer,
			saveFeedback,
			saveBaseSpirits,
			toggleBaseSpirit,
			isQuestionAnswered,
			resetAll,
			startImagePolling,
		]
	);

	return <CocktailContext.Provider value={contextValue}>{children}</CocktailContext.Provider>;
};

/**
 * 使用鸡尾酒上下文的Hook
 * @returns 鸡尾酒上下文
 */
export const useCocktail = (): CocktailContextType => {
	const context = useContext(CocktailContext);
	if (context === undefined) {
		throw new Error("useCocktail must be used within a CocktailProvider");
	}
	return context;
};
