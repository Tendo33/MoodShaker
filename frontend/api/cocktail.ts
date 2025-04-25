// Update the enums to match the backend API
export enum AlcoholLevel {
	ANY = "any",
	NONE = "none", // Keep this for UI compatibility
	LOW = "low",
	MEDIUM = "medium",
	HIGH = "high",
}

export enum DifficultyLevel {
	ANY = "any",
	EASY = "easy",
	MEDIUM = "medium",
	HARD = "hard",
}

// Add model name enum from backend
export enum ModelName {
	DEEPSEEK_V3 = "deepseek-v3-250324",
	DEEPSEEK_R1 = "deepseek-r1-250120",
}

// Add agent type enum from backend
export enum AgentType {
	CLASSIC_BARTENDER = "classic_bartender",
	CREATIVE_BARTENDER = "creative_bartender",
	CASUAL_CHAT = "casual_chat",
}

export interface Ingredient {
	name: string;
	amount: string;
	unit?: string;
	substitute?: string;
}

export interface Tool {
	name: string;
	alternative?: string;
}

export interface Step {
	step_number: number;
	description: string;
	tips?: string;
}

export interface Cocktail {
	id?: string | number; // Keep for compatibility
	name: string;
	english_name?: string;
	description: string;
	match_reason: string;
	base_spirit: string;
	alcohol_level: string;
	serving_glass: string;
	time_required?: string;
	flavor_profiles: string[];
	ingredients: Ingredient[];
	tools: Tool[];
	steps: Step[];
	image?: string;
}

// Update request interface to match backend
export interface BartenderRequest {
	message: string;
	model?: ModelName;
	alcohol_level: AlcoholLevel;
	has_tools: boolean | null;
	difficulty_level: DifficultyLevel;
	base_spirits: string[] | null;
	user_id?: string;
	session_id?: string;
}

// Added timeout for API requests
const API_TIMEOUT = 60000; // 30 seconds

// 优化API超时处理
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_TIMEOUT) => {
	const controller = new AbortController();
	const { signal } = controller;

	// 创建一个超时Promise
	const timeoutPromise = new Promise<never>((_, reject) => {
		const timeoutId = setTimeout(() => {
			controller.abort();
			reject(new Error(`Request timed out after ${timeout}ms`));
			clearTimeout(timeoutId);
		}, timeout);
	});

	try {
		// 使用Promise.race在请求和超时之间竞争
		const response = (await Promise.race([fetch(url, { ...options, signal }), timeoutPromise])) as Response;

		return response;
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") {
			throw new Error(`Request to ${url} timed out after ${timeout}ms`);
		}
		throw error;
	}
};

// 检查响应是否为JSON
const isJsonResponse = (contentType: string | null): boolean => {
	return !!contentType && contentType.includes("application/json");
};

// 安全地解析JSON响应
const safeParseJson = async (response: Response): Promise<any> => {
	const contentType = response.headers.get("content-type");

	if (!isJsonResponse(contentType)) {
		const text = await response.text();
		console.error(`Expected JSON response but got content-type: ${contentType}`);
		console.error(`Response text (first 100 chars): ${text.substring(0, 100)}...`);
		throw new Error(`Invalid response format: expected JSON, got ${contentType || "unknown content type"}`);
	}

	try {
		return await response.json();
	} catch (error) {
		const text = await response.text();
		console.error(`Failed to parse JSON response: ${error}`);
		console.error(`Response text (first 100 chars): ${text.substring(0, 100)}...`);
		throw new Error(`Invalid JSON response: ${error}`);
	}
};

// 在开发环境中使用代理
const getApiUrl = (endpoint: string): string => {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	console.log("Current environment:", process.env.NODE_ENV);
	console.log("API Base URL:", baseUrl);
	console.log("Endpoint:", endpoint);

	if (!baseUrl) {
		console.error("NEXT_PUBLIC_API_BASE_URL is not configured");
		throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
	}

	const fullUrl = `${baseUrl}/api/v1${endpoint}`;
	console.log("Using direct URL:", fullUrl);
	return fullUrl;
};

