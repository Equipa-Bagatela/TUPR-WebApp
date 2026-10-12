import { LocateFixed } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LineDot } from '../components/LineBadge'
import { MapBox } from '../components/MapBox'
import { PageHeader } from '../components/ui'
import { lines } from '../data/lines'
import { stopById } from '../data/network'
import { useGeolocation } from '../hooks/useGeolocation'

export default function MapPage() {
  const [sp] = useSearchParams()
  const [on, setOn] = useState<string[]>(lines.map((l) => l.id))
  const geo = useGeolocation()
  const ok = (k: string) => (sp.get(k) && stopById.has(sp.get(k)!) ? sp.get(k)! : null)
  const toggle = (id: string) => setOn((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  return (
    <>
      <PageHeader title="Mapa" subtitle="Percursos e paragens do TUPR na zona urbana do Peso da Régua." />
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Linhas visíveis" className="flex flex-wrap gap-2">
            {lines.map((l) => (
              <button key={l.id} aria-pressed={on.includes(l.id)} onClick={() => toggle(l.id)} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold ${on.includes(l.id) ? 'border-primary bg-primary-soft' : 'border-hair bg-surface text-muted'}`}>
                <LineDot line={l} className="h-3.5 w-3.5" /> {l.name}
                <span className="sr-only">{on.includes(l.id) ? ' (visível)' : ' (escondida)'}</span>
              </button>
            ))}
          </div>
          <button onClick={geo.request} disabled={geo.status === 'loading'} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-hair bg-surface px-4 text-sm font-bold text-primary disabled:opacity-60">
            <LocateFixed className="h-4 w-4" aria-hidden="true" /> {geo.status === 'loading' ? 'A localizar…' : geo.pos ? 'Atualizar localização' : 'Usar a minha localização'}
          </button>
        </div>
        <div aria-live="polite" className="text-sm text-muted">
          {geo.status === 'denied' && 'Localização não autorizada — o mapa funciona na mesma.'}
          {geo.status === 'error' && 'Não foi possível obter a localização.'}
          {geo.status === 'granted' && '📍 A sua localização está assinalada no mapa.'}
        </div>
        <MapBox height="h-[65dvh] min-h-[24rem]" lineIds={on} originId={ok('de')} destId={ok('para')} highlightStopId={ok('paragem')} userPos={geo.pos} label="Mapa interativo das linhas e paragens do TUPR" />
        <p className="text-sm text-muted">Toque numa paragem para ver as partidas. Use Ctrl/⌘ + roda do rato para ampliar. As posições das paragens são aproximadas.</p>
      </div>
    </>
  )
}
