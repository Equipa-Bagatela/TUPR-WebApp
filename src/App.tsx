import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ErrorBoundary } from './components/ui'
import Home from './pages/Home'
import LineDetail from './pages/LineDetail'
import Lines from './pages/Lines'
import MapPage from './pages/MapPage'
import Next from './pages/Next'
import NotFound from './pages/NotFound'
import Plan from './pages/Plan'
import StopDetail from './pages/StopDetail'
import Stops from './pages/Stops'
import Timetables from './pages/Timetables'
import { useTheme } from './hooks/useTheme'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.getElementById('conteudo')?.focus({ preventScroll: true })
  }, [pathname])
  return null
}

export default function App() {
  useTheme()
  return (
    <HashRouter>
      <ScrollTop />
      <Header />
      <main id="conteudo" tabIndex={-1} className="min-h-[60vh] outline-none">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planear" element={<Plan />} />
            <Route path="/proximos" element={<Next />} />
            <Route path="/horarios" element={<Timetables />} />
            <Route path="/linhas" element={<Lines />} />
            <Route path="/linhas/:id" element={<LineDetail />} />
            <Route path="/paragens" element={<Stops />} />
            <Route path="/paragens/:id" element={<StopDetail />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </HashRouter>
  )
}
