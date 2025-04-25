"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { User, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import { FormInput, PasswordInput, LoadingButton } from "@/components/ui/FormElements";

// 社交登录按钮组件
const SocialLoginButton = ({ icon, alt }: { icon: string; alt: string }) => (
	<button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
		<img src={icon || "/placeholder.svg"} alt={alt} className="h-5 w-5" />
	</button>
);

// 标签切换按钮组件
const TabButton = ({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) => (
	<button
		onClick={onClick}
		className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
			active
				? "bg-white dark:bg-gray-700 shadow-sm text-amber-500 dark:text-amber-400"
				: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
		}`}
	>
		{children}
	</button>
);

export default function LoginPage() {
	const [activeTab, setActiveTab] = useState<"login" | "register">("login");
	const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});
	const [registerData, setRegisterData] = useState({
		username: "",
		inviteCode: "",
		email: "",
		password: "",
	});
	const [showLoginPassword, setShowLoginPassword] = useState(false);
	const [showRegisterPassword, setShowRegisterPassword] = useState(false);
	const { login, register, loading, error, isAuthenticated } = useAuth();
	const router = useRouter();

	// 如果用户已登录，重定向到个人资料页面
	useEffect(() => {
		if (isAuthenticated) {
			router.push("/profile");
		}
	}, [isAuthenticated, router]);

	// 处理登录表单提交
	const handleLoginSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(loginData.username, loginData.password);
		} catch (err) {
			console.error("Login failed:", err);
		}
	};

	// 处理注册表单提交
	const handleRegisterSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await register(registerData.username, registerData.password, registerData.email);
		} catch (err) {
			console.error("Registration failed:", err);
		}
	};

	// 切换登录/注册视图
	const toggleView = (view: "login" | "register") => {
		setActiveTab(view);
	};

	// 使用useMemo优化计算属性
	const loginFormValid = useMemo(
		() => loginData.username.trim() !== "" && loginData.password.trim() !== "",
		[loginData.username, loginData.password]
	);

	const registerFormValid = useMemo(
		() =>
			registerData.username.trim() !== "" && registerData.email.trim() !== "" && registerData.password.trim() !== "",
		[registerData.username, registerData.email, registerData.password]
	);

	// 登录表单
	const renderLoginForm = () => (
		<form onSubmit={handleLoginSubmit}>
			<div className="space-y-5">
				<FormInput
					icon={User}
					id="login-username"
					value={loginData.username}
					onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
					placeholder="用户名"
					required
				/>

				<PasswordInput
					id="login-password"
					value={loginData.password}
					onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
					placeholder="密码"
				/>

				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
						/>
						<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
							记住我
						</label>
					</div>

					<Link
						href="/auth/reset-password"
						className="text-sm font-medium text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
					>
						忘记密码?
					</Link>
				</div>

				{error && (
					<div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
						{error}
					</div>
				)}

				<LoadingButton loading={loading} disabled={!loginFormValid} icon={<ArrowRight className="h-4 w-4" />}>
					登录
				</LoadingButton>
			</div>
		</form>
	);

	// 注册表单
	const renderRegisterForm = () => (
		<form onSubmit={handleRegisterSubmit}>
			<div className="space-y-5">
				<div className="grid grid-cols-2 gap-4">
					<FormInput
						icon={User}
						id="register-username"
						value={registerData.username}
						onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
						placeholder="用户名"
						required
					/>

					<FormInput
						id="register-invite"
						value={registerData.inviteCode}
						onChange={(e) => setRegisterData({ ...registerData, inviteCode: e.target.value })}
						placeholder="邀请码（选填）"
					/>
				</div>

				<FormInput
					icon={Mail}
					id="register-email"
					type="email"
					value={registerData.email}
					onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
					placeholder="电子邮箱"
					required
				/>

				<PasswordInput
					id="register-password"
					value={registerData.password}
					onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
					placeholder="密码"
				/>

				<div className="flex items-center">
					<input
						id="terms"
						name="terms"
						type="checkbox"
						className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
						required
					/>
					<label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
						我已阅读并同意{" "}
						<a href="#" className="text-amber-500 hover:text-amber-600">
							服务条款
						</a>{" "}
						和{" "}
						<a href="#" className="text-amber-500 hover:text-amber-600">
							隐私政策
						</a>
					</label>
				</div>

				{error && (
					<div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
						{error}
					</div>
				)}

				<LoadingButton loading={loading} disabled={!registerFormValid} icon={<ArrowRight className="h-4 w-4" />}>
					创建账号
				</LoadingButton>
			</div>
		</form>
	);

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
					{/* 标签切换 */}
					<div className="flex mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
						<TabButton active={activeTab === "login"} onClick={() => toggleView("login")}>
							登录
						</TabButton>
						<TabButton active={activeTab === "register"} onClick={() => toggleView("register")}>
							注册
						</TabButton>
					</div>

					{/* 登录表单 */}
					<div className={`transition-all duration-300 ${activeTab === "login" ? "block" : "hidden"}`}>
						<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">欢迎回来</h2>
						{renderLoginForm()}

						<div className="mt-8">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">其他登录方式</span>
								</div>
							</div>

							<div className="mt-6 grid grid-cols-3 gap-3">
								<SocialLoginButton icon="/stylized-qq-icon.png" alt="QQ" />
								<SocialLoginButton icon="/chat-bubbles-communication.png" alt="WeChat" />
								<SocialLoginButton icon="/classic-phone-icon.png" alt="Phone" />
							</div>
						</div>
					</div>

					{/* 注册表单 */}
					<div className={`transition-all duration-300 ${activeTab === "register" ? "block" : "hidden"}`}>
						<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">创建新账号</h2>
						{renderRegisterForm()}
					</div>
				</div>
			</div>
		</div>
	);
}
