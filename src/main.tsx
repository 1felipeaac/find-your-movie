import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GenreProvider } from './context/genre-context-data.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GenreProvider>
      <App />
    </GenreProvider>
  </StrictMode>,
)
