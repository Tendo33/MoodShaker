import request from "@/utils/request";

interface ChatRequest {
	message: string;
	user_id?: string;
	session_id?: string;
}

interface ChatResponse {
	content: string;
	cocktail?: {
		name: string;
		image: string;
		ingredients: Array<{
			name: string;
			amount: string;
		}>;
		instructions: string[];
	};
}

export const chatWithBartender = (data: ChatRequest) => {
	return request<ChatResponse>({
		url: "/api/v1/agents/bartender/runs",
		method: "post",
		data,
	});
};
