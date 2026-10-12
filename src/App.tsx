import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Splash } from './components/Splash'
import { ErrorBoundary } from './components/ui'
import { useTheme } from './hooks/useTheme'
import { useT } from './i18n'
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

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.getElementById('conteudo')?.focus({ preventScroll: true })
  }, [pathname])
  return null
}

function Pages() {
  const { pathname } = useLocation()
  return (
    // key = rota → cada página entra com uma animação suave
    <div key={pathname} className="page-in">
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
    </div>
  )
}

export default function App() {
  useTheme()
  const { lang } = useT() // subscreve o idioma: re-renderiza toda a árvore ao mudar
  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en'
  }, [lang])
  return (
    <HashRouter>
      <Splash />
      <ScrollTop />
      <Header />
      <main id="conteudo" tabIndex={-1} className="min-h-[60vh] outline-none">
        <ErrorBoundary>
          <Pages />
        </ErrorBoundary>
      </main>
      <Footer />
    </HashRouter>
  )
}
