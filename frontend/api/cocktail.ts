// 酒精浓度枚举
export enum AlcoholLevel {
  ANY = "any",
  NONE = "none",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// 制作难度枚举
export enum DifficultyLevel {
  ANY = "any",
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

// 调酒师类型枚举
export enum BartenderType {
  CLASSIC = "classic_bartender",
  CREATIVE = "creative_bartender",
}

export interface Ingredient {
  name: string
  amount: string
  unit?: string
  substitute?: string
}

export interface Tool {
  name: string
  alternative?: string
}

export interface Step {
  step_number: number
  description: string
  tips?: string
}

export interface Cocktail {
  id: string | number
  name: string
  english_name?: string
  description: string
  match_reason: string
  base_spirit: string
  alcohol_level: string
  serving_glass: string
  time_required?: string
  flavor_profiles: string[]
  ingredients: Ingredient[]
  tools: Tool[]
  steps: Step[]
  image?: string
}

// 调酒师请求参数
export interface BartenderRequest {
  message: string
  alcohol_level: AlcoholLevel
  has_tools: boolean | null
  difficulty_level: DifficultyLevel
  base_spirits: string[] | null
  user_id?: number
  session_id?: string
}

// Added error handling and timeout configuration
export const requestCocktailRecommendation = async (request: BartenderRequest): Promise<Cocktail> => {
  try {
    // 在实际环境中，这里应该使用真实的API端点
    // const response = await axios.post(`/api/cocktail/recommend`, request, {
    //   timeout: 15000, // 15 seconds timeout
    // })
    // return response.data

    // 开发/演示环境使用模拟数据
    return getMockCocktail()
  } catch (error) {
    console.error("Error requesting cocktail recommendation:", error)
    // 返回模拟数据用于开发/演示
    return getMockCocktail()
  }
}

export const getCocktailImage = async (userId: number, sessionId: string): Promise<string> => {
  try {
    // 在实际环境中，这里应该使用真实的API端点
    // const response = await axios.get(`/api/cocktail/image`, {
    //   params: { user_id: userId, session_id: sessionId },
    //   timeout: 10000, // 10 seconds timeout
    // })
    // return response.data.image_data

    // 开发/演示环境返回空字符串，将使用占位图像
    return ""
  } catch (error) {
    console.error("Error getting cocktail image:", error)
    return "" // 出错时返回空字符串
  }
}

export async function pollForCocktailImage(
  userId: number,
  sessionId: string,
  onSuccess: (imageData: string) => void,
  maxAttempts = 20,
  interval = 2000,
) {
  let attempts = 0

  const poll = async () => {
    if (attempts >= maxAttempts) {
      console.error("Max polling attempts reached")
      // 轮询失败时提供占位图像
      onSuccess("") // 空字符串将触发占位图像
      return
    }

    attempts++
    try {
      const imageData = await getCocktailImage(userId, sessionId)

      if (imageData) {
        onSuccess(imageData)
      } else {
        setTimeout(poll, interval)
      }
    } catch (error) {
      console.error("Error polling for image:", error)
      setTimeout(poll, interval)
    }
  }

  poll()
}

// 用于开发/演示的模拟数据
function getMockCocktail(): Cocktail {
  return {
    id: "mock-1",
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
  }
}
