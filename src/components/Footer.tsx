import { ArrowUpRight, Coffee } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import { CONTACT_EMAIL } from '../i18n/legal'
import { BagatelaMark } from './BagatelaMark'
import { COFFEE_URL } from './CoffeeFab'
import { Wordmark } from './Logo'

const linkClass = 'inline-flex min-h-10 items-center text-[0.95rem] text-white/85 underline-offset-4 transition hover:text-white hover:underline'
const headClass = 'mb-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/55'

export function Footer() {
  const { t } = useT()
  const nav: [string, string][] = [
    ['/planear', t('nav.plan')],
    ['/proximos', t('nav.next')],
    ['/horarios', t('nav.timetables')],
    ['/linhas', t('nav.lines')],
    ['/paragens', t('nav.stops')],
    ['/mapa', t('nav.map')],
  ]
  return (
    <footer className="mt-16 bg-[#143c57] text-white">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        {/* Marca + apoio */}
        <div className="flex flex-col gap-6 border-b border-white/15 pb-9 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <Wordmark light className="h-9 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-white/75">{t('footer.about')}</p>
          </div>
          <div className="md:text-right">
            <a
              href={COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#FFD84D] px-5 text-[0.95rem] font-extrabold text-[#143c57] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffe27a] active:scale-95"
            >
              <Coffee className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" aria-hidden="true" />
              {t('footer.support')}
              <ArrowUpRight className="h-4 w-4 opacity-70" aria-hidden="true" />
            </a>
            <p className="mt-2 text-xs text-white/60">{t('footer.supportNote')}</p>
          </div>
        </div>

        {/* Ligações */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-9 md:grid-cols-[1fr_1fr_1.6fr]">
          <nav aria-label={t('footer.navAria')}>
            <h2 className={headClass}>{t('footer.app')}</h2>
            <ul>
              {nav.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={headClass}>{t('footer.legal')}</h2>
            <ul>
              <li>
                <Link to="/termos" className={linkClass}>
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className={linkClass}>
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('report.subject', { what: 'Réguamove' }))}`} className={linkClass}>
                  {t('footer.report')}
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h2 className={headClass}>{t('footer.aboutTitle')}</h2>
            <p className="text-sm font-semibold leading-relaxed text-white">{t('footer.independent')}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/65">{t('footer.dataNote')}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/65">{t('footer.source')}</p>
          </div>
        </div>
      </div>

      {/* Barra final */}
      <div className="border-t border-white/15 bg-black/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-xs text-white/65">
            <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
            <p>
              {t('footer.mapCredit')}{' '}
              <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
                OpenStreetMap
              </a>
              . {t('footer.disclaimer')}
            </p>
          </div>
          <a
            href="https://abagatela.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex w-fit shrink-0 items-center gap-2.5 overflow-hidden rounded-full border border-white/25 bg-white/[0.06] py-1.5 pl-2 pr-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F2E9] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true">
              <BagatelaMark className="h-[1.35rem] w-[1.35rem]" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/60">Powered by</span>
              <span className="mt-1 text-[1.05rem] font-extrabold tracking-wide text-white">Bagatela</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-[#a6d062] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
