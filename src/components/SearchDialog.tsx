import { Bus, MapPin, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { lines } from '../data/lines'
import { stops } from '../data/stops'
import { normalize } from '../utils/service'

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const nav = useNavigate()
  const input = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const tokens = normalize(q.trim()).split(/\s+/).filter(Boolean)
    if (!tokens.length) return []
    const ls = lines.filter((l) => tokens.every((t) => normalize(l.name).includes(t))).map((l) => ({ kind: 'line' as const, id: l.id, title: l.name, sub: 'Linha', to: `/linhas/${l.id}` }))
    const ss = stops
      .filter((s) => tokens.every((t) => normalize(`${s.name} ${s.detail ?? ''}`).includes(t)))
      .slice(0, 12)
      .map((s) => ({ kind: 'stop' as const, id: s.id, title: s.name, sub: s.detail ?? 'Paragem', to: `/paragens/${s.id}` }))
    return [...ls, ...ss]
  }, [q])

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => input.current?.focus(), 0)
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open])
  useEffect(() => setActive(0), [q])
  if (!open) return null

  const go = (to: string) => {
    onClose()
    nav(to)
  }
  const trap = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return onClose()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && results[active]) go(results[active].to)
    else if (e.key === 'Tab') {
      const f = dialog.current?.querySelectorAll<HTMLElement>('button, input')
      if (!f?.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-start justify-center bg-ink/50 p-3 pt-[8vh] sm:pt-[12vh]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-label="Pesquisar paragens e linhas" onKeyDown={trap} className="w-full max-w-xl overflow-hidden rounded-2xl border border-hair bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-hair px-3">
          <Search className="h-5 w-5 text-muted" aria-hidden="true" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Pesquisar paragem ou linha…" aria-label="Pesquisar paragem ou linha" role="combobox" aria-expanded={results.length > 0} aria-controls="search-results" className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none focus-visible:!outline-none" />
          <button onClick={onClose} aria-label="Fechar pesquisa" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-surface-2">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <ul id="search-results" role="listbox" className="max-h-[55vh] overflow-auto py-1">
          {!q.trim() && <li className="px-4 py-5 text-sm text-muted">Escreva o nome de uma paragem (ex.: “estação”, “câmara”, “igreja matriz”) ou de uma linha.</li>}
          {q.trim() && results.length === 0 && <li className="px-4 py-5 text-sm text-muted">Nenhum resultado para “{q}”.</li>}
          {results.map((r, i) => (
            <li key={r.kind + r.id} role="option" aria-selected={i === active} onClick={() => go(r.to)} onMouseMove={() => setActive(i)} className={`flex min-h-14 cursor-pointer items-center gap-3 px-4 py-2 ${i === active ? 'bg-primary-soft' : ''}`}>
              {r.kind === 'line' ? <Bus className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> : <MapPin className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />}
              <span className="min-w-0">
                <span className="block font-semibold leading-snug">{r.title}</span>
                <span className="block truncate text-sm text-muted">{r.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
