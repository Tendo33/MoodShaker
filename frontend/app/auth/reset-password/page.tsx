"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

enum ResetStep {
	REQUEST = "request",
	CONFIRMATION = "confirmation",
	ERROR = "error",
}

export default function ResetPasswordPage() {
	const [email, setEmail] = useState("");
	const [step, setStep] = useState<ResetStep>(ResetStep.REQUEST);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// 这里应该调用实际的密码重置API
			// 模拟API调用
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// 假设API调用成功
			setStep(ResetStep.CONFIRMATION);
		} catch (err) {
			console.error("Password reset request failed:", err);
			setError("发送重置邮件失败，请稍后再试");
			setStep(ResetStep.ERROR);
		} finally {
			setLoading(false);
		}
	};

	const handleTryAgain = () => {
		setStep(ResetStep.REQUEST);
		setError(null);
	};

	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			{/* 左侧图片区域 */}
			<div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-amber-500 to-pink-500 relative overflow-hidden">
				<div className="absolute inset-0 bg-black/20 z-10"></div>
				<div className="absolute inset-0 flex items-center justify-center z-20">
					<div className="text-center text-white p-8">
						<h1 className="text-4xl font-bold mb-6">MoodShaker</h1>
						<p className="text-xl max-w-md mx-auto opacity-90">找到适合您心情的鸡尾酒，让每一次品尝都成为难忘的体验</p>
					</div>
				</div>
				<div className="absolute inset-0 z-0">
					<Image
						src="/vibrant-cocktail-mix.png"
						alt="Cocktail background"
						fill
						style={{ objectFit: "cover" }}
						priority
					/>
				</div>
			</div>

			{/* 右侧表单区域 */}
			<div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-white dark:bg-gray-900">
				{/* 移动端标题 */}
				<div className="md:hidden text-center mb-8">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
						MoodShaker
					</h1>
					<p className="text-gray-500 dark:text-gray-400 mt-2">找到适合您心情的鸡尾酒</p>
				</div>

				<div className="w-full max-w-md">
					<Link
						href="/auth/login"
						className="inline-flex items-center text-sm font-medium text-amber-500 hover:text-amber-600 mb-6"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						返回登录
					</Link>

					{step === ResetStep.REQUEST && (
						<>
							<h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">重置密码</h2>
							<p className="text-gray-600 dark:text-gray-400 mb-6">请输入您的电子邮箱，我们将向您发送密码重置链接</p>

							<form onSubmit={handleSubmit}>
								<div className="space-y-5">
									<div className="relative">
										<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
											<Mail className="h-5 w-5 text-gray-400" />
										</div>
										<input
											type="email"
											id="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 p-3"
											placeholder="您的电子邮箱"
											required
										/>
									</div>

									{error && (
										<div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
											{error}
										</div>
									)}

									<button
										type="submit"
										disabled={loading}
										className="w-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-medium rounded-lg text-sm px-5 py-3.5 transition-all duration-300 disabled:opacity-70"
									>
										{loading ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												发送中...
											</>
										) : (
											"发送重置链接"
										)}
									</button>
								</div>
							</form>
						</>
					)}

					{step === ResetStep.CONFIRMATION && (
						<div className="text-center">
							<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
								<CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400" />
							</div>
							<h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">邮件已发送</h2>
							<p className="text-gray-600 dark:text-gray-400 mb-6">
								我们已向 <span className="font-medium text-gray-900 dark:text-white">{email}</span> 发送了密码重置链接。
								请检查您的邮箱，并按照邮件中的指示重置密码。
							</p>
							<p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
								如果您没有收到邮件，请检查垃圾邮件文件夹，或
								<button onClick={handleSubmit} className="text-amber-500 hover:text-amber-600 font-medium ml-1">
									重新发送
								</button>
							</p>
							<Link
								href="/auth/login"
								className="inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg text-sm px-5 py-3 transition-all duration-300"
							>
								返回登录
							</Link>
						</div>
					)}

					{step === ResetStep.ERROR && (
						<div className="text-center">
							<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
								<AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
							</div>
							<h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">发送失败</h2>
							<p className="text-gray-600 dark:text-gray-400 mb-6">{error || "发送重置邮件时出现问题，请稍后再试。"}</p>
							<button
								onClick={handleTryAgain}
								className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-medium rounded-lg text-sm px-5 py-3.5 transition-all duration-300"
							>
								重试
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
