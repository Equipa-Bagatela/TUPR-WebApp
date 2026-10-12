import { Menu, Moon, Navigation, Search, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { setLang, useT, type Lang } from '../i18n'
import { smoothUpdate } from '../utils/transition'
import { Logo } from './Logo'
import { SearchDialog } from './SearchDialog'

const link = ({ isActive }: { isActive: boolean }) =>
  `relative inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-3 text-[0.95rem] font-semibold transition-colors hover:bg-primary-soft ${isActive ? 'text-primary after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[3px] after:rounded-full after:bg-accent' : 'text-ink'}`

export function LangSwitch() {
  const { lang, t } = useT()
  const pick = (l: Lang) => l !== lang && smoothUpdate(() => setLang(l))
  return (
    <div role="group" aria-label={t('lang.label')} className="inline-flex rounded-full border border-hair p-0.5 text-xs font-bold">
      {(['pt', 'en'] as const).map((l) => (
        <button key={l} onClick={() => pick(l)} aria-pressed={lang === l} lang={l} aria-label={l === 'pt' ? 'Português' : 'English'} className={`min-h-10 min-w-10 rounded-full px-2.5 uppercase transition-colors ${lang === l ? 'bg-primary text-on-primary' : 'text-ink hover:bg-primary-soft'}`}>
          {l}
        </button>
      ))}
    </div>
  )
}

export function Header() {
  const { t } = useT()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()
  const loc = useLocation()
  const go = useNavigate()
  const nav = [
    { to: '/planear', label: t('nav.plan') },
    { to: '/horarios', label: t('nav.timetables') },
    { to: '/linhas', label: t('nav.lines') },
    { to: '/paragens', label: t('nav.stops') },
    { to: '/mapa', label: t('nav.map') },
  ]
  useEffect(() => setMenu(false), [loc.pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [menu])

  const dark = theme === 'dark'
  // Sol e lua empilhados: ao trocar, um roda e encolhe enquanto o outro roda e cresce
  const icon = 'absolute inset-0 m-auto h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.5,1)]'
  const themeBtn = (
    <button
      onClick={() => toggle()}
      aria-label={dark ? t('theme.toLight') : t('theme.toDark')}
      aria-pressed={dark}
      className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full text-ink transition-colors hover:bg-primary-soft"
    >
      <Sun className={`${icon} ${dark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} aria-hidden="true" />
      <Moon className={`${icon} ${dark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} aria-hidden="true" />
    </button>
  )

  return (
    <header className={`sticky top-0 z-[1100] border-b bg-surface transition-shadow duration-300 ${scrolled ? 'border-hair shadow-[0_6px_20px_-12px_rgba(15,42,61,0.35)]' : 'border-hair'}`}>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[1300] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-on-primary">
        {t('nav.skip')}
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" aria-label={t('nav.homeAria')} className="shrink-0 rounded-lg transition-transform active:scale-95">
          <Logo />
        </Link>
        <nav aria-label={t('nav.main')} className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={link}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button onClick={() => setSearch(true)} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-hair px-3.5 text-sm font-semibold transition-colors hover:bg-primary-soft">
            <Search className="h-4 w-4" aria-hidden="true" /> {t('nav.search')}
          </button>
          <LangSwitch />
          {themeBtn}
          <button onClick={() => go('/planear')} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-bold text-on-primary transition hover:opacity-90 active:scale-95">
            <Navigation className="h-4 w-4" aria-hidden="true" /> {t('plan.title')}
          </button>
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <button onClick={() => setSearch(true)} aria-label={t('nav.search')} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-primary-soft">
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          {themeBtn}
          <button onClick={() => setMenu((m) => !m)} aria-label={menu ? t('nav.closeMenu') : t('nav.openMenu')} aria-expanded={menu} aria-controls="menu-movel" className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-primary-soft">
            <span key={String(menu)} className="icon-pop inline-flex">{menu ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}</span>
          </button>
        </div>
      </div>
      {menu && (
        <nav id="menu-movel" aria-label={t('nav.menu')} className="menu-in absolute inset-x-0 top-full h-[calc(100dvh-4.5rem)] overflow-auto border-t border-hair bg-surface px-4 pb-8 pt-3 lg:hidden">
          <div className="mb-3 flex items-center justify-between rounded-xl bg-surface-2 px-4 py-2">
            <span className="text-sm font-semibold text-muted">{t('lang.label')}</span>
            <LangSwitch />
          </div>
          <ul className="space-y-1">
            {[{ to: '/', label: t('nav.home') }, { to: '/proximos', label: t('nav.next') }, ...nav].map((n, i) => (
              <li key={n.to} className="rise" style={{ animationDelay: `${i * 40}ms` }}>
                <NavLink to={n.to} end={n.to === '/'} className={({ isActive }) => `flex min-h-14 items-center rounded-xl px-4 font-display text-lg font-semibold transition-colors ${isActive ? 'bg-primary-soft text-primary' : ''}`}>
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
