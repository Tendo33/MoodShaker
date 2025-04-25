"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

export function useAuth() {
	const { user, loading, error, login, register, logout, updateUser, updateAvatar, resetPassword } = useUser();
	const router = useRouter();
	const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);

	const isAuthenticated = !!user;
	const isAdmin = user?.role === "admin";

	// 检查token是否过期
	useEffect(() => {
		if (typeof window !== "undefined") {
			// 获取token过期时间
			const expiration = localStorage.getItem("token_expiration");
			if (expiration) {
				setTokenExpiration(Number.parseInt(expiration, 10));
			}

			// 设置定时检查
			const checkInterval = setInterval(() => {
				const expiration = localStorage.getItem("token_expiration");
				if (expiration) {
					const expirationTime = Number.parseInt(expiration, 10);
					// 如果token已过期或即将过期（5分钟内），则登出
					if (Date.now() >= expirationTime - 5 * 60 * 1000) {
						logout();
						router.push("/auth/login?expired=true");
						clearInterval(checkInterval);
					}
				}
			}, 60 * 1000); // 每分钟检查一次

			return () => clearInterval(checkInterval);
		}
	}, [logout, router]);

	const requireAuth = () => {
		if (!loading && !isAuthenticated) {
			router.push("/auth/login");
			return false;
		}
		return true;
	};

	const requireAdmin = () => {
		if (!loading && (!isAuthenticated || !isAdmin)) {
			router.push("/");
			return false;
		}
		return true;
	};

	// 增强版登录函数，保存token过期时间
	const enhancedLogin = async (username: string, password: string) => {
		try {
			const result = await login(username, password);
			// 假设token有效期为24小时
			const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
			localStorage.setItem("token_expiration", expirationTime.toString());
			setTokenExpiration(expirationTime);
			return result;
		} catch (error) {
			throw error;
		}
	};

	return {
		user,
		loading,
		error,
		isAuthenticated,
		isAdmin,
		login: enhancedLogin,
		register,
		logout,
		updateUser,
		updateAvatar,
		resetPassword,
		requireAuth,
		requireAdmin,
		tokenExpiration,
	};
}
