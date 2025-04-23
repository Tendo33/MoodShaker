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
const API_TIMEOUT = 30000; // 30 seconds

// Helper function to handle API timeouts
const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
	const controller = new AbortController();
	const { signal } = controller;

	const timeout = setTimeout(() => {
		controller.abort();
	}, API_TIMEOUT);

	try {
		const response = await fetch(url, { ...options, signal });
		clearTimeout(timeout);
		return response;
	} catch (error) {
		clearTimeout(timeout);
		throw error;
	}
};

// Updated to use real API endpoints
export const requestCocktailRecommendation = async (
	request: BartenderRequest,
	agentType: AgentType = AgentType.CLASSIC_BARTENDER
): Promise<Cocktail> => {
	try {
		// Determine the endpoint based on the agent type
		const endpoint = `/api/v1/agents/${agentType}`;

		const response = await fetchWithTimeout(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...request,
				model: ModelName.DEEPSEEK_V3, // Default to the latest model
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`API error (${response.status}): ${errorText}`);
			throw new Error(`Failed to fetch recommendation: ${response.status}`);
		}

		const data = await response.json();
		return data as Cocktail;
	} catch (error) {
		console.error("Error requesting cocktail recommendation:", error);

		// For development/demo fallback to mock data if API fails
		if (process.env.NODE_ENV !== "production") {
			console.warn("Using mock data as fallback");
			return getMockCocktail();
		}

		throw error;
	}
};

export const getCocktailImage = async (userId: string, sessionId: string): Promise<string> => {
	try {
		const response = await fetchWithTimeout(`/api/v1/agents/cocktail_image?user_id=${userId}&session_id=${sessionId}`);

		if (!response.ok) {
			if (response.status === 404) {
				// Image not ready yet, return empty string
				return "";
			}
			throw new Error(`Failed to fetch image: ${response.status}`);
		}

		const data = await response.json();
		return data.image_data || ""; // Return the base64 image data
	} catch (error) {
		console.error("Error getting cocktail image:", error);
		return ""; // Return empty string on error
	}
};

export async function pollForCocktailImage(
	userId: string,
	sessionId: string,
	onSuccess: (imageData: string) => void,
	maxAttempts = 20,
	interval = 2000
) {
	let attempts = 0;

	const poll = async () => {
		if (attempts >= maxAttempts) {
			console.error("Max polling attempts reached");
			// Provide placeholder image on polling failure
			onSuccess(""); // Empty string will trigger placeholder image
			return;
		}

		attempts++;
		try {
			const imageData = await getCocktailImage(userId, sessionId);

			if (imageData) {
				onSuccess(imageData);
			} else {
				setTimeout(poll, interval);
			}
		} catch (error) {
			console.error("Error polling for image:", error);
			setTimeout(poll, interval);
		}
	};

	poll();
}

// Keep mock data for development/fallback
function getMockCocktail(): Cocktail {
	return {
		name: "莫吉托",
		english_name: "Mojito",
		description: "莫吉托是一款清爽的朗姆酒鸡尾酒，源自古巴，以薄荷、青柠和苏打水的清新口感著称。",
		match_reason:
			"根据您的喜好，这款低酒精度的清爽鸡尾酒非常适合您。莫吉托制作简单，不需要专业工具，且口感清新，带有薄荷和青柠的香气。",
		base_spirit: "朗姆酒",
		alcohol_level: "低",
		serving_glass: "高球杯",
		time_required: "5分钟",
		flavor_profiles: ["清新", "酸甜", "薄荷香"],
		ingredients: [
			{ name: "白朗姆酒", amount: "60", unit: "ml" },
			{ name: "新鲜青柠汁", amount: "30", unit: "ml" },
			{ name: "糖浆", amount: "15", unit: "ml", substitute: "白砂糖" },
			{ name: "薄荷叶", amount: "8-10", unit: "片" },
			{ name: "苏打水", amount: "适量" },
			{ name: "冰块", amount: "适量" },
		],
		tools: [
			{ name: "高球杯", alternative: "任何玻璃杯" },
			{ name: "调酒勺", alternative: "长柄勺" },
			{ name: "捣棒", alternative: "木勺" },
		],
		steps: [
			{
				step_number: 1,
				description: "将薄荷叶和糖浆放入杯中，轻轻捣碎薄荷叶以释放香气。",
				tips: "注意不要过度捣碎薄荷叶，以免苦味释放。",
			},
			{
				step_number: 2,
				description: "加入新鲜青柠汁和白朗姆酒。",
			},
			{
				step_number: 3,
				description: "加入冰块，用调酒勺轻轻搅拌。",
			},
			{
				step_number: 4,
				description: "最后加入苏打水至杯口，轻轻搅拌。",
			},
			{
				step_number: 5,
				description: "用薄荷叶和青柠片装饰，即可享用。",
				tips: "饮用前轻轻搅拌，让风味更均匀。",
			},
		],
	};
}
