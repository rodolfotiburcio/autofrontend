import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { IxApplicationContext } from '@siemens/ix-react'
import './index.css'

import App from './App.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IxApplicationContext>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </IxApplicationContext>
  </StrictMode>
)
