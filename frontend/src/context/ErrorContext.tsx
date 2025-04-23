"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface ErrorContextType {
  message: string
  setError: (errorMessage: string) => void
  clearError: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

interface ErrorProviderProps {
  children: ReactNode
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<string>("")

  const setError = (errorMessage: string): void => {
    setMessage(errorMessage)

    // 5秒后自动清除错误
    setTimeout(() => {
      if (message === errorMessage) {
        clearError()
      }
    }, 5000)
  }

  const clearError = (): void => {
    setMessage("")
  }

  return <ErrorContext.Provider value={{ message, setError, clearError }}>{children}</ErrorContext.Provider>
}

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider")
  }
  return context
}
