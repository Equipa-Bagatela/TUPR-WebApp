import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import { BagatelaMark } from './BagatelaMark'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useT()
  return (
    <footer className="mt-16 bg-[#143c57] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm text-white/80">{t('footer.about')}</p>
        </div>
        <nav aria-label={t('footer.navAria')}>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70">{t('footer.app')}</h2>
          <ul className="text-sm">
            {[['/planear', t('nav.plan')], ['/proximos', t('nav.next')], ['/horarios', t('nav.timetables')], ['/linhas', t('nav.lines')], ['/paragens', t('nav.stops')], ['/mapa', t('nav.map')]].map(([to, l]) => (
              <li key={to}>
                <Link to={to} className="inline-flex min-h-11 items-center hover:underline">{l}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70">{t('footer.aboutTitle')}</h2>
          <p className="text-sm font-semibold text-white">{t('footer.independent')}</p>
          <p className="mt-2 text-sm text-white/80">{t('footer.dataNote')}</p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="max-w-2xl text-xs text-white/70">
            {t('footer.mapCredit')} <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>. {t('footer.disclaimer')}
          </p>
          <a
            href="https://bagatela.pt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Powered by Bagatela (bagatela.pt)"
            className="group relative inline-flex w-fit shrink-0 items-center gap-2.5 overflow-hidden rounded-full border border-white/25 bg-white/[0.06] py-1.5 pl-2 pr-4 transition duration-300 hover:-translate-y-0.5 hover:border-accent/70 hover:bg-white/10"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F2E9] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true">
              <BagatelaMark className="h-[1.35rem] w-[1.35rem]" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/60">Powered by</span>
              <span className="mt-1 font-display text-[1.05rem] font-extrabold tracking-wide text-white">Bagatela</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
