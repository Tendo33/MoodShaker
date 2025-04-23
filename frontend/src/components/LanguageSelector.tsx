"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Globe } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"

const LanguageSelector: React.FC = () => {
  const { theme } = useTheme()
  const { locale, changeLanguage, availableLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 计算当前语言名称
  const currentLanguageName = availableLanguages[locale] || availableLanguages["zh-CN"]

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 语言选择按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center group relative overflow-hidden ${
          theme === "dark"
            ? "bg-white/10 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-pink-500/20"
            : "bg-gray-100 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-pink-500/20"
        }`}
        aria-label="选择语言"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></span>
        <Globe
          className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        />
        <span
          className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs font-medium transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-bottom-6 ${
            theme === "dark" ? "text-white/70" : "text-gray-600"
          }`}
        >
          {currentLanguageName}
        </span>
      </button>

      {/* 语言下拉菜单 */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-3 w-48 rounded-xl shadow-lg z-10 border overflow-hidden ${
            theme === "dark"
              ? "bg-gray-800/90 backdrop-blur-sm border-gray-700"
              : "bg-white/90 backdrop-blur-sm border-gray-100"
          }`}
        >
          <div className="py-1.5">
            <div className={`px-3 py-1.5 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              选择语言
            </div>

            <div className="mt-1">
              {Object.entries(availableLanguages).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 transition-all duration-200 ${
                    locale === code
                      ? theme === "dark"
                        ? "bg-gradient-to-r from-amber-500/20 to-pink-500/20 text-white"
                        : "bg-gradient-to-r from-amber-500/10 to-pink-500/10 text-gray-900"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700/50"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {code === "zh-CN" && <span className="text-lg">🇨🇳</span>}
                    {code === "en" && <span className="text-lg">🇺🇸</span>}
                  </div>
                  <span>{name}</span>
                  {locale === code && (
                    <div
                      className={`ml-auto flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full ${
                        theme === "dark" ? "bg-amber-500/20 text-amber-500" : "bg-amber-500/20 text-amber-600"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
