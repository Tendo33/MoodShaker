import request from "@/utils/request";
import { useUserStore } from "@/stores/user";

interface ChatRequest {
	message: string;
	user_id?: string;
	session_id?: string;
	model?: string;
	stream?: boolean;
}

export interface CocktailIngredient {
	name: string;
	amount: string;
}

export interface Cocktail {
	name: string;
	image: string;
	ingredients: CocktailIngredient[];
	instructions: string[];
}

interface ChatResponse {
	content: string;
	cocktail?: Cocktail;
	timestamp: string;
}

export const chatWithBartender = async (data: ChatRequest): Promise<ChatResponse> => {
	try {
		const userStore = useUserStore();
		const sessionId = userStore.sessionId || 'guest';
		const userId = userStore.userInfo?.id?.toString() || 'guest';

		const requestData = {
			...data,
			model: "deepseek-v3-250324",
			stream: true,
			user_id: userId,
			session_id: sessionId
		};

		console.log("开始调用MoodShakerAPI，请求数据:", requestData);

		const response = await fetch('http://localhost:8080/api/v1/agents/bartender/runs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('No reader available');
		}

		let content = '';
		let cocktail: Cocktail | undefined;
		let isCocktailData = false;
		let cocktailData = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			
			const chunk = new TextDecoder().decode(value);
			const lines = chunk.split('\n');
			
			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const data = line.slice(6);
					if (data === '[DONE]') {
						continue;
					}
					
					try {
						const parsed = JSON.parse(data);
						if (parsed.type === 'cocktail') {
							isCocktailData = true;
							cocktailData = parsed.data;
						} else {
							content += parsed.content || '';
						}
					} catch (e) {
						console.error('解析响应数据失败:', e);
					}
				}
			}
		}

		if (isCocktailData) {
			try {
				cocktail = JSON.parse(cocktailData);
			} catch (e) {
				console.error('解析鸡尾酒数据失败:', e);
			}
		}

		return {
			content,
			cocktail,
			timestamp: new Date().toISOString()
		};
	} catch (error: any) {
		console.error("MoodShakerAPI调用失败，详细错误信息:", {
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
