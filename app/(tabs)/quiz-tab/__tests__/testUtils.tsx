import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalProvider, useGlobalContext } from '@/context/GlobalContext'

export let globalContextValue: ReturnType<typeof useGlobalContext> | null = null

export const GlobalContextTracker = () => {
  globalContextValue = useGlobalContext()
  return null
}

export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
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
