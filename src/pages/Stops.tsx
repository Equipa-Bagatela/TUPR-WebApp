import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineDot } from '../components/LineBadge'
import { FavoritesPanel } from '../components/FavoritesPanel'
import { NearbyStops } from '../components/NearbyStops'
import { EmptyState, PageHeader } from '../components/ui'
import { linesAtStop } from '../data/network'
import { stops } from '../data/stops'
import { useT } from '../i18n'
import { normalize } from '../utils/service'

export default function Stops() {
  const { t } = useT()
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const tokens = normalize(q.trim()).split(/\s+/).filter(Boolean)
    return stops
      .filter((s) => tokens.every((t) => normalize(`${s.name} ${s.detail ?? ''}`).includes(t)))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt') || (a.detail ?? '').localeCompare(b.detail ?? '', 'pt'))
  }, [q])
  return (
    <>
      <PageHeader title={t('nav.stops')} subtitle={t('stops.subtitle', { n: stops.length })}>
        <div className="relative max-w-xl">
          <label htmlFor="q-paragem" className="sr-only">{t('stops.searchLabel')}</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input id="q-paragem" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('stops.searchPh')} autoComplete="off" className="h-14 w-full rounded-xl border border-hair bg-surface pl-12 pr-4 text-base" />
        </div>
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_22rem]">
        <section aria-labelledby="lista-paragens" aria-live="polite">
          <h2 id="lista-paragens" className="mb-3 text-sm font-semibold text-muted">{t('stops.count', { count: list.length })}</h2>
          {list.length === 0 ? (
            <EmptyState title={t('stops.noneFor', { q })}>{t('stops.noneHint')}</EmptyState>
          ) : (
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {list.map((s) => (
                <li key={s.id}>
                  <Link to={`/paragens/${s.id}`} className="flex min-h-16 items-center gap-3 rounded-xl border border-hair bg-surface px-4 py-3 transition hover:bg-primary-soft">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug">{s.name}</span>
                      {s.detail && <span className="block text-sm leading-snug text-muted">{s.detail}</span>}
                    </span>
                    <span className="flex gap-1" aria-label={t('stop.linesList', { list: linesAtStop(s.id).map((l) => l.name).join(', ') })}>
                      {linesAtStop(s.id).map((l) => <LineDot key={l.id} line={l} className="h-3.5 w-3.5" />)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside className="space-y-5 lg:self-start">
          <div className="rounded-2xl border border-hair bg-surface p-4"><NearbyStops limit={4} /></div>
          <FavoritesPanel />
        </aside>
      </div>
    </>
  )
}
