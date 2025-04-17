import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserInfo } from "@/api/user";
import type { UserInfo } from "@/api/user";

export const useUserStore = defineStore("user", () => {
	const userInfo = ref<UserInfo | null>(null);
	const token = ref<string>(localStorage.getItem('token') || '');
	const sessionId = ref<string>(localStorage.getItem('sessionId') || '');

	// 设置用户信息
	const setUserInfo = (info: UserInfo) => {
		userInfo.value = info;
		localStorage.setItem('userInfo', JSON.stringify(info));
	};

	// 设置token
	const setToken = (newToken: string) => {
		token.value = newToken;
		localStorage.setItem('token', newToken);
	};

	// 设置会话ID
	const setSessionId = (id: string) => {
		sessionId.value = id;
		localStorage.setItem('sessionId', id);
	};

	// 获取用户信息
	const fetchUserInfo = async (username: string) => {
		try {
			const res = await getUserInfo(username);
			userInfo.value = res.data;
			localStorage.setItem('userInfo', JSON.stringify(res.data));
		} catch (error) {
			console.error("获取用户信息失败:", error);
		}
	};

	// 清除用户信息
	const clearUserInfo = () => {
		userInfo.value = null;
		token.value = "";
		sessionId.value = "";
		localStorage.removeItem('userInfo');
		localStorage.removeItem('token');
		localStorage.removeItem('sessionId');
	};

	// 初始化用户信息
	const initUserInfo = () => {
		const storedUserInfo = localStorage.getItem('userInfo');
		if (storedUserInfo) {
			userInfo.value = JSON.parse(storedUserInfo);
		}
		const storedSessionId = localStorage.getItem('sessionId');
		if (storedSessionId) {
			sessionId.value = storedSessionId;
		}
	};

	// 初始化
	initUserInfo();

	return {
		userInfo,
		token,
		sessionId,
		setUserInfo,
		setToken,
		setSessionId,
		fetchUserInfo,
		clearUserInfo
	};
});
