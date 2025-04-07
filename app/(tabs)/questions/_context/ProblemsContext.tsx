import { createContext, ReactNode, useState } from 'react'

type Problem = {
  id: number
  text: string
}

type ProblemsContextType = {
  problems: Problem[]
}

export const ProblemsContext = createContext<ProblemsContextType>({
  problems: [],
})

type ProblemsProviderProps = {
  children: ReactNode
}

export function ProblemsProvider({ children }: ProblemsProviderProps) {
  const [problems] = useState([
    { id: 1, text: '問題文1' },
    { id: 2, text: '問題文2' },
    { id: 3, text: '問題文3' },
  ])

  return <ProblemsContext.Provider value={{ problems }}>{children}</ProblemsContext.Provider>
}

export default ProblemsProvider
