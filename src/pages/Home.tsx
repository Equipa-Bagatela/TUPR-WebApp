import { ArrowRight, Bus, CalendarClock, Clock, Info, MapPinned, Route, Ticket } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { FavoritesPanel } from '../components/FavoritesPanel'
import { LineCard } from '../components/LineCard'
import { LiveBuses } from '../components/LiveBuses'
import { MapBox } from '../components/MapBox'
import { NearbyStops } from '../components/NearbyStops'
import { NowPanel } from '../components/NowPanel'
import { PlannerForm } from '../components/PlannerForm'
import { ServiceStatusCard } from '../components/ServiceStatusCard'
import { Reveal, SectionTitle } from '../components/ui'
import { lines } from '../data/lines'
import { tariffs } from '../data/tariffs'
import { useNow } from '../hooks/useNow'
import { useT } from '../i18n'

export default function Home() {
  const { t } = useT()
  const nav = useNavigate()
  const now = useNow(60_000)
  const quick = [
    { to: '/horarios', label: t('nav.timetables'), icon: CalendarClock },
    { to: '/linhas', label: t('nav.lines'), icon: Route },
    { to: '/paragens', label: t('nav.stops'), icon: Bus },
    { to: '/mapa', label: t('nav.map'), icon: MapPinned },
  ]
  return (
    <>
      <section className="relative overflow-hidden bg-[#143c57] text-white" aria-labelledby="hero-titulo">
        {/* motivo: curvas do rio Douro */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g fill="none" stroke="#fff" strokeOpacity="0.09" strokeWidth="2">
            <path className="river" d="M-20 420C180 330 260 470 470 380S760 250 960 330s220-20 300-90" />
            <path className="river r2" d="M-20 460C190 380 280 510 480 430S770 300 970 380s220-10 300-70" />
            <path className="river r3" d="M-20 500C200 430 300 550 490 480S780 350 980 430s220 0 300-50" />
          </g>
          <circle cx="1040" cy="120" r="150" fill="none" stroke="#7cb342" strokeOpacity="0.35" strokeWidth="2" />
        </svg>
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pb-28 sm:pt-16">
          <h1 id="hero-titulo" className="rise max-w-3xl text-[2.1rem] font-extrabold leading-[1.1] sm:text-5xl">
            {t('home.title1')}
            <br />
            {t('home.title2')}
          </h1>
          <p className="rise mt-4 max-w-xl text-lg text-white/85" style={{ animationDelay: '120ms' }}>{t('home.subtitle')}</p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:-mt-20 sm:px-6">
        <section aria-labelledby="planear-titulo" className="rise rounded-3xl border border-hair bg-surface p-5 shadow-sm sm:p-8" style={{ animationDelay: '200ms' }}>
          <h2 id="planear-titulo" className="mb-5 text-xl font-bold text-primary sm:text-2xl">{t('plan.title')}</h2>
          <PlannerForm onSubmit={(p) => nav(`/planear?de=${p.from}&para=${p.to}&data=${p.date}&hora=${p.time}`)} />
          <div className="mt-5 border-t border-hair pt-5">
            <Link to="/proximos" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hair px-5 font-bold text-primary transition-colors hover:bg-primary-soft">
              <Clock className="h-5 w-5" aria-hidden="true" /> {t('home.seeNext')}
            </Link>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-12 sm:px-6 sm:pt-16">
        <Reveal>
          <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            <NowPanel />
            <div className="space-y-5">
              <ServiceStatusCard now={now} />
              <FavoritesPanel />
              <div className="rounded-2xl border border-hair bg-surface p-4">
                <NearbyStops />
              </div>
            </div>
          </div>
        </Reveal>

        <section aria-labelledby="acessos-titulo">
          <h2 id="acessos-titulo" className="sr-only">{t('home.quick')}</h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {quick.map(({ to, label, icon: Icon }, i) => (
              <li key={to}>
                <Reveal delay={i * 70}>
                  <Link to={to} className="group flex min-h-24 flex-col justify-between rounded-2xl border border-hair bg-surface p-4 transition hover:-translate-y-1 hover:bg-primary-soft hover:shadow-md">
                    <Icon className="h-7 w-7 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
                    <span className="mt-3 flex items-center justify-between font-display text-lg font-bold">
                      {label} <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="linhas-titulo">
          <Reveal>
            <SectionTitle eyebrow={t('home.network')} title={t('nav.lines')} action={<Link to="/linhas" className="inline-flex min-h-11 items-center font-bold text-primary hover:underline">{t('home.seeAll')}</Link>} />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {lines.map((l, i) => (
              <Reveal key={l.id} delay={i * 100}>
                <LineCard line={l} />
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="mapa-titulo">
          <Reveal>
            <SectionTitle eyebrow="Peso da Régua" title={t('home.mapTitle')} action={<Link to="/mapa" className="inline-flex min-h-11 items-center font-bold text-primary hover:underline">{t('home.openMap')}</Link>} />
            <div className="mb-4"><LiveBuses compact /></div>
            <MapBox height="h-[22rem] sm:h-[28rem]" label={t('home.mapAria')} />
          </Reveal>
        </section>

        <section aria-labelledby="info-titulo">
          <Reveal>
            <SectionTitle eyebrow={t('home.infoEyebrow')} title={t('home.infoTitle')} />
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-2xl border border-hair bg-surface p-5">
                <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Clock className="h-5 w-5 text-primary" aria-hidden="true" /> {t('info.hoursTitle')}</h3>
                <ul className="space-y-2 text-[0.95rem]">
                  <li>{t('info.hours1')}</li>
                  <li>{t('info.hours2')}</li>
                  <li>{t('info.hours3')}</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="h-full rounded-2xl border border-hair bg-surface p-5">
                <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Ticket className="h-5 w-5 text-primary" aria-hidden="true" /> {t('info.fares')}</h3>
                <dl className="space-y-2 text-sm">
                  {tariffs.map((x) => (
                    <div key={x.label} className="flex items-baseline justify-between gap-4 border-b border-hair pb-2 last:border-0 last:pb-0">
                      <dt>{t(x.label)}</dt>
                      <dd className="shrink-0 font-bold">{x.free ? t('tariff.free') : x.price}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="h-full rounded-2xl border border-hair bg-surface p-5">
                <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Info className="h-5 w-5 text-primary" aria-hidden="true" /> {t('info.goodToKnow')}</h3>
                <ul className="space-y-2 text-[0.95rem]">
                  <li>{t('info.circular')}</li>
                  <li>{t('info.passes')} <a className="font-semibold text-primary underline" href="https://www.cm-pesoregua.pt/" target="_blank" rel="noopener noreferrer">cm-pesoregua.pt</a>.</li>
                  <li>{t('info.clock')}</li>
                  <li>{t('info.namesNote')}</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  )
}
