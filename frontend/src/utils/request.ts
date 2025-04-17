import axios from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
	timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
	(config) => {
		// 在这里可以添加token等认证信息
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 响应拦截器
request.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		ElMessage.error(error.response?.data?.message || "请求失败");
		return Promise.reject(error);
	}
);

export default request;