// Updated to use real API endpoints
export const requestCocktailRecommendation = async (
	request: BartenderRequest,
	agentType: AgentType = AgentType.CLASSIC_BARTENDER
): Promise<Cocktail> => {
	try {
		// 确定是否使用真实API
		const useRealApi = process.env.NEXT_PUBLIC_API_BASE_URL;

		// 如果没有配置API_BASE_URL，抛出错误
		if (!useRealApi) {
			throw new Error("NEXT_PUBLIC_API_BASE_URL not configured");
		}

		// Determine the endpoint based on the agent type
		const endpoint = `/agents/${agentType}`;
		const apiUrl = getApiUrl(endpoint);

		console.log(`Sending request to: ${apiUrl}`);
		console.log(`Request payload:`, JSON.stringify(request, null, 2));

		const response = await fetchWithTimeout(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: request.message,
				model: request.model || ModelName.DEEPSEEK_V3,
				alcohol_level: request.alcohol_level,
				has_tools: request.has_tools,
				difficulty_level: request.difficulty_level,
				base_spirits: request.base_spirits,
				user_id: request.user_id,
				session_id: request.session_id,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`API error (${response.status}): ${errorText.substring(0, 200)}...`);
			throw new Error(`Failed to fetch recommendation: ${response.status}`);
		}

		const data = await safeParseJson(response);
		console.log("API response data:", data);

		// 验证API返回的数据是否符合Cocktail类型
		if (!data || !data.name) {
			console.error("Invalid API response format:", data);
			throw new Error("Invalid API response format");
		}

		// 开始轮询图片
		if (request.user_id && request.session_id) {
			pollForCocktailImage(request.user_id, request.session_id, (imageData) => {
				console.log("Received image data:", imageData ? "Image received" : "No image yet");
			});
		}

		return data as Cocktail;
	} catch (error) {
		console.error("Error requesting cocktail recommendation:", error);
		throw error; // 抛出错误而不是返回模拟数据
	}
};

// 修改图片获取方法，使用更高效的方式
export const getCocktailImage = async (userId: string, sessionId: string): Promise<string> => {
	try {
		const endpoint = `/agents/cocktail_image?user_id=${encodeURIComponent(userId)}&session_id=${encodeURIComponent(
			sessionId
		)}`;
		const apiUrl = getApiUrl(endpoint);

		console.log(`Fetching cocktail image from: ${apiUrl}`);

		const response = await fetchWithTimeout(apiUrl);

		if (!response.ok) {
			if (response.status === 404) {
				// Image not ready yet, return empty string
				return "";
			}
			console.log(`Failed to fetch image: ${response.status}`);
		}

		const data = await safeParseJson(response);
		return data.image_data || ""; // Return the base64 image data
	} catch (error) {
		console.error("Error getting cocktail image:", error);
		return ""; // Return empty string on error
	}
};

// 使用指数退避算法优化轮询策略
export async function pollForCocktailImage(
	userId: string,
	sessionId: string,
	onSuccess: (imageData: string) => void,
	maxAttempts = 10,
	initialInterval = 1000
): Promise<NodeJS.Timeout | null> {
	let attempts = 0;
	let interval = initialInterval;
	let timeoutId: NodeJS.Timeout | null = null;

	const poll = async () => {
		if (attempts >= maxAttempts) {
			console.error("Max polling attempts reached");
			// Provide placeholder image on polling failure
			onSuccess(""); // Empty string will trigger placeholder image
			return null;
		}

		attempts++;
		try {
			const imageData = await getCocktailImage(userId, sessionId);

			if (imageData) {
				onSuccess(imageData);
				return null;
			} else {
				// 使用指数退避算法增加轮询间隔
				interval = Math.min(interval * 1.5, 10000); // 最大间隔10秒
				timeoutId = setTimeout(poll, interval);
				return timeoutId;
			}
		} catch (error) {
			console.error("Error polling for image:", error);
			// 使用指数退避算法增加轮询间隔
			interval = Math.min(interval * 1.5, 10000); // 最大间隔10秒
			timeoutId = setTimeout(poll, interval);
			return timeoutId;
		}
	};

	return poll();
}
