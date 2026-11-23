import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// TESTE: efeito "liquid glass" (ramo teste-liquid-glass)
document.documentElement.classList.add('glass')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
