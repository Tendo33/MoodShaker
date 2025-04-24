"use client";

import type React from "react";

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react";
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

// 模拟用户ID和会话ID，实际应用中应从认证系统获取
const MOCK_USER_ID = 1;
const MOCK_SESSION_ID = "session-123";

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

export const CocktailProvider: React.FC<CocktailProviderProps> = ({ children }) => {
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

	// Initialize session ID
	useEffect(() => {
		// Generate a random session ID if not already set
		if (!sessionId) {
			setSessionId(`session-${Math.random().toString(36).substring(2, 15)}`);
		}
	}, [sessionId]);

	// 计算属性
	const progressPercentage = (): number => {
		const totalQuestions = 4; // 问题总数
		const answeredCount = Object.keys(answers).length;
		return (answeredCount / totalQuestions) * 100;
	};

	// 是否已回答特定问题
	const isQuestionAnswered = (questionId: string): boolean => {
		return answers[questionId] !== undefined;
	};

	// 加载保存的数据
	const loadSavedData = useCallback((): void => {
		try {
			if (typeof window === "undefined") return;

			// 加载用户答案
			const savedAnswers = localStorage.getItem("moodshaker-answers");
			if (savedAnswers) {
				const parsedAnswers = JSON.parse(savedAnswers);
				// 只有当答案发生变化时才更新状态
				if (JSON.stringify(parsedAnswers) !== JSON.stringify(answers)) {
					setAnswers(parsedAnswers);
				}
			}

			// 加载用户反馈
			const savedFeedback = localStorage.getItem("moodshaker-feedback");
			if (savedFeedback && savedFeedback !== userFeedback) {
				setUserFeedback(savedFeedback);
			}

			// 加载基酒选择
			const savedSpirits = localStorage.getItem("moodshaker-base-spirits");
			if (savedSpirits) {
				const parsedSpirits = JSON.parse(savedSpirits);
				if (JSON.stringify(parsedSpirits) !== JSON.stringify(baseSpirits)) {
					setBaseSpirits(parsedSpirits);
				}
			}

			// 加载推荐结果
			const savedRecommendation = localStorage.getItem("moodshaker-recommendation");
			if (savedRecommendation && (!recommendation || savedRecommendation !== JSON.stringify(recommendation))) {
				setRecommendation(JSON.parse(savedRecommendation));
			}

			// 加载会话ID
			const savedSessionId = localStorage.getItem("moodshaker-session-id");
			if (savedSessionId && savedSessionId !== sessionId) {
				setSessionId(savedSessionId);
			}
		} catch (e) {
			console.error("Error loading saved data:", e);
			setError("加载保存的数据时出错");
		}
	}, [answers, baseSpirits, recommendation, userFeedback, sessionId]);

	// 保存答案
	const saveAnswer = (questionId: string, optionId: string): void => {
		const newAnswers = { ...answers, [questionId]: optionId };
		setAnswers(newAnswers);
		localStorage.setItem("moodshaker-answers", JSON.stringify(newAnswers));
	};

	// 保存用户反馈
	const saveFeedback = (feedback: string): void => {
		setUserFeedback(feedback);
		localStorage.setItem("moodshaker-feedback", feedback);
	};

	// 保存基酒选择
	const saveBaseSpirits = (spirits: string[]): void => {
		setBaseSpirits(spirits);
		localStorage.setItem("moodshaker-base-spirits", JSON.stringify(spirits));
	};

	// 切换基酒选择
	const toggleBaseSpirit = (spiritId: string, allSpiritsOptions: SpiritOption[]): void => {
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
	};

	// 创建请求对象
	const createRequestObject = (): BartenderRequest => {
		const mood = answers[1] || "happy";
		const alcoholLevel = (answers[2] as AlcoholLevel) || AlcoholLevel.MEDIUM;
		const hasTools = answers[3] === "yes";
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
	};

	// 提交请求获取推荐
	const submitRequest = async (): Promise<Cocktail> => {
		setIsLoading(true);
		setError(null);

		try {
			// 创建请求对象
			const request = createRequestObject();

			// 保存请求对象
			localStorage.setItem("moodshaker-request", JSON.stringify(request));

			// 保存会话ID和用户ID
			localStorage.setItem("moodshaker-session-id", sessionId);
			localStorage.setItem("moodshaker-user-id", user?.id.toString() || "");

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
				localStorage.setItem("moodshaker-recommendation", JSON.stringify(result));
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
	const startImagePolling = (): void => {
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
	};

	// 重置所有数据
	const resetAll = (): void => {
		setAnswers({});
		setUserFeedback("");
		setBaseSpirits([]);
		setRecommendation(null);
		setImageData(null);
		setError(null);

		// 生成新的会话ID
		const newSessionId = `session-${Math.random().toString(36).substring(2, 15)}`;
		setSessionId(newSessionId);
		localStorage.setItem("moodshaker-session-id", newSessionId);

		// 清除本地存储
		localStorage.removeItem("moodshaker-answers");
		localStorage.removeItem("moodshaker-feedback");
		localStorage.removeItem("moodshaker-base-spirits");
		localStorage.removeItem("moodshaker-recommendation");
		localStorage.removeItem("moodshaker-request");
	};

	return (
		<CocktailContext.Provider
			value={{
				answers,
				userFeedback,
				baseSpirits,
				recommendation,
				imageData,
				isLoading,
				isImageLoading,
				error,
				progressPercentage: progressPercentage(),
				loadSavedData,
				saveAnswer,
				saveFeedback,
				saveBaseSpirits,
				toggleBaseSpirit,
				submitRequest,
				isQuestionAnswered,
				resetAll,
				startImagePolling,
			}}
		>
			{children}
		</CocktailContext.Provider>
	);
};

export const useCocktail = (): CocktailContextType => {
	const context = useContext(CocktailContext);
	if (context === undefined) {
		throw new Error("useCocktail must be used within a CocktailProvider");
	}
	return context;
};
