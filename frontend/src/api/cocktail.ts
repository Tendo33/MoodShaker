import { http } from '@/utils/http'
import type { CocktailRecommendation } from '@/types/cocktail'

// 酒精浓度枚举
export enum AlcoholLevel {
  ANY = '任意',
  NONE = '无酒精',
  LOW = '低度',
  MEDIUM = '中度',
  HIGH = '高度'
}

// 制作难度枚举
export enum DifficultyLevel {
  ANY = '任意',
  EASY = '简单',
  MEDIUM = '中等',
  HARD = '困难'
}

// 调酒师类型枚举
export enum BartenderType {
  CLASSIC = 'classic_bartender',
  CREATIVE = 'creative_bartender'
}

// 调酒师请求参数
export interface BartenderRequest {
  user_id: number
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
  return http.post<CocktailRecommendation>(`/agents/${type}`, params)
}

// 获取鸡尾酒图片
export function getCocktailImage(user_id: number, session_id: string) {
  return http.get<{ image_url: string }>('/agents/cocktail_image', {
    params: { user_id, session_id }
  })
} 