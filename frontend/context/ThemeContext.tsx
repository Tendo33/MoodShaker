"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ThemeType = "light" | "dark"

interface ThemeContextType {
  theme: ThemeType
  toggleTheme: () => void
  getTextColorClass: (defaultClass?: string) => string
  getSecondaryTextColorClass: () => string
  getMutedTextColorClass: () => string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 检查系统偏好和本地存储
  const getInitialTheme = (): ThemeType => {
    // 如果不在浏览器环境中，返回默认主题
    if (typeof window === "undefined") return "dark"

    const savedTheme = localStorage.getItem("moodshaker-theme")
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme as ThemeType

    // 默认返回深色主题
    return "dark"
  }

  const [theme, setTheme] = useState<ThemeType>(getInitialTheme())

  // 应用主题到文档
  const applyTheme = (newTheme: ThemeType): void => {
    if (typeof document === "undefined") return

    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(newTheme)

    // 更新 meta 标签以支持移动设备的主题色
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", newTheme === "dark" ? "#111827" : "#ffffff")
    }
  }

  // 切换主题
  const toggleTheme = (): void => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light"
      localStorage.setItem("moodshaker-theme", newTheme)
      return newTheme
    })
  }

  // 获取当前主题的文本颜色类
  const getTextColorClass = (defaultClass = ""): string => {
    if (theme === "dark") {
      return defaultClass || "text-white"
    }
    return defaultClass || "text-gray-900"
  }

  // 获取当前主题的次要文本颜色类
  const getSecondaryTextColorClass = (): string => {
    if (theme === "dark") {
      return "text-gray-300"
    }
    return "text-gray-700"
  }

  // 获取当前主题的静音文本颜色类
  const getMutedTextColorClass = (): string => {
    if (theme === "dark") {
      return "text-gray-400"
    }
    return "text-gray-600"
  }

  // 初始化主题
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        getTextColorClass,
        getSecondaryTextColorClass,
        getMutedTextColorClass,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
