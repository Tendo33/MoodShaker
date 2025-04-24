"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ApiDebugger() {
	const { theme } = useTheme();
	const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error">("checking");
	const [apiUrl, setApiUrl] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// 检查API连接状态
		const checkApiConnection = async () => {
			try {
				// 获取API URL
				const url = process.env.NEXT_PUBLIC_API_BASE_URL || "未配置";
				setApiUrl(url);

				if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
					setApiStatus("error");
					setErrorMessage("API_BASE_URL环境变量未配置");
					return;
				}

				// 尝试连接API
				const response = await fetch("/api/proxy?url=" + encodeURIComponent(process.env.NEXT_PUBLIC_API_BASE_URL + "/health"));

				if (response.ok) {
					setApiStatus("connected");
				} else {
					setApiStatus("error");
					setErrorMessage(`API返回状态码: ${response.status}`);
				}
			} catch (error) {
				setApiStatus("error");
				setErrorMessage(`连接API时出错: ${error instanceof Error ? error.message : "未知错误"}`);
			}
		};

		checkApiConnection();
	}, []);

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	// 如果不是开发环境，不显示调试器
	if (process.env.NODE_ENV === "production") {
		return null;
	}

	return (
		<div className="fixed bottom-4 right-4 z-50">
			<button
				onClick={toggleVisibility}
				className={`flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg ${
					apiStatus === "connected"
						? "bg-green-500 text-white"
						: apiStatus === "error"
						? "bg-red-500 text-white"
						: "bg-yellow-500 text-white"
				}`}
			>
				<div
					className={`w-3 h-3 rounded-full ${
						apiStatus === "connected"
							? "bg-green-200"
							: apiStatus === "error"
							? "bg-red-200"
							: "bg-yellow-200 animate-pulse"
					}`}
				></div>
				<span>API状态</span>
			</button>

			{isVisible && (
				<div
					className={`mt-2 p-4 rounded-lg shadow-lg ${
						theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
					}`}
				>
					<h3 className="font-bold mb-2">API调试信息</h3>
					<div className="space-y-2">
						<div>
							<span className="font-medium">API URL:</span> {apiUrl}
						</div>
						<div>
							<span className="font-medium">状态:</span>{" "}
							{apiStatus === "connected" ? "已连接" : apiStatus === "error" ? "错误" : "检查中"}
						</div>
						{apiStatus === "error" && (
							<div>
								<span className="font-medium">错误:</span> {errorMessage}
							</div>
						)}
						<div className="text-xs mt-4">
							<p>注意: 此调试器仅在开发环境中可见</p>
							<p>如果API未连接，系统将使用模拟数据</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
