"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type User, userService } from "@/services/userService";

interface UserContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (username: string, password: string) => Promise<void>;
	register: (username: string, password: string, email: string, phone?: string) => Promise<void>;
	logout: () => void;
	updateUser: (data: Partial<User>) => Promise<void>;
	updateAvatar: (avatar: string) => Promise<void>;
	resetPassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		// 检查用户是否已登录
		const checkAuth = async () => {
			try {
				const token = localStorage.getItem("token");
				if (token) {
					// 如果有token，获取用户信息
					const response = await userService.getUserInfo("me");
					setUser(response.data);
				}
			} catch (err) {
				console.error("Auth check failed:", err);
				userService.clearToken();
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (username: string, password: string) => {
		try {
			setLoading(true);
			setError(null);
			const response = await userService.login({ username, password });
			setUser(response.data);
			router.push("/profile");
		} catch (err: any) {
			setError(err.response?.data?.message || "登录失败");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const register = async (username: string, password: string, email: string, phone?: string) => {
		try {
			setLoading(true);
			setError(null);
			await userService.register({ username, password, email, phone });
			router.push("/auth/login");
		} catch (err: any) {
			setError(err.response?.data?.message || "注册失败");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		userService.clearToken();
		setUser(null);
		router.push("/auth/login");
	};

	const updateUser = async (data: Partial<User>) => {
		try {
			setLoading(true);
			setError(null);
			if (!user) throw new Error("用户未登录");
			const response = await userService.updateUser(user.username, data);
			setUser(response.data);
		} catch (err: any) {
			setError(err.response?.data?.message || "更新用户信息失败");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateAvatar = async (avatar: string) => {
		try {
			setLoading(true);
			setError(null);
			if (!user) throw new Error("用户未登录");
			const response = await userService.updateAvatar(user.username, avatar);
			setUser(response.data);
		} catch (err: any) {
			setError(err.response?.data?.message || "更新头像失败");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const resetPassword = async (oldPassword: string, newPassword: string) => {
		try {
			setLoading(true);
			setError(null);
			await userService.resetPassword({ old_password: oldPassword, new_password: newPassword });
		} catch (err: any) {
			setError(err.response?.data?.message || "重置密码失败");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return (
		<UserContext.Provider
			value={{
				user,
				loading,
				error,
				login,
				register,
				logout,
				updateUser,
				updateAvatar,
				resetPassword,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
