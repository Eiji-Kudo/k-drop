import React, { createContext, ReactNode, useContext, useState } from 'react'

type GlobalContextType = {
  user: {
    id: string
    name: string
    level: number
  } | null
  themeMode: 'light' | 'dark' | 'system'
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  themeMode: 'system',
  setThemeMode: () => {},
})

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<GlobalContextType['themeMode']>('system')
  const [user] = useState<GlobalContextType['user']>({
    id: 'user_123',
    name: 'Guest',
    level: 1,
  })

  return (
    <GlobalContext.Provider value={{ user, themeMode, setThemeMode }}>
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
