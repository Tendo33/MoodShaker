"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, History } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [hasSavedSession, setHasSavedSession] = useState(false)
  const [savedAnswers, setSavedAnswers] = useState<string | null>(null)

  useEffect(() => {
    // 检查是否有保存的会话
    if (typeof window !== "undefined") {
      const answers = localStorage.getItem("moodshaker-answers")
      setSavedAnswers(answers)
      setHasSavedSession(!!answers)
    }
  }, [])

  // 继续上次会话
  const continueSession = () => {
    navigate("/questions")
  }

  // 开始新会话
  const startNewSession = () => {
    navigate("/questions?new=true")
  }

  return (
    <div className="flex-1 relative">
      {/* Enhanced decorative elements with animation */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div
          className="absolute -top-10 -right-10 w-80 h-80 bg-amber-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute top-1/3 -left-10 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-10 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        ></div>
      </div>

      <section className="container py-16 md:py-28 lg:py-36 relative" style={{ margin: "0 auto" }}>
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center">
          <div className="inline-block mb-6 p-3 bg-white/5 backdrop-blur-sm rounded-full shadow-xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <span className="text-3xl">🍹</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {t("home.title")}
          </h1>
          <p className="max-w-[700px] text-xl text-gray-300 md:text-2xl leading-relaxed">{t("home.subtitle")}</p>

          {/* 会话选择区域 */}
          <div className="w-full sm:w-auto mt-10 flex flex-col items-center">
            <div
              className={
                hasSavedSession
                  ? "w-full mb-6 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md"
                  : "hidden"
              }
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mr-3">
                  <History className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white">{t("home.savedSession")}</h3>
              </div>
              <p className="text-gray-300 mb-5">{t("home.savedSessionDesc")}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={continueSession}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white rounded-full shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  {t("home.continue")}
                </button>
                <button
                  onClick={startNewSession}
                  className="flex-1 px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all duration-300 whitespace-nowrap"
                >
                  {t("home.new")}
                </button>
              </div>
            </div>

            {/* 如果没有保存的会话，只显示开始按钮 */}
            <button
              onClick={startNewSession}
              className={
                !hasSavedSession
                  ? "w-full sm:w-auto px-10 py-4 text-lg font-medium bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white border-0 shadow-xl shadow-pink-500/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 group whitespace-nowrap"
                  : "hidden"
              }
            >
              {t("home.start")} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Added feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-left shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-white/5 hover:to-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🧪</span>
              </div>
              <h3 className="text-xl font-bold mb-2 whitespace-nowrap">{t("home.feature1.title")}</h3>
              <p className="text-gray-300">{t("home.feature1.description")}</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-left shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-white/5 hover:to-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold mb-2 whitespace-nowrap">{t("home.feature2.title")}</h3>
              <p className="text-gray-300">{t("home.feature2.description")}</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-left shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-white/5 hover:to-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-2 whitespace-nowrap">{t("home.feature3.title")}</h3>
              <p className="text-gray-300">{t("home.feature3.description")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
