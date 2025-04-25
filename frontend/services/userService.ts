import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface User {
	id: number;
	username: string;
	email: string;
	phone?: string;
	avatar?: string;
	status: number;
	role: "user" | "admin";
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface RegisterData {
	username: string;
	password: string;
	email: string;
	phone?: string;
}

export interface UpdateUserData {
	email?: string;
	phone?: string;
	avatar?: string;
}

export interface ResetPasswordData {
	old_password: string;
	new_password: string;
}

export interface RequestPasswordResetData {
	email: string;
}

class UserService {
	private static instance: UserService;
	private token: string | null = null;
	private cache: Map<string, { data: any; timestamp: number }> = new Map();
	private readonly CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存过期时间

	private constructor() {
		// 从localStorage获取token
		this.token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

		// 添加请求拦截器
		axios.interceptors.response.use(
			(response) => response,
			(error) => {
				// 处理401错误（未授权）
				if (error.response && error.response.status === 401) {
					this.clearToken();
					// 如果在浏览器环境，重定向到登录页
					if (typeof window !== "undefined") {
						window.location.href = "/auth/login";
					}
				}

				// 处理网络错误
				if (error.message === "Network Error") {
					console.error("网络连接失败，请检查您的网络连接");
				}

				return Promise.reject(error);
			}
		);
	}

	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	private getHeaders() {
		return {
			Authorization: this.token ? `Bearer ${this.token}` : "",
		};
	}

	public setToken(token: string) {
		this.token = token;
		if (typeof window !== "undefined") {
			localStorage.setItem("token", token);
		}
	}

	private getCachedData(key: string) {
		const cachedItem = this.cache.get(key);
		if (cachedItem && Date.now() - cachedItem.timestamp < this.CACHE_TTL) {
			return cachedItem.data;
		}
		return null;
	}

	private setCachedData(key: string, data: any) {
		this.cache.set(key, { data, timestamp: Date.now() });
	}

	private clearCache() {
		this.cache.clear();
	}

	public clearToken() {
		this.token = null;
		this.clearCache();
		if (typeof window !== "undefined") {
			localStorage.removeItem("token");
		}
	}

	public async login(credentials: LoginCredentials) {
		const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
		const { token } = response.data;
		this.setToken(token);
		return response.data;
	}

	public async register(data: RegisterData) {
		const response = await axios.post(`${API_BASE_URL}/register`, data);
		return response.data;
	}

	public async getUserInfo(username: string) {
		const cacheKey = `user_${username}`;
		const cachedData = this.getCachedData(cacheKey);

		if (cachedData) {
			return cachedData;
		}

		const response = await axios.get(`${API_BASE_URL}/${username}`, {
			headers: this.getHeaders(),
		});

		this.setCachedData(cacheKey, response.data);
		return response.data;
	}

	public async updateUser(username: string, data: UpdateUserData) {
		const response = await axios.put(`${API_BASE_URL}/${username}`, data, {
			headers: this.getHeaders(),
		});

		// 更新用户信息后清除该用户的缓存
		this.cache.delete(`user_${username}`);

		return response.data;
	}

	public async updateAvatar(username: string, avatar: string) {
		const response = await axios.put(
			`${API_BASE_URL}/${username}/avatar`,
			{ avatar },
			{
				headers: this.getHeaders(),
			}
		);
		return response.data;
	}

	public async resetPassword(data: ResetPasswordData) {
		const response = await axios.post(`${API_BASE_URL}/password/reset`, data, {
			headers: this.getHeaders(),
		});
		return response.data;
	}

	public async requestPasswordReset(email: string) {
		const response = await axios.post(`${API_BASE_URL}/password/request-reset`, { email });
		return response.data;
	}

	public async getAllUsers(params?: {
		username?: string;
		phone?: string;
		status?: number;
		page?: number;
		pageSize?: number;
	}) {
		const response = await axios.get(`${API_BASE_URL}`, {
			params,
			headers: this.getHeaders(),
		});
		return response.data;
	}

	public async deleteUser(username: string) {
		const response = await axios.delete(`${API_BASE_URL}/${username}`, {
			headers: this.getHeaders(),
		});
		return response.data;
	}

	// 批量获取用户信息
	public async getUsersInfo(usernames: string[]) {
		// 首先检查缓存
		const result: Record<string, any> = {};
		const uncachedUsernames: string[] = [];

		usernames.forEach((username) => {
			const cachedData = this.getCachedData(`user_${username}`);
			if (cachedData) {
				result[username] = cachedData;
			} else {
				uncachedUsernames.push(username);
			}
		});

		// 如果所有用户都在缓存中，直接返回
		if (uncachedUsernames.length === 0) {
			return result;
		}

		// 否则请求未缓存的用户
		const response = await axios.post(
			`${API_BASE_URL}/batch-users`,
			{
				usernames: uncachedUsernames,
			},
			{
				headers: this.getHeaders(),
			}
		);

		// 更新缓存并合并结果
		response.data.forEach((userData: any) => {
			const username = userData.username;
			this.setCachedData(`user_${username}`, userData);
			result[username] = userData;
		});

		return result;
	}
}

export const userService = UserService.getInstance();
