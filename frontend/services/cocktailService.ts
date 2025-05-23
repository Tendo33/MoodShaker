import type { Cocktail } from "@/api/cocktail";

// 这是一个简单的服务，用于获取鸡尾酒数据
// 在实际应用中，这将调用后端API

// 示例热门鸡尾酒数据
const popularCocktails: Record<string, Cocktail> = {
	mojito: {
		name: "莫吉托",
		english_name: "Mojito",
		description: "莫吉托是一款清爽的朗姆酒鸡尾酒，源自古巴，以薄荷、青柠和苏打水的清新口感著称。",
		match_reason:
			"这款低酒精度的清爽鸡尾酒非常受欢迎。莫吉托制作简单，不需要专业工具，且口感清新，带有薄荷和青柠的香气。",
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
	},
	margarita: {
		name: "玛格丽特",
		english_name: "Margarita",
		description: "玛格丽特是一款经典的龙舌兰鸡尾酒，以其完美平衡的酸甜口感和盐边杯口而闻名。",
		match_reason: "这款经典鸡尾酒平衡了龙舌兰的烈性与青柠的酸甜，是世界上最受欢迎的鸡尾酒之一。",
		base_spirit: "龙舌兰",
		alcohol_level: "中",
		serving_glass: "玛格丽特杯",
		time_required: "5分钟",
		flavor_profiles: ["酸甜", "清爽", "柑橘香"],
		ingredients: [
			{ name: "龙舌兰酒", amount: "50", unit: "ml" },
			{ name: "君度橙酒", amount: "20", unit: "ml" },
			{ name: "新鲜青柠汁", amount: "25", unit: "ml" },
			{ name: "细盐", amount: "适量", unit: "", substitute: "粗海盐" },
			{ name: "冰块", amount: "适量" },
		],
		tools: [
			{ name: "玛格丽特杯", alternative: "鸡尾酒杯" },
			{ name: "雪克杯", alternative: "密封容器" },
			{ name: "调酒勺", alternative: "长柄勺" },
		],
		steps: [
			{
				step_number: 1,
				description: "用青柠片润湿杯口，然后将杯口倒扣在盐盘中，使杯口沾上一圈盐。",
				tips: "只在杯口外侧沾盐，避免盐进入酒中。",
			},
			{
				step_number: 2,
				description: "将龙舌兰酒、君度橙酒、青柠汁和冰块放入雪克杯中。",
			},
			{
				step_number: 3,
				description: "用力摇晃约15秒，直到雪克杯外壁结霜。",
			},
			{
				step_number: 4,
				description: "将调好的酒液过滤倒入已经沾好盐的玛格丽特杯中。",
			},
			{
				step_number: 5,
				description: "用青柠片装饰杯口，即可享用。",
			},
		],
	},
	cosmopolitan: {
		name: "大都会",
		english_name: "Cosmopolitan",
		description: "大都会是一款优雅的伏特加鸡尾酒，以其漂亮的粉红色和蔓越莓的甜酸口感而著名。",
		match_reason: "这款时尚的鸡尾酒在90年代因《欲望都市》而走红，口感平衡，外观精致。",
		base_spirit: "伏特加",
		alcohol_level: "中",
		serving_glass: "马天尼杯",
		time_required: "5分钟",
		flavor_profiles: ["甜酸", "果香", "清爽"],
		ingredients: [
			{ name: "柑橘伏特加", amount: "40", unit: "ml", substitute: "普通伏特加" },
			{ name: "君度橙酒", amount: "15", unit: "ml" },
			{ name: "蔓越莓汁", amount: "30", unit: "ml" },
			{ name: "新鲜青柠汁", amount: "15", unit: "ml" },
			{ name: "冰块", amount: "适量" },
		],
		tools: [
			{ name: "马天尼杯", alternative: "鸡尾酒杯" },
			{ name: "雪克杯", alternative: "密封容器" },
			{ name: "调酒勺", alternative: "长柄勺" },
		],
		steps: [
			{
				step_number: 1,
				description: "将伏特加、君度橙酒、蔓越莓汁、青柠汁和冰块放入雪克杯中。",
			},
			{
				step_number: 2,
				description: "用力摇晃约15秒，直到雪克杯外壁结霜。",
			},
			{
				step_number: 3,
				description: "将调好的酒液过滤倒入预先冰镇的马天尼杯中。",
			},
			{
				step_number: 4,
				description: "用橙皮或柠檬皮装饰，即可享用。",
				tips: "也可以用蔓越莓或青柠片装饰。",
			},
		],
	},
};

// 根据ID获取鸡尾酒
export const getCocktailById = async (id: string): Promise<Cocktail | null> => {
	// 在实际应用中，这将是一个API调用
	// 现在，我们只返回模拟数据
	return popularCocktails[id] || null;
};

// 获取所有热门鸡尾酒
export const getPopularCocktails = async (): Promise<Cocktail[]> => {
	// 在实际应用中，这将是一个API调用
	return Object.values(popularCocktails);
};

// 获取热门鸡尾酒的ID
export const getPopularCocktailIds = (): string[] => {
	return Object.keys(popularCocktails);
};
