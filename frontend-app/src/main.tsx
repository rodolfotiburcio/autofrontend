import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@siemens/ix/dist/siemens-ix/siemens-ix.css';


import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
