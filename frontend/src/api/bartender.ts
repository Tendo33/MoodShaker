import request from "@/utils/request";

interface ChatRequest {
	message: string;
	user_id?: string;
	session_id?: string;
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
		const response = await request<ChatResponse>({
			url: "/api/v1/agents/bartender/runs",
			method: "post",
			data,
		});
		return response.data;
	} catch (error) {
		console.error("调酒师助手API调用失败:", error);
		throw error;
	}
};
