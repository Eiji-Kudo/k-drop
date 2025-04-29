import { createContext, ReactNode, useContext, useState } from 'react'

type GlobalContextType = {
  themeMode: 'light' | 'dark' | 'system'
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  selectedQuizIds: number[]
  setSelectedQuizIds: (ids: number[] | ((prev: number[]) => number[])) => void
  answeredQuizIds: number[]
  setAnsweredQuizIds: (ids: number[] | ((prev: number[]) => number[])) => void
}

const GlobalContext = createContext<GlobalContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
  selectedQuizIds: [],
  setSelectedQuizIds: () => {},
  answeredQuizIds: [],
  setAnsweredQuizIds: () => {},
})

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] =
    useState<GlobalContextType['themeMode']>('system')
  const [selectedQuizIds, setSelectedQuizIds] = useState<number[]>([])
  const [answeredQuizIds, setAnsweredQuizIds] = useState<number[]>([])

  return (
    <GlobalContext.Provider
      value={{
        themeMode,
        setThemeMode,
        selectedQuizIds,
        setSelectedQuizIds,
        answeredQuizIds,
        setAnsweredQuizIds,
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
