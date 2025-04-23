"use client"

import { useState, useEffect } from "react"

interface Breakpoints {
  sm: number
  md: number
  lg: number
  xl: number
  "2xl": number
}

export function useBreakpoints() {
  // 默认值，在SSR环境中使用
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024)

  const breakpoints: Breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  }

  const [isMobile, setIsMobile] = useState<boolean>(windowWidth < breakpoints.md)
  const [isTablet, setIsTablet] = useState<boolean>(windowWidth >= breakpoints.md && windowWidth < breakpoints.lg)
  const [isDesktop, setIsDesktop] = useState<boolean>(windowWidth >= breakpoints.lg)

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateWidth = (): void => {
      const width = window.innerWidth
      setWindowWidth(width)
      setIsMobile(width < breakpoints.md)
      setIsTablet(width >= breakpoints.md && width < breakpoints.lg)
      setIsDesktop(width >= breakpoints.lg)
    }

    window.addEventListener("resize", updateWidth)
    updateWidth()

    return () => {
      window.removeEventListener("resize", updateWidth)
    }
  }, [])

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
  }
}
