"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, Droplet, RefreshCw, Beaker, Share2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useCocktail } from "@/context/CocktailContext";
import { getCocktailById } from "@/services/cocktailService";
import type { Cocktail } from "@/api/cocktail";
import LoadingSpinner from "@/components/LoadingSpinner";
import React from "react";

// Cocktail glass images
const glassImages = {
	highball: "/highball-glass-icon.png",
	martini: "/classic-martini-icon.png",
	rocks: "/rocks-glass-icon.png",
	hurricane: "/hurricane-glass-icon.png",
	wine: "/elegant-wine-glass.png",
	flute: "/elegant-champagne-flute.png",
};

// 静态鸡尾酒图片映射
const staticCocktailImages = {
	mojito: "/cocktail-mojito.png",
	margarita: "/cocktail-margarita.png",
	cosmopolitan: "/cocktail-cosmopolitan.png",
};

export default function CocktailRecommendation() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const cocktailId = searchParams?.get("id");
	const { theme } = useTheme();
	const {
		recommendation: contextCocktail,
		userFeedback,
		imageData,
		isLoading: isContextLoading,
		isImageLoading,
		loadSavedData,
		startImagePolling,
	} = useCocktail();

	const [cocktail, setCocktail] = useState<Cocktail | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showShareTooltip, setShowShareTooltip] = useState(false);
	const [activeStep, setActiveStep] = useState<number | null>(null);

	// 使用useMemo优化计算属性
	const themeClasses = useMemo(
		() =>
			theme === "dark"
				? "bg-gradient-to-b from-gray-950 to-gray-900 text-white"
				: "bg-gradient-to-b from-amber-50 to-white text-gray-900",
		[theme]
	);

	const textColorClass = useMemo(() => (theme === "dark" ? "text-white" : "text-gray-900"), [theme]);
	const cardClasses = useMemo(
		() => (theme === "dark" ? "bg-white/10 text-white" : "bg-white/80 text-gray-900"),
		[theme]
	);
	const borderClasses = useMemo(() => (theme === "dark" ? "border-white/10" : "border-gray-200"), [theme]);

	const loadingOverlayClasses = theme === "dark" ? "bg-gray-800/50" : "bg-white/50";
	const tagClasses = theme === "dark" ? "bg-white/10 text-white" : "bg-white/90 text-gray-900";
	const toolCardClasses = theme === "dark" ? "bg-white/5 text-white" : "bg-white/90 text-gray-900";
	const buttonClasses = theme === "dark" ? "bg-white/5" : "bg-white/90";
	const borderColorClass = theme === "dark" ? "border-white/10" : "border-gray-200";

	// Get appropriate glass icon
	const getGlassIcon = (glassType: string) => {
		const lowerCaseType = glassType.toLowerCase();
		if (lowerCaseType.includes("highball") || lowerCaseType.includes("collins")) {
			return glassImages.highball;
		} else if (lowerCaseType.includes("martini") || lowerCaseType.includes("coupe")) {
			return glassImages.martini;
		} else if (lowerCaseType.includes("rocks") || lowerCaseType.includes("old fashioned")) {
			return glassImages.rocks;
		} else if (lowerCaseType.includes("hurricane") || lowerCaseType.includes("tiki")) {
			return glassImages.hurricane;
		} else if (lowerCaseType.includes("wine")) {
			return glassImages.wine;
		} else if (lowerCaseType.includes("flute") || lowerCaseType.includes("champagne")) {
			return glassImages.flute;
		}
		return glassImages.highball; // Default
	};

	// 获取静态鸡尾酒图片
	const getStaticCocktailImage = (id: string) => {
		return staticCocktailImages[id as keyof typeof staticCocktailImages] || "/vibrant-cocktail-closeup.png";
	};

	const handleBack = () => {
		router.push("/");
	};

	const handleTryAgain = () => {
		// 清除本地存储的答案，重新开始问题流程
		if (typeof window !== "undefined") {
			localStorage.removeItem("moodshaker-answers");
			localStorage.removeItem("moodshaker-feedback");
			localStorage.removeItem("moodshaker-recommendation");
			localStorage.removeItem("moodshaker-base-spirits");
		}
		router.push("/questions");
	};

	const handleShare = () => {
		if (navigator.share && cocktail) {
			navigator
				.share({
					title: `${cocktail.name} - MoodShaker`,
					text: `Check out this ${cocktail.name} cocktail recipe I found on MoodShaker!`,
					url: window.location.href,
				})
				.catch((error) => {
					console.error("Error sharing:", error);
					setShowShareTooltip(true);
					setTimeout(() => setShowShareTooltip(false), 3000);
				});
		} else {
			// Fallback for browsers that don't support navigator.share
			navigator.clipboard.writeText(window.location.href);
			setShowShareTooltip(true);
			setTimeout(() => setShowShareTooltip(false), 3000);
		}
	};

	const handleStepHover = (stepNumber: number) => {
		setActiveStep(stepNumber);
	};

	const handleStepLeave = () => {
		setActiveStep(null);
	};

	// 加载鸡尾酒数据
	useEffect(() => {
		if (cocktailId) {
			// 如果有ID参数，从服务加载鸡尾酒数据
			setIsLoading(true);
			getCocktailById(cocktailId)
				.then((data) => {
					if (data) {
						setCocktail(data);
					}
					setIsLoading(false);
				})
				.catch((error) => {
					console.error("Error fetching cocktail:", error);
					setIsLoading(false);
				});
		} else {
			// 否则使用上下文中的推荐
			loadSavedData();
			setCocktail(contextCocktail);

			// 开始轮询获取鸡尾酒图片
			if (contextCocktail && !imageData) {
				startImagePolling();
			}
		}
	}, [cocktailId, contextCocktail, imageData, loadSavedData, startImagePolling]);

	// 显示加载状态
	if ((cocktailId && isLoading) || (!cocktailId && isContextLoading)) {
		return (
			<div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${themeClasses}`}>
				<LoadingSpinner text="正在加载鸡尾酒信息..." />
			</div>
		);
	}

	// 如果没有找到鸡尾酒
	if (!cocktail) {
		return (
			<div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
				<div className="container mx-auto py-12">
					<div className="text-center py-12 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
						<h2 className={`text-2xl font-medium mb-4 ${textColorClass}`}>未找到鸡尾酒</h2>
						<p className="text-gray-300 mb-6">抱歉，我们无法找到您请求的鸡尾酒</p>
						<button
							onClick={handleBack}
							className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 border-0 text-white px-8 py-3 rounded-full shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-105 whitespace-nowrap"
						>
							返回首页
						</button>
					</div>
				</div>
			</div>
		);
	}

	// 提取CocktailImage组件
	const CocktailImage = React.memo(
		({
			cocktailId,
			imageData,
			cocktailName,
		}: {
			cocktailId?: string;
			imageData: string | null;
			cocktailName?: string;
		}) => {
			const getStaticCocktailImage = (id: string) => {
				return staticCocktailImages[id as keyof typeof staticCocktailImages] || "/vibrant-cocktail-closeup.png";
			};

			if (!cocktailId && imageData) {
				return (
					<img
						src={`data:image/jpeg;base64,${imageData}`}
						alt={cocktailName ?? "Cocktail image"}
						className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
						loading="lazy"
					/>
				);
			}

			return (
				<img
					src={cocktailId ? getStaticCocktailImage(cocktailId) : "/vibrant-cocktail-closeup.png"}
					alt={cocktailName ?? "Cocktail image"}
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
					loading="lazy"
					onError={(e) => {
						e.currentTarget.src = `/placeholder.svg?height=500&width=800&query=${encodeURIComponent(
							cocktailName || "cocktail"
						)}`;
					}}
				/>
			);
		}
	);
	CocktailImage.displayName = "CocktailImage";

	return (
		<div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
			{/* Enhanced background effects */}
			<div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
				<div
					className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-500 rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: "8s" }}
				></div>
				<div
					className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: "10s", animationDelay: "1.5s" }}
				></div>
				<div
					className="absolute top-2/3 right-1/3 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: "12s", animationDelay: "3s" }}
				></div>
			</div>

			<div className="container mx-auto py-12 px-4 relative">
				<button
					className={`mb-8 flex items-center hover:bg-white/10 px-4 py-2 rounded-full transition-colors duration-300 group ${textColorClass}`}
					onClick={handleBack}
				>
					<ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-4px] transition-transform" /> 返回首页
				</button>

				<div
					className={
						!cocktailId && userFeedback
							? `mb-8 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl transition-colors duration-300 ${cardClasses}`
							: "hidden"
					}
				>
					<div className="p-6 bg-gradient-to-r from-amber-500/10 to-pink-500/10">
						<h3 className={`text-lg font-bold mb-2 ${textColorClass}`}>您的需求</h3>
						<p className="text-gray-300">{userFeedback}</p>
					</div>
				</div>

				<div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto">
					<div className="transition-all duration-500 transform translate-x-0 opacity-100">
						<div
							className={`rounded-2xl overflow-hidden shadow-2xl border transition-colors duration-300 group ${borderClasses} relative aspect-video`}
						>
							<div
								className={
									!cocktailId && isImageLoading
										? `absolute inset-0 flex items-center justify-center backdrop-blur-sm transition-colors duration-300 ${loadingOverlayClasses}`
										: "hidden"
								}
							>
								<div className="text-center">
									<div className="relative w-12 h-12 mx-auto mb-4">
										<div className="absolute inset-0 rounded-full border-4 border-amber-500/20"></div>
										<div className="absolute inset-0 rounded-full border-4 border-b-amber-500 border-r-pink-500 border-t-transparent border-l-transparent animate-spin"></div>
									</div>
									<p className="text-gray-300 font-medium">正在生成鸡尾酒图片...</p>
								</div>
							</div>
							<CocktailImage cocktailId={cocktailId} imageData={imageData} cocktailName={cocktail?.name} />
						</div>

						<div className="mt-8 text-center">
							<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent inline-block">
								{cocktail?.name}
							</h1>
							{cocktail?.english_name && <p className="text-gray-400 text-lg">{cocktail.english_name}</p>}
						</div>

						{/* Share button */}
						<div className="mt-4 flex justify-center">
							<button
								onClick={handleShare}
								className="relative flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
							>
								<Share2 className="h-4 w-4" />
								<span>分享配方</span>

								{/* Tooltip */}
								<div
									className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg transition-opacity duration-300 whitespace-nowrap ${
										showShareTooltip ? "opacity-100" : "opacity-0 pointer-events-none"
									}`}
								>
									链接已复制到剪贴板
								</div>
							</button>
						</div>
					</div>

					<div className="transition-all duration-500 transform translate-x-0 opacity-100">
						<p className="text-gray-300 mb-6 italic text-lg leading-relaxed">{cocktail?.description}</p>

						{!cocktailId && cocktail?.match_reason && (
							<div
								className={`mb-6 p-5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl transition-colors duration-300 ${cardClasses}`}
							>
								<h3 className="text-lg font-medium mb-3 text-amber-400">推荐理由</h3>
								<p className="text-gray-300 leading-relaxed">{cocktail.match_reason}</p>
							</div>
						)}

						<div className="flex flex-wrap gap-4 mb-6">
							{cocktail?.time_required && (
								<div
									className={`flex items-center backdrop-blur-sm p-3 rounded-full border border-white/10 transition-colors duration-300 hover:bg-white/5 whitespace-nowrap ${cardClasses}`}
								>
									<Clock className="mr-2 h-5 w-5 text-amber-500" />
									<span className={textColorClass}>{cocktail.time_required}</span>
								</div>
							)}
							<div
								className={`flex items-center backdrop-blur-sm p-3 rounded-full border border-white/10 transition-colors duration-300 hover:bg-white/5 whitespace-nowrap ${cardClasses}`}
							>
								<Beaker className="mr-2 h-5 w-5 text-pink-500" />
								<span className={textColorClass}>基酒: {cocktail?.base_spirit}</span>
							</div>
							<div
								className={`flex items-center backdrop-blur-sm p-3 rounded-full border border-white/10 transition-colors duration-300 hover:bg-white/5 whitespace-nowrap ${cardClasses}`}
							>
								<Droplet className="mr-2 h-5 w-5 text-blue-500" />
								<span className={textColorClass}>酒精度: {cocktail?.alcohol_level}</span>
							</div>
							<div
								className={`flex items-center backdrop-blur-sm p-3 rounded-full border border-white/10 transition-colors duration-300 hover:bg-white/5 whitespace-nowrap ${cardClasses}`}
							>
								<img
									src={getGlassIcon(cocktail?.serving_glass || "highball")}
									alt="Glass type"
									className="mr-2 h-5 w-5"
								/>
								<span className={textColorClass}>酒杯: {cocktail?.serving_glass}</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-2 mb-6">
							{cocktail?.flavor_profiles?.map((flavor, index) => (
								<span
									key={index}
									className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm border border-white/10 transition-colors duration-300 hover:bg-white/5 whitespace-nowrap ${tagClasses}`}
								>
									{flavor}
								</span>
							))}
						</div>

						<div
							className={`mb-6 backdrop-blur-sm border border-white/10 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300 ${cardClasses}`}
						>
							<div className="p-6 bg-gradient-to-r from-amber-500/20 to-pink-500/20">
								<h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>配料</h3>
								<p className="text-gray-300">准备以下材料</p>
							</div>
							<div className="p-6">
								<ul className="space-y-3">
									{cocktail?.ingredients?.map((ingredient, index) => (
										<li
											key={index}
											className={`flex justify-between py-2 border-b transition-colors duration-300 ${borderColorClass}`}
										>
											<span className={`${textColorClass} font-medium`}>{ingredient.name}</span>
											<span className="text-amber-400 font-medium">
												{ingredient.amount}
												{ingredient.unit ? ` ${ingredient.unit}` : ""}
											</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div
							className={`mb-6 backdrop-blur-sm border border-white/10 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300 ${cardClasses}`}
						>
							<div className="p-6 bg-gradient-to-r from-pink-500/20 to-amber-500/20">
								<h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>工具</h3>
								<p className="text-gray-300">您需要的调酒工具</p>
							</div>
							<div className="p-6">
								<ul className="grid grid-cols-2 gap-3">
									{cocktail?.tools?.map((tool, index) => (
										<li
											key={index}
											className={`backdrop-blur-sm p-3 rounded-2xl border border-white/10 transition-colors duration-300 hover:bg-white/5 ${toolCardClasses}`}
										>
											<span className={`${textColorClass} font-medium`}>{tool.name}</span>
											{tool.alternative && (
												<span className="block text-sm text-gray-400 mt-1">替代品: {tool.alternative}</span>
											)}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div
					className={
						cocktail?.steps
							? `mt-10 backdrop-blur-sm border border-white/10 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300 max-w-6xl mx-auto ${cardClasses}`
							: "hidden"
					}
				>
					<div className="p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20">
						<h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>制作步骤</h3>
						<p className="text-gray-300">按照以下步骤制作您的鸡尾酒</p>
					</div>
					<div className="p-6">
						<ol className="space-y-6">
							{cocktail?.steps?.map((step) => (
								<li
									key={step.step_number}
									className="flex"
									onMouseEnter={() => handleStepHover(step.step_number)}
									onMouseLeave={handleStepLeave}
								>
									<span
										className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg transition-transform duration-300 ${
											activeStep === step.step_number ? "scale-110" : ""
										}`}
									>
										{step.step_number}
									</span>
									<div className="flex-1 pt-1">
										<p className={`text-lg ${textColorClass}`}>{step.description}</p>
										{step.tips && <p className="text-sm text-amber-400 mt-2 italic">提示: {step.tips}</p>}
									</div>
								</li>
							))}
						</ol>
					</div>
				</div>

				<div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={handleBack}
						className={`flex items-center backdrop-blur-sm hover:bg-white/10 border border-white/20 rounded-full transition-all duration-300 group whitespace-nowrap ${textColorClass} ${buttonClasses} px-6 py-3`}
					>
						<ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-[-4px] transition-transform" /> 返回首页
					</button>
					{!cocktailId && (
						<button
							onClick={handleTryAgain}
							className="flex items-center bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 border-0 text-white shadow-lg shadow-pink-500/20 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 whitespace-nowrap"
						>
							<RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" /> 重新选择
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
