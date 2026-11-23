import { Link } from 'react-router-dom'
import { useT } from '../i18n'
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
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/70 sm:px-6">
          {t('footer.mapCredit')} <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>. {t('footer.disclaimer')}
        </p>
        <p className="mx-auto max-w-6xl px-4 pb-5 text-xs font-semibold text-white/85 sm:px-6">Powered by{' '}<a className="underline hover:text-white" href="https://bagatela.pt" target="_blank" rel="noopener noreferrer">Bagatela</a></p>
      </div>
    </footer>
  )
}
