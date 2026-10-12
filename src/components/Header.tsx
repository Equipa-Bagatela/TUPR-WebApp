import { Menu, Moon, Navigation, Search, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { Logo } from './Logo'
import { SearchDialog } from './SearchDialog'

const nav = [
  { to: '/planear', label: 'Planear viagem' },
  { to: '/horarios', label: 'Horários' },
  { to: '/linhas', label: 'Linhas' },
  { to: '/paragens', label: 'Paragens' },
  { to: '/mapa', label: 'Mapa' },
]
const link = ({ isActive }: { isActive: boolean }) =>
  `relative inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-3 text-[0.95rem] font-semibold transition hover:bg-primary-soft ${isActive ? 'text-primary after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[3px] after:rounded-full after:bg-accent' : 'text-ink'}`

export function Header() {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const { theme, toggle } = useTheme()
  const loc = useLocation()
  const go = useNavigate()
  useEffect(() => setMenu(false), [loc.pathname])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [menu])

  const themeBtn = (
    <button onClick={toggle} aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'} aria-pressed={theme === 'dark'} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-primary-soft">
      {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  )

  return (
    <header className="sticky top-0 z-[1100] border-b border-hair bg-surface/95 backdrop-blur">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[1300] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-on-primary">
        Saltar para o conteúdo
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" aria-label="TUPR – Transportes Urbanos do Peso da Régua, página inicial" className="shrink-0 rounded-lg">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={link}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button onClick={() => setSearch(true)} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-hair px-3.5 text-sm font-semibold hover:bg-primary-soft">
            <Search className="h-4 w-4" aria-hidden="true" /> Pesquisar
          </button>
          {themeBtn}
          <button onClick={() => go('/planear')} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-bold text-on-primary hover:opacity-90">
            <Navigation className="h-4 w-4" aria-hidden="true" /> Planear viagem
          </button>
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <button onClick={() => setSearch(true)} aria-label="Pesquisar" className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-primary-soft">
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          {themeBtn}
          <button onClick={() => setMenu((m) => !m)} aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menu} aria-controls="menu-movel" className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-primary-soft">
            {menu ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menu && (
        <nav id="menu-movel" aria-label="Menu" className="absolute inset-x-0 top-full h-[calc(100dvh-4.5rem)] overflow-auto border-t border-hair bg-surface px-4 pb-8 pt-3 lg:hidden">
          <ul className="space-y-1">
            {[{ to: '/', label: 'Início' }, { to: '/proximos', label: 'Próximos autocarros' }, ...nav].map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.to === '/'} className={({ isActive }) => `flex min-h-14 items-center rounded-xl px-4 font-display text-lg font-semibold ${isActive ? 'bg-primary-soft text-primary' : ''}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </header>
  )
}
