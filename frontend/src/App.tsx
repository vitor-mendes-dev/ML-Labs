import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { LandingPage } from './pages/LandingPage'
import { CalculatorPage } from './pages/CalculatorPage'
import { loadModel } from './lib/predictor'

export default function App() {
  // Pré-carrega o modelo em background enquanto o usuário lê a landing
  useEffect(() => {
    loadModel().catch(() => {})
  }, [])

  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/previsao" element={<CalculatorPage />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
