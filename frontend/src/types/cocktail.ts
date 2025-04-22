// 原料
export interface Ingredient {
	name: string;
	amount: string;
	unit?: string;
	substitute?: string;
}

// 制作步骤
export interface Step {
	step_number: number;
	description: string;
	tips?: string;
}

// 制作工具
export interface Tool {
	name: string;
	alternative?: string;
}

// 鸡尾酒推荐信息
export interface CocktailRecommendation {
	// 基本信息
	name: string;
	english_name: string;
	description: string;
	time_required?: string;
	match_reason: string;

	// 关键特征
	base_spirit: string;
	alcohol_level: string;
	flavor_profiles: string[];

	// 制作信息
	ingredients: Ingredient[];
	steps: Step[];
	tools: Tool[];
	serving_glass: string;
}

// 环境变量类型声明
interface ImportMetaEnv {
	readonly VITE_BACKEND_API_URL: string;
	// 更多环境变量...
}
