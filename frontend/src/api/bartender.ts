import request from "@/utils/request";

interface ChatRequest {
	message: string;
	user_id?: string;
	session_id?: string;
	model?: string;
	stream?: boolean;
}

interface CocktailIngredient {
	name: string;
	amount: string;
}

interface Cocktail {
	name: string;
	image: string;
	ingredients: CocktailIngredient[];
	instructions: string[];
}

interface ChatResponse {
	content: string;
	cocktail?: Cocktail;
}

export const chatWithBartender = async (data: ChatRequest): Promise<ChatResponse> => {
	try {
		console.log("开始调用调酒师助手API，请求数据:", {
			...data,
			model: "deepseek-v3-250324",
			stream: false
		});

		const response = await request<ChatResponse>({
			url: "/api/v1/agents/bartender/runs",
			method: "post",
			data: {
				...data,
				model: "deepseek-v3-250324",
				stream: false
			},
		});

		console.log("调酒师助手API响应:", response);

		if (!response || !response.data) {
			throw new Error("API响应格式错误");
		}

		return response.data;
	} catch (error: any) {
		console.error("调酒师助手API调用失败，详细错误信息:", {
			message: error.message,
			response: error.response,
			request: error.request,
			config: error.config
		});

		// 根据错误类型提供更具体的错误信息
		if (error.response) {
			// 服务器返回了错误状态码
			console.error("服务器错误:", {
				status: error.response.status,
				statusText: error.response.statusText,
				data: error.response.data
			});
		} else if (error.request) {
			// 请求已发出但没有收到响应
			console.error("网络错误: 请求已发出但没有收到响应");
		} else {
			// 请求配置出错
			console.error("请求配置错误:", error.message);
		}

		throw error;
	}
};
