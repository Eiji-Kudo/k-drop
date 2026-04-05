import { act, fireEvent, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalProvider, useGlobalContext } from '@/context/GlobalContext'
import { useEffect } from 'react'
import type { ReactTestInstance } from 'react-test-renderer'

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

type GroupSelectionQueries = {
  getByTestId: (testId: string) => ReactTestInstance
  getByText: (text: string) => ReactTestInstance
}

export const selectFirstGroup = async ({
  getByTestId,
  getByText,
}: GroupSelectionQueries) => {
  await waitFor(() => {
    expect(getByText('TWICE')).toBeTruthy()
  })

  await act(async () => {
    fireEvent.press(getByTestId('group-button-1'))
    await Promise.resolve()
  })
}

export const pressContinue = async ({
  getByTestId,
}: Pick<GroupSelectionQueries, 'getByTestId'>) => {
  await act(async () => {
    fireEvent.press(getByTestId('continue-button'))
    await Promise.resolve()
  })
}
