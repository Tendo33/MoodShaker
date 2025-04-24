"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useCocktail } from "@/context/CocktailContext";

// Question option images
const optionImages = {
	classic: "/polished-cocktail-shaker.png",
	custom: "/tropical-fusion.png",
	yes: "/professional-cocktail-kit.png",
	no: "/elegant-cocktail-glass.png",
	low: "/tropical-splash.png",
	medium: "/vibrant-citrus-harmony.png",
	high: "/dark-stormy-cocktail.png",
	any: "/vibrant-cocktail-collection.png",
	easy: "/refreshing-cocktail.png",
	hard: "/intricate-mixology.png",
};

// Spirit images
const spiritImages = {
	gin: "/classic-gin-still-life.png",
	rum: "/weathered-rum-bottle.png",
	vodka: "/frosted-vodka.png",
	whiskey: "/amber-glass-still-life.png",
	tequila: "/aged-agave-spirit.png",
	brandy: "/amber-glass-still-life.png",
};

export default function Questions() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { theme } = useTheme();
	const {
		answers,
		userFeedback,
		baseSpirits,
		isLoading,
		progressPercentage,
		loadSavedData,
		saveAnswer,
		saveFeedback,
		toggleBaseSpirit,
		submitRequest,
		isQuestionAnswered,
		resetAll,
	} = useCocktail();

	const [visibleQuestions, setVisibleQuestions] = useState<number[]>([1]);
	const [showFeedbackForm, setShowFeedbackForm] = useState(false);
	const [showBaseSpirits, setShowBaseSpirits] = useState(false);
	const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
	const baseSpiritsRef = useRef<HTMLDivElement | null>(null);
	const [localUserFeedback, setLocalUserFeedback] = useState("");
	const [animateProgress, setAnimateProgress] = useState(false);
	// 添加一个标志来防止重复设置
	const initialSetupDone = useRef(false);

	// 简化主题样式计算
	const textColorClass = theme === "dark" ? "text-white" : "text-gray-900";
	const cardClasses = theme === "dark" ? "bg-gray-800/80" : "bg-white/80";
	const borderClasses = theme === "dark" ? "border-gray-700" : "border-gray-200";

	const questions = [
		{
			id: 1,
			title: "今天想怎么喝？",
			description: "选择您喜欢的饮用方式",
			options: [
				{
					id: "classic",
					text: "从经典中选择",
					image: optionImages.classic,
				},
				{
					id: "custom",
					text: "自己调配",
					image: optionImages.custom,
				},
			],
		},
		{
			id: 2,
			title: "有没有调酒工具？",
			description: "告诉我们您拥有的调酒工具",
			options: [
				{
					id: "yes",
					text: "有调酒工具",
					image: optionImages.yes,
				},
				{
					id: "no",
					text: "没有调酒工具",
					image: optionImages.no,
				},
			],
		},
		{
			id: 3,
			title: "喜欢什么酒精浓度？",
			description: "选择您偏好的酒精浓度",
			options: [
				{
					id: "low",
					text: "低酒精度",
					image: optionImages.low,
				},
				{
					id: "medium",
					text: "中等酒精度",
					image: optionImages.medium,
				},
				{
					id: "high",
					text: "高酒精度",
					image: optionImages.high,
				},
				{
					id: "any",
					text: "无所谓",
					image: optionImages.any,
				},
			],
		},
		{
			id: 4,
			title: "制作难度偏好",
			description: "选择您能接受的制作难度",
			options: [
				{
					id: "easy",
					text: "简单",
					image: optionImages.easy,
				},
				{
					id: "medium",
					text: "中等",
					image: optionImages.medium,
				},
				{
					id: "hard",
					text: "复杂",
					image: optionImages.hard,
				},
				{
					id: "any",
					text: "无所谓",
					image: optionImages.any,
				},
			],
		},
	];

	const baseSpiritsOptions = [
		{ id: "all", name: "全部", description: "使用所有基酒", image: null },
		{ id: "gin", name: "金酒", description: "Gin", image: spiritImages.gin },
		{ id: "rum", name: "朗姆酒", description: "Rum", image: spiritImages.rum },
		{ id: "vodka", name: "伏特加", description: "Vodka", image: spiritImages.vodka },
		{ id: "whiskey", name: "威士忌", description: "Whiskey", image: spiritImages.whiskey },
		{ id: "tequila", name: "龙舌兰", description: "Tequila", image: spiritImages.tequila },
		{ id: "brandy", name: "白兰地", description: "Brandy", image: spiritImages.brandy },
	];

	const handleOptionSelect = (questionId: number, optionId: string) => {
		saveAnswer(questionId.toString(), optionId);
		setAnimateProgress(true);

		setTimeout(() => {
			setAnimateProgress(false);
		}, 1000);

		// 显示下一个问题或基酒选择部分
		const nextQuestionId = questionId + 1;
		if (nextQuestionId <= questions.length) {
			// 自动显示下一个问题
			if (!visibleQuestions.includes(nextQuestionId)) {
				setVisibleQuestions((prev) => [...prev, nextQuestionId]);

				// 滚动到下一个问题
				setTimeout(() => {
					if (questionRefs.current[nextQuestionId]) {
						questionRefs.current[nextQuestionId]?.scrollIntoView({ behavior: "smooth" });
					}
				}, 100);
			}
		} else if (questionId === questions.length) {
			// 如果是最后一个问题，自动显示基酒选择部分
			setShowBaseSpirits(true);
			setTimeout(() => {
				if (baseSpiritsRef.current) {
					baseSpiritsRef.current.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
		}
	};

	const handleBack = () => {
		router.push("/");
	};

	const handleBaseSpiritsToggle = (spiritId: string) => {
		toggleBaseSpirit(spiritId, baseSpiritsOptions);

		// 选择基酒后自动显示反馈表单
		if (!showFeedbackForm) {
			setShowFeedbackForm(true);
			setTimeout(() => {
				const feedbackForm = document.getElementById("feedback-form");
				if (feedbackForm) {
					feedbackForm.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
		}
	};

	const handleSubmitFeedback = async () => {
		try {
			// 保存用户反馈
			saveFeedback(localUserFeedback);

			// 提交请求
			await submitRequest();

			// 导航到鸡尾酒详情页
			router.push("/cocktail/recommendation");
		} catch (error) {
			console.error("Error submitting request:", error);
			// You might want to show an error message to the user here
		}
	};

	// 初始化函数 - 只在组件挂载时执行一次
	useEffect(() => {
		if (typeof window !== "undefined" && !initialSetupDone.current) {
			initialSetupDone.current = true;

			// 检查是否有 URL 参数指示新会话
			const isNewSession = searchParams?.get("new") === "true";

			// 如果是新会话，清除之前的数据
			if (isNewSession) {
				resetAll();
				setVisibleQuestions([1]);
				setShowBaseSpirits(false);
				setShowFeedbackForm(false);
				return;
			}

			// 加载保存的数据
			loadSavedData();

			// 设置本地反馈
			if (userFeedback) {
				setLocalUserFeedback(userFeedback);
			}

			// 根据已保存的答案设置可见问题
			const answeredQuestionIds = Object.keys(answers).map(Number);
			if (answeredQuestionIds.length > 0) {
				const maxAnsweredId = Math.max(...answeredQuestionIds);
				const nextVisible = [...new Set([...answeredQuestionIds, maxAnsweredId + 1])].filter(
					(id) => id <= questions.length
				);

				setVisibleQuestions(nextVisible);

				// 如果已回答最后一个问题，显示基酒选择部分
				if (maxAnsweredId >= questions.length) {
					setShowBaseSpirits(true);

					// 如果已选择基酒，显示反馈表单
					if (baseSpirits.length > 0) {
						setShowFeedbackForm(true);
					}
				}
			}
		}
	}, [searchParams]); // 只依赖于 searchParams，这样只有在 URL 参数变化时才会重新执行

	// 当 userFeedback 变化时更新本地状态
	useEffect(() => {
		if (userFeedback !== localUserFeedback) {
			setLocalUserFeedback(userFeedback);
		}
	}, [userFeedback]);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex">
				{/* 垂直进度条 - 从上往下增长，跟随内容滚动 */}
				<div className="mr-6 sticky top-8 self-start">
					<button
						className="flex items-center px-4 py-2 rounded-full hover:bg-white/10 transition-colors mb-6"
						onClick={handleBack}
					>
						<ArrowLeft className="mr-2 h-4 w-4" /> 返回
					</button>

					<div className="h-64 w-2 bg-gray-700/30 rounded-full overflow-hidden relative">
						<div
							className={`w-full bg-gradient-to-b from-amber-500 to-pink-500 rounded-full transition-all duration-500 absolute top-0 ${
								animateProgress ? "animate-pulse" : ""
							}`}
							style={{ height: `${progressPercentage}%` }}
						></div>
					</div>
				</div>

				<div className="flex-1">
					{/* 问题列表 */}
					<div className="space-y-12 max-w-3xl">
						{questions.map((question) => (
							<div
								key={question.id}
								ref={(el) => {
									questionRefs.current[question.id] = el;
								}}
								className={`transition-all duration-500 ${
									visibleQuestions.includes(question.id) ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
								}`}
							>
								<div className={`mb-6 border ${borderClasses} rounded-xl overflow-hidden ${cardClasses}`}>
									<div className="p-6 bg-gradient-to-r from-amber-500/10 to-pink-500/10 relative">
										<div className={isQuestionAnswered(question.id.toString()) ? "absolute right-6 top-6" : "hidden"}>
											<div className="bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-full p-1.5">
												<Check className="h-4 w-4" />
											</div>
										</div>
										<h3 className={`text-2xl font-bold mb-3 ${textColorClass}`}>{question.title}</h3>
										<p className="text-gray-400">{question.description}</p>
									</div>
								</div>

								<div className="grid gap-4 grid-cols-2 md:grid-cols-4">
									{question.options.map((option) => (
										<div key={option.id} className="transition-all duration-300">
											<div
												className={`cursor-pointer transition-all duration-300 hover:scale-105 border ${borderClasses} rounded-xl overflow-hidden ${cardClasses} ${
													answers[question.id] === option.id ? "ring-2 ring-pink-500 shadow-lg" : ""
												}`}
												onClick={() => handleOptionSelect(question.id, option.id)}
											>
												<div className="p-4">
													<div className="flex flex-col items-center text-center">
														<div className="mb-3 rounded-full overflow-hidden bg-gradient-to-r from-amber-500/20 to-pink-500/20 p-2">
															<img
																src={option.image || "/placeholder.svg"}
																alt={option.text}
																className="w-20 h-20 object-cover rounded-full"
															/>
														</div>
														<h3 className={`font-medium ${textColorClass}`}>{option.text}</h3>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>

					{/* 基酒选择 */}
					<div ref={baseSpiritsRef} className={showBaseSpirits ? "mt-12 max-w-3xl" : "hidden"}>
						<div className={`border ${borderClasses} rounded-xl overflow-hidden ${cardClasses}`}>
							<div className="p-6 bg-gradient-to-r from-amber-500/10 to-pink-500/10">
								<h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>可用的基酒（可选）</h3>
								<p className="text-gray-400 mb-4">请选择您家中有的基酒</p>
							</div>
							<div className="p-6">
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
									{baseSpiritsOptions.map((spirit) => (
										<div
											key={spirit.id}
											className={`cursor-pointer p-4 rounded-xl transition-all duration-300 border ${
												baseSpirits.includes(spirit.id)
													? "border-pink-500 bg-gradient-to-br from-amber-500/10 to-pink-500/10"
													: `${borderClasses} hover:border-white/30`
											}`}
											onClick={() => handleBaseSpiritsToggle(spirit.id)}
										>
											<div className="flex items-center justify-between mb-2">
												{spirit.image ? (
													<div className="flex items-center">
														<img
															src={spirit.image || "/placeholder.svg"}
															alt={spirit.name}
															className="w-8 h-8 object-cover rounded-full mr-2"
														/>
														<span className={`font-medium ${textColorClass}`}>{spirit.name}</span>
													</div>
												) : (
													<span className={`font-medium ${textColorClass}`}>{spirit.name}</span>
												)}
												<div
													className={
														baseSpirits.includes(spirit.id)
															? "h-5 w-5 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center"
															: "h-5 w-5 rounded-full bg-white/10 flex items-center justify-center"
													}
												>
													{baseSpirits.includes(spirit.id) ? (
														<Check className="h-3 w-3 text-white" />
													) : (
														<X className="h-3 w-3 text-gray-400" />
													)}
												</div>
											</div>
											<p className="text-xs text-gray-400">{spirit.description}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* 反馈表单 */}
					<div id="feedback-form" className={showFeedbackForm ? "mt-12 max-w-3xl" : "hidden"}>
						<div className={`border ${borderClasses} rounded-xl overflow-hidden ${cardClasses}`}>
							<div className="p-6 bg-gradient-to-r from-amber-500/10 to-pink-500/10">
								<h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>还有什么想告诉我们的？</h3>
								<p className="text-gray-400">请分享您的任何特殊需求或偏好</p>
							</div>
							<div className="p-6">
								<textarea
									value={localUserFeedback}
									onChange={(e) => setLocalUserFeedback(e.target.value)}
									placeholder="例如：我喜欢甜一点的鸡尾酒，或者我对某种成分过敏..."
									className={`w-full min-h-[150px] border ${borderClasses} rounded-xl p-4 bg-transparent focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none ${textColorClass}`}
								></textarea>
							</div>
							<div className="px-6 py-4 flex justify-end border-t border-gray-700">
								<button
									onClick={handleSubmitFeedback}
									className={`bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white px-8 py-3 rounded-full flex items-center ${
										isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
									}`}
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
											<span className="font-medium">正在为您匹配...</span>
										</>
									) : (
										<span className="font-medium inline-flex items-center">
											查看推荐鸡尾酒
											<ArrowRight className="ml-2 h-5 w-5" />
										</span>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
