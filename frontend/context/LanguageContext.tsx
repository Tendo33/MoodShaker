"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LanguageContextType {
  locale: string
  changeLanguage: (lang: string) => void
  t: (key: string) => string
  availableLanguages: Record<string, string>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 简单的翻译字典，实际应用中可能会使用i18next等库
const translations: Record<string, Record<string, string>> = {
  "zh-CN": {
    "app.title": "MoodShaker - 找到适合您心情的鸡尾酒",
    "home.title": "找到适合您心情的鸡尾酒",
    "home.subtitle": "通过回答几个简单问题，让我们为您推荐完美的鸡尾酒",
    "home.feature1.title": "个性化推荐",
    "home.feature1.description": "根据您的口味偏好和心情，为您量身定制鸡尾酒推荐",
    "home.feature2.title": "详细配方",
    "home.feature2.description": "获取完整的配料清单和制作步骤，轻松在家调制美味鸡尾酒",
    "home.feature3.title": "创意灵感",
    "home.feature3.description": "发现新的口味组合和创意调酒技巧，提升您的调酒体验",
    "home.start": "开始探索",
    "home.continue": "继续上次问卷",
    "home.new": "开始新问卷",
    "home.savedSession": "检测到未完成的问卷",
    "home.savedSessionDesc": "您有一个未完成的鸡尾酒推荐问卷。您想继续之前的问卷还是开始一个新的？",
    // 更多翻译...
  },
  en: {
    "app.title": "MoodShaker - Find the Perfect Cocktail for Your Mood",
    "home.title": "Find the Perfect Cocktail for Your Mood",
    "home.subtitle": "Answer a few simple questions and let us recommend the perfect cocktail for you",
    "home.feature1.title": "Personalized Recommendations",
    "home.feature1.description": "Get cocktail recommendations tailored to your taste preferences and mood",
    "home.feature2.title": "Detailed Recipes",
    "home.feature2.description":
      "Get complete ingredient lists and step-by-step instructions to easily make delicious cocktails at home",
    "home.feature3.title": "Creative Inspiration",
    "home.feature3.description":
      "Discover new flavor combinations and creative bartending techniques to enhance your cocktail experience",
    "home.start": "Start Exploring",
    "home.continue": "Continue Previous Survey",
    "home.new": "Start New Survey",
    "home.savedSession": "Unfinished Survey Detected",
    "home.savedSessionDesc":
      "You have an unfinished cocktail recommendation survey. Would you like to continue your previous survey or start a new one?",
    // 更多翻译...
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const availableLanguages: Record<string, string> = {
    "zh-CN": "中文",
    en: "English",
  }

  const getInitialLanguage = (): string => {
    if (typeof window === "undefined") return "zh-CN"

    const savedLanguage = localStorage.getItem("moodshaker-language")
    if (savedLanguage && availableLanguages[savedLanguage]) {
      return savedLanguage
    }

    return "zh-CN"
  }

  const [locale, setLocale] = useState<string>(getInitialLanguage())

  const changeLanguage = async (lang: string): Promise<void> => {
    if (availableLanguages[lang]) {
      setLocale(lang)
      localStorage.setItem("moodshaker-language", lang)
    }
  }

  const t = (key: string): string => {
    return translations[locale]?.[key] || key
  }

  // 更新页面标题
  useEffect(() => {
    document.title = t("app.title")
  }, [locale])

  return (
    <LanguageContext.Provider
      value={{
        locale,
        changeLanguage,
        t,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
