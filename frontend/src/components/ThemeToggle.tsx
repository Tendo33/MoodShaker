"use client"

import type React from "react"
import { useTheme } from "../context/ThemeContext"
import { Sun, Moon } from "lucide-react"

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-110 group ${
        theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-gray-800/10 hover:bg-gray-800/20"
      }`}
      aria-label="切换主题"
    >
      {theme === "dark" ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-gray-800" />}

      {/* 悬停提示 */}
      <span
        className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800 shadow-md"
        }`}
      >
        {theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
      </span>
    </button>
  )
}

export default ThemeToggle
