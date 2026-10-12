import { ArrowRight, Bus, CalendarClock, Clock, Info, MapPinned, Route, Ticket } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { FavoritesPanel } from '../components/FavoritesPanel'
import { LineCard } from '../components/LineCard'
import { MapBox } from '../components/MapBox'
import { NearbyStops } from '../components/NearbyStops'
import { NowPanel } from '../components/NowPanel'
import { PlannerForm } from '../components/PlannerForm'
import { ServiceStatusCard } from '../components/ServiceStatusCard'
import { SectionTitle } from '../components/ui'
import { lines } from '../data/lines'
import { tariffs } from '../data/tariffs'
import { useNow } from '../hooks/useNow'

const quick = [
  { to: '/horarios', label: 'Horários', icon: CalendarClock },
  { to: '/linhas', label: 'Linhas', icon: Route },
  { to: '/paragens', label: 'Paragens', icon: Bus },
  { to: '/mapa', label: 'Mapa', icon: MapPinned },
]

export default function Home() {
  const nav = useNavigate()
  const now = useNow(60_000)
  return (
    <>
      <section className="relative overflow-hidden bg-[#143c57] text-white" aria-labelledby="hero-titulo">
        {/* motivo: curvas do rio Douro */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g fill="none" stroke="#fff" strokeOpacity="0.09" strokeWidth="2">
            <path d="M-20 420C180 330 260 470 470 380S760 250 960 330s220-20 300-90" />
            <path d="M-20 460C190 380 280 510 480 430S770 300 970 380s220-10 300-70" />
            <path d="M-20 500C200 430 300 550 490 480S780 350 980 430s220 0 300-50" />
          </g>
          <circle cx="1040" cy="120" r="150" fill="none" stroke="#7cb342" strokeOpacity="0.35" strokeWidth="2" />
        </svg>
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pb-28 sm:pt-16">
          <h1 id="hero-titulo" className="max-w-3xl text-[2.1rem] font-extrabold leading-[1.1] sm:text-5xl">
            Transportes Urbanos
            <br />
            do Peso da Régua
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">Consulte horários e planeie a sua viagem pela cidade.</p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:-mt-20 sm:px-6">
        <section aria-labelledby="planear-titulo" className="rounded-3xl border border-hair bg-surface p-5 shadow-sm sm:p-8">
          <h2 id="planear-titulo" className="mb-5 text-xl font-bold text-primary sm:text-2xl">Planear viagem</h2>
          <PlannerForm onSubmit={(p) => nav(`/planear?de=${p.from}&para=${p.to}&data=${p.date}&hora=${p.time}`)} />
          <div className="mt-5 border-t border-hair pt-5">
            <Link to="/proximos" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hair px-5 font-bold text-primary hover:bg-primary-soft">
              <Clock className="h-5 w-5" aria-hidden="true" /> Ver próximos autocarros
            </Link>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-12 sm:px-6 sm:pt-16">
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

        <section aria-labelledby="acessos-titulo">
          <h2 id="acessos-titulo" className="sr-only">Acessos rápidos</h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {quick.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className="flex min-h-24 flex-col justify-between rounded-2xl border border-hair bg-surface p-4 transition hover:-translate-y-0.5 hover:bg-primary-soft">
                  <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  <span className="mt-3 flex items-center justify-between font-display text-lg font-bold">
                    {label} <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="linhas-titulo">
          <SectionTitle eyebrow="Rede TUPR" title="Linhas" action={<Link to="/linhas" className="inline-flex min-h-11 items-center font-bold text-primary hover:underline">Ver todas</Link>} />
          <div className="grid gap-5 md:grid-cols-2">
            {lines.map((l) => (
              <LineCard key={l.id} line={l} />
            ))}
          </div>
        </section>

        <section aria-labelledby="mapa-titulo">
          <SectionTitle eyebrow="Peso da Régua" title="Mapa dos TUPR" action={<Link to="/mapa" className="inline-flex min-h-11 items-center font-bold text-primary hover:underline">Abrir mapa</Link>} />
          <MapBox height="h-[22rem] sm:h-[28rem]" label="Mapa simplificado dos percursos das linhas Verde e Vermelha" />
        </section>

        <section aria-labelledby="info-titulo">
          <SectionTitle eyebrow="Informação" title="Informações úteis" />
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-hair bg-surface p-5">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Clock className="h-5 w-5 text-primary" aria-hidden="true" /> Horário de funcionamento</h3>
              <ul className="space-y-2 text-[0.95rem]">
                <li><strong>Segunda-feira a sábado</strong> — viagens de hora a hora, das 08:00 às 19:00 (partida).</li>
                <li>As viagens das <strong>18:00 e 19:00 não se realizam ao sábado</strong>.</li>
                <li>O documento oficial não refere domingos nem feriados.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-hair bg-surface p-5">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Ticket className="h-5 w-5 text-primary" aria-hidden="true" /> Tarifário</h3>
              <dl className="space-y-2 text-sm">
                {tariffs.map((t) => (
                  <div key={t.label} className="flex items-baseline justify-between gap-4 border-b border-hair pb-2 last:border-0 last:pb-0">
                    <dt>{t.label}</dt>
                    <dd className="shrink-0 font-bold">{t.price}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-2xl border border-hair bg-surface p-5">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Info className="h-5 w-5 text-primary" aria-hidden="true" /> Bom saber</h3>
              <ul className="space-y-2 text-[0.95rem]">
                <li>As duas linhas são <strong>circulares</strong>: partem e terminam na R. Fernando Augusto Bandeira.</li>
                <li>Condições de obtenção dos passes e outras informações em <a className="font-semibold text-primary underline" href="https://www.cm-pesoregua.pt/" target="_blank" rel="noopener noreferrer">cm-pesoregua.pt</a>.</li>
                <li>A hora usada é a do seu dispositivo.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
