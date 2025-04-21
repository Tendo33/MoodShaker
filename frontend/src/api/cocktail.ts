import { http } from '@/utils/http'
import type { CocktailRecommendation } from '@/types/cocktail'

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

// 调酒师请求参数
export interface BartenderRequest {
  user_id: string
  session_id: string
  model: string
  message: string
  alcohol_level?: AlcoholLevel
  has_tools?: boolean
  difficulty_level?: DifficultyLevel
  base_spirits?: string[]
}

// 获取鸡尾酒推荐
export function getCocktailRecommendation(type: BartenderType, params: BartenderRequest) {
  return http.post<CocktailRecommendation>(`/api/v1/agents/${type}`, params)
}

// 获取鸡尾酒图片
export function getCocktailImage(user_id: string, session_id: string) {
  return http.get<{ image_url: string }>('/api/v1/agents/cocktail_image', {
    params: { user_id, session_id }
  })
} 