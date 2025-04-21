import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// 创建axios实例
const http: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 1000000,
	headers: {
		"Content-Type": "application/json",
	},
});

// 请求拦截器
http.interceptors.request.use(
	(config) => {
		// 这里可以添加token等认证信息
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 响应拦截器
http.interceptors.response.use(
	(response: AxiosResponse) => {
		return response.data;
	},
	(error) => {
		// 这里可以统一处理错误
		return Promise.reject(error);
	}
);

export { http };
