"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCocktail } from "../context/CocktailContext";

// Question option images
const optionImages = {
	classic: "/stainless-steel-shaker.png",
	custom: "/vibrant-elixir.png",
	yes: "/cocktail-essentials.png",
	no: "/classic-cocktail-glass.png",
	low: "/fruity-refreshment.png",
	medium: "/balanced-citrus-cocktail.png",
	high: "/dark-and-stormy-night.png",
	any: "/placeholder.svg?height=120&width=120&query=variety of cocktails",
	easy: "/placeholder.svg?height=120&width=120&query=simple cocktail preparation",
	hard: "/placeholder.svg?height=120&width=120&query=complex cocktail preparation",
};

// Spirit images
const spiritImages = {
	gin: "/placeholder.svg?height=80&width=80&query=gin bottle",
	rum: "/placeholder.svg?height=80&width=80&query=rum bottle",
	vodka: "/placeholder.svg?height=80&width=80&query=vodka bottle",
	whiskey: "/placeholder.svg?height=80&width=80&query=whiskey bottle",
	tequila: "/placeholder.svg?height=80&width=80&query=tequila bottle",
	brandy: "/placeholder.svg?height=80&width=80&query=brandy bottle",
};

const Questions: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
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
	const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
	const [localUserFeedback, setLocalUserFeedback] = useState("");
	const [animateProgress, setAnimateProgress] = useState(false);

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

		// 如果回答的是最后一个问题，显示反馈表单
		if (questionId === questions.length) {
			setShowFeedbackForm(true);
			// 滚动到反馈表单
			setTimeout(() => {
				const feedbackForm = document.getElementById("feedback-form");
				if (feedbackForm) {
					feedbackForm.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
		} else {
			// 否则显示下一个问题
			const nextQuestionId = questionId + 1;
			if (!visibleQuestions.includes(nextQuestionId) && nextQuestionId <= questions.length) {
				setVisibleQuestions([...visibleQuestions, nextQuestionId]);

				// 滚动到下一个问题
				setTimeout(() => {
					if (questionRefs.current[nextQuestionId]) {
						questionRefs.current[nextQuestionId]?.scrollIntoView({ behavior: "smooth" });
					}
				}, 100);
			}
		}
	};

	const showNextQuestion = (currentQuestionId: number) => {
		const nextQuestionId = currentQuestionId + 1;
		if (!visibleQuestions.includes(nextQuestionId) && nextQuestionId <= questions.length) {
			setVisibleQuestions([...visibleQuestions, nextQuestionId]);
			setTimeout(() => {
				if (questionRefs.current[nextQuestionId]) {
					questionRefs.current[nextQuestionId]?.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
		}
	};

	const handleBack = () => {
		navigate("/");
	};

	const handleBaseSpiritsToggle = (spiritId: string) => {
		toggleBaseSpirit(spiritId, baseSpiritsOptions);
	};

	const handleSubmitFeedback = async () => {
		try {
			// 保存用户反馈
			saveFeedback(localUserFeedback);

			// 提交请求
			await submitRequest();

			// 导航到鸡尾酒详情页
			navigate("/cocktail/recommendation");
		} catch (error) {
			console.error("Error submitting request:", error);
		}
	};

	const loadSavedDataAndSetup = () => {
		if (typeof window !== "undefined") {
			// 检查是否有 URL 参数指示新会话
			const isNewSession = new URLSearchParams(location.search).get("new") === "true";

			// 如果是新会话，清除之前的数据
			if (isNewSession) {
				resetAll();
				setVisibleQuestions([1]);
				setShowFeedbackForm(false);
				return;
			}

			// 加载保存的数据
			loadSavedData();
			setLocalUserFeedback(userFeedback);

			// 根据已保存的答案设置可见问题
			const answeredQuestionIds = Object.keys(answers).map(Number);
			if (answeredQuestionIds.length > 0) {
				const maxAnsweredId = Math.max(...answeredQuestionIds);
				const nextVisible = [...answeredQuestionIds];
				if (maxAnsweredId < questions.length) {
					nextVisible.push(maxAnsweredId + 1);
				}
				setVisibleQuestions(nextVisible);

				if (maxAnsweredId === questions.length) {
					setShowFeedbackForm(true);
				}
			}
		}
	};

	useEffect(() => {
		// 加载保存的数据，根据URL参数决定是否开始新会话
		loadSavedDataAndSetup();
	}, [location.search]);

	useEffect(() => {
		setLocalUserFeedback(userFeedback);
	}, [userFeedback]);

	return (
		<div className="container mx-auto px-4 py-8">
			{/* 顶部导航和进度条 */}
			<div className="mb-8 flex items-center justify-between">
				<button
					className="flex items-center px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
					onClick={handleBack}
				>
					<ArrowLeft className="mr-2 h-4 w-4" /> 返回
				</button>

				{/* 进度条 */}
				<div className="w-1/2 h-2 bg-gray-700/30 rounded-full overflow-hidden">
					<div
						className={`h-full bg-gradient-to-r from-amber-500 to-pink-500 rounded-full transition-all duration-500 ${
							animateProgress ? "animate-pulse" : ""
						}`}
						style={{ width: `${progressPercentage}%` }}
					></div>
				</div>
			</div>

			{/* 问题列表 */}
			<div className="space-y-12 max-w-3xl mx-auto">
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

						<div
							className={
								isQuestionAnswered(question.id.toString()) &&
								question.id < questions.length &&
								!visibleQuestions.includes(question.id + 1)
									? "flex justify-center mt-8"
									: "hidden"
							}
						>
							<button
								className="flex items-center px-6 py-3 border border-white/10 rounded-full hover:bg-white/10 transition-all"
								onClick={() => showNextQuestion(question.id)}
							>
								下一个问题 <ChevronDown className="ml-2 h-4 w-4" />
							</button>
						</div>
					</div>
				))}
			</div>

			{/* 基酒选择 */}
			<div className={visibleQuestions.includes(questions.length) ? "mt-12 max-w-3xl mx-auto" : "hidden"}>
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
			<div id="feedback-form" className={showFeedbackForm ? "mt-12 max-w-3xl mx-auto" : "hidden"}>
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
	);
};

export default Questions;
