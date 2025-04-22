import { createContext, ReactNode, useContext, useState } from 'react'

type GlobalContextType = {
  themeMode: 'light' | 'dark' | 'system'
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  selectedQuizIds: number[]
  setSelectedQuizIds: (ids: number[]) => void
}

const GlobalContext = createContext<GlobalContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
  selectedQuizIds: [],
  setSelectedQuizIds: () => {},
})

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<GlobalContextType['themeMode']>('system')
  const [selectedQuizIds, setSelectedQuizIds] = useState<number[]>([])

  return (
    <GlobalContext.Provider
      value={{
        themeMode,
        setThemeMode,
        selectedQuizIds,
        setSelectedQuizIds,
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
