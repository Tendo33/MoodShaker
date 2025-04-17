import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";

// 确保使用正确的后端地址
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
console.log("API基础URL:", baseURL);

const request = axios.create({
	baseURL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// 请求拦截器
request.interceptors.request.use(
	(config) => {
		console.log("发送请求:", {
			url: config.url,
			method: config.method,
			baseURL: config.baseURL,
			data: config.data,
			headers: config.headers
		});
		// 添加token
		const userStore = useUserStore();
		if (userStore.token) {
			config.headers.Authorization = `Bearer ${userStore.token}`;
		}
		return config;
	},
	(error) => {
		console.error("请求配置错误:", error);
		return Promise.reject(error);
	}
);

// 响应拦截器
request.interceptors.response.use(
	(response) => {
		console.log("收到响应:", {
			status: response.status,
			statusText: response.statusText,
			data: response.data,
			headers: response.headers
		});
		return response.data;
	},
	(error) => {
		console.error("响应错误:", {
			message: error.message,
			response: error.response,
			request: error.request,
			config: error.config
		});

		// 处理401错误
		if (error.response?.status === 401) {
			const userStore = useUserStore();
			userStore.clearUserInfo();
			ElMessage.error('登录已过期，请重新登录');
		} else if (error.code === 'ECONNABORTED') {
			ElMessage.error('请求超时，请稍后重试');
		} else if (!error.response) {
			ElMessage.error('网络错误，请检查网络连接');
		} else {
			ElMessage.error(error.response?.data?.message || "请求失败");
		}
		return Promise.reject(error);
	}
);

export default request;
