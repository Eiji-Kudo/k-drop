import { createContext, ReactNode, useContext, useState } from 'react'

type GlobalContextType = {
  themeMode: 'light' | 'dark' | 'system'
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  selectedQuizQuestions: number[]
  setSelectedQuizQuestions: (questions: number[]) => void
}

const GlobalContext = createContext<GlobalContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
  selectedQuizQuestions: [],
  setSelectedQuizQuestions: () => {},
})

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<GlobalContextType['themeMode']>('system')
  const [selectedQuizQuestions, setSelectedQuizQuestions] = useState<number[]>([])

  return (
    <GlobalContext.Provider
      value={{
        themeMode,
        setThemeMode,
        selectedQuizQuestions,
        setSelectedQuizQuestions,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider')
  }
  return context
}

export default GlobalProvider
