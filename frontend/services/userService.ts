import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

class UserService {
	private static instance: UserService;
	private token: string | null = null;

	private constructor() {
		// 从localStorage获取token
		this.token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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

	public clearToken() {
		this.token = null;
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
		const response = await axios.get(`${API_BASE_URL}/${username}`, {
			headers: this.getHeaders(),
		});
		return response.data;
	}

	public async updateUser(username: string, data: UpdateUserData) {
		const response = await axios.put(`${API_BASE_URL}/${username}`, data, {
			headers: this.getHeaders(),
		});
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
}

export const userService = UserService.getInstance();
