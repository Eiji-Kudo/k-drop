import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalProvider, useGlobalContext } from '@/context/GlobalContext'
import { useEffect } from 'react'

export let globalContextValue: ReturnType<typeof useGlobalContext> | null = null

export const GlobalContextTracker = () => {
  const context = useGlobalContext()

  useEffect(() => {
    globalContextValue = context
  }, [context, context.selectedQuizIds, context.answeredQuizIds])

  return null
}

export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <GlobalContextTracker />
        {children}
      </GlobalProvider>
    </QueryClientProvider>
  )
}

export const resetGlobalContext = () => {
  globalContextValue = null
}
