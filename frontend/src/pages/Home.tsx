"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, History } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"

// Import cocktail images
const cocktailImages = {
  mojito: "/refreshing-mojito.png",
  margarita: "/classic-margarita.png",
  cosmopolitan: "/vibrant-cosmopolitan.png",
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [hasSavedSession, setHasSavedSession] = useState(false)
  const [savedAnswers, setSavedAnswers] = useState<string | null>(null)
  const [currentCocktailIndex, setCurrentCocktailIndex] = useState(0)
  
  // Featured cocktails for the hero section
  const featuredCocktails = [
    {
      name: "莫吉托",
      englishName: "Mojito",
      description: "清新薄荷与青柠的完美结合",
      image: cocktailImages.mojito,
    },
    {
      name: "玛格丽特",
      englishName: "Margarita",
      description: "经典龙舌兰鸡尾酒，酸甜平衡",
      image: cocktailImages.margarita,
    },
    {
      name: "大都会",
      englishName: "Cosmopolitan",
      description: "时尚优雅的蔓越莓伏特加鸡尾酒",
      image: cocktailImages.cosmopolitan,
    },
  ]

  useEffect(() => {
    // 检查是否有保存的会话
    if (typeof window !== "undefined") {
      const answers = localStorage.getItem("moodshaker-answers")
      setSavedAnswers(answers)
      setHasSavedSession(!!answers)
    }
    
    // Rotate featured cocktails
    const interval = setInterval(() => {
      setCurrentCocktailIndex((prev) => (prev + 1) % featuredCocktails.length)
    }, 5000)
    
    return () => clearInterval(interval)
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

      {/* Hero Section with Featured Cocktail */}
      <section className="container py-16 md:py-24 relative" style={{ margin: "0 auto" }}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="mx-auto flex max-w-[580px] flex-col items-start gap-6">
              <div className="inline-block mb-4 p-2 bg-white/5 backdrop-blur-sm rounded-full shadow-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <span className="text-2xl">🍹</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t("home.title")}
              </h1>
              <p className="text-lg text-gray-300 md:text-xl leading-relaxed">{t("home.subtitle")}</p>
              
              {/* 会话选择区域 */}
              <div className="w-full sm:w-auto mt-6 flex flex-col items-start">
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
            </div>
          </div>
          
          {/* Featured Cocktail Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              {featuredCocktails.map((cocktail, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === currentCocktailIndex 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-xl"></div>
                    <img 
                      src={cocktail.image || "/placeholder.svg"} 
                      alt={cocktail.name} 
                      className="relative rounded-3xl shadow-2xl w-full h-auto object-cover aspect-square"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-3xl">
                      <h3 className="text-2xl font-bold text-white">{cocktail.name}</h3>
                      <p className="text-sm text-gray-300">{cocktail.englishName}</p>
                      <p className="text-white/80 mt-2">{cocktail.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Navigation dots */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredCocktails.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentCocktailIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentCocktailIndex 
                        ? "bg-gradient-to-r from-amber-500 to-pink-500 scale-125" 
                        : "bg-white/30"
                    }`}
                    aria-label={`View cocktail ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 relative" style={{ margin: "0 auto" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
            为什么选择 MoodShaker?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            我们的智能推荐系统会根据您的喜好和心情，为您找到完美的鸡尾酒
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
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
      </section>
      
      {/* Popular Cocktails Section */}
      <section className="container py-16 relative" style={{ margin: "0 auto" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
            热门鸡尾酒
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            探索我们用户最喜爱的鸡尾酒
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCocktails.map((cocktail, index) => (
            <div 
              key={index}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-48">
                <img 
                  src={cocktail.image || "/placeholder.svg"} 
                  alt={cocktail.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{cocktail.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{cocktail.englishName}</p>
                <p className="text-gray-300">{cocktail.description}</p>
                <button 
                  onClick={startNewSession}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-amber-500/20 to-pink-500/20 hover:from-amber-500/30 hover:to-pink-500/30 text-white border border-white/10 rounded-full transition-all duration-300"
                >
                  获取配方
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
