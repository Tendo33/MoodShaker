import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api/v1'

// 酒精浓度枚举
export enum AlcoholLevel {
  ANY = 'any',
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// 制作难度枚举
export enum DifficultyLevel {
  ANY = 'any',
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// 调酒师类型枚举
export enum BartenderType {
  CLASSIC = 'classic_bartender',
  CREATIVE = 'creative_bartender'
}

export interface CocktailRecommendation {
  name: string
  english_name?: string
  description: string
  time_required?: string
  match_reason: string
  base_spirit: string
  alcohol_level: string
  flavor_profiles: string[]
  ingredients: {
    name: string
    amount: string
    unit?: string
    substitute?: string
  }[]
  steps: {
    step_number: number
    description: string
    tips?: string
  }[]
  tools: {
    name: string
    alternative?: string
  }[]
  serving_glass: string
  image?: string
}

// 调酒师请求参数
export interface BartenderRequest {
  user_id: number
  session_id: string
  drinkType: string
  tools: string
  mood: string
  model?: string
}

export const requestCocktailRecommendation = async (request: BartenderRequest): Promise<CocktailRecommendation> => {
  const response = await axios.post(`${API_BASE_URL}/agents/classic_bartender`, request)
  return response.data
}

export const getCocktailImage = async (userId: number, sessionId: string): Promise<string> => {
  const response = await axios.get(`${API_BASE_URL}/agents/cocktail_image`, {
    params: { user_id: userId, session_id: sessionId }
  })
  return response.data.image_data
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
      return
    }

    attempts++
    const imageData = await getCocktailImage(userId, sessionId)

    if (imageData) {
      onSuccess(imageData)
    } else {
      setTimeout(poll, interval)
    }
  }

  poll()
}