import { Crosshair, MapPin, Star } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { stops } from '../data/stops'
import { linesAtStop, stopById } from '../data/network'
import { useFavorites } from '../hooks/useFavorites'
import { normalize } from '../utils/service'
import { LineDot } from './LineBadge'

interface Props {
  label: string
  value: string | null
  onChange: (id: string | null) => void
  placeholder?: string
  /** Se definido, mostra o botão "usar a minha localização" */
  onUseLocation?: () => void
  locating?: boolean
  id?: string
}

export function StopPicker({ label, value, onChange, placeholder = 'Escolher paragem', onUseLocation, locating, id }: Props) {
  const uid = useId()
  const inputId = id ?? `${uid}-input`
  const listId = `${uid}-list`
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const { stops: favs } = useFavorites()
  const selected = value ? stopById.get(value) : undefined

  const options = useMemo(() => {
    const q = normalize(query.trim())
    const tokens = q.split(/\s+/).filter(Boolean)
    const list = stops.filter((s) => {
      const hay = normalize(`${s.name} ${s.detail ?? ''}`)
      return tokens.every((t) => hay.includes(t))
    })
    return list.sort((a, b) => Number(favs.includes(b.id)) - Number(favs.includes(a.id)) || a.name.localeCompare(b.name, 'pt') || (a.detail ?? '').localeCompare(b.detail ?? '', 'pt')).slice(0, 60)
  }, [query, favs])

  useEffect(() => setActive(0), [query, open])
  useEffect(() => {
    if (!open) return
    const off = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', off)
    return () => document.removeEventListener('pointerdown', off)
  }, [open])
  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open, listId])

  const choose = (sid: string) => {
    onChange(sid)
    setQuery('')
    setOpen(false)
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(a + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && open && options[active]) {
      e.preventDefault()
      choose(options[active].id)
    } else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            placeholder={placeholder}
            value={open ? query : selected ? selected.name + (selected.detail ? ` (${selected.detail})` : '') : ''}
            onFocus={(e) => {
              setOpen(true)
              setQuery('')
              e.currentTarget.select()
            }}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onKeyDown={onKey}
            className="h-14 w-full truncate rounded-xl border border-hair bg-surface pl-11 pr-3 text-base text-ink placeholder:text-muted focus:border-primary"
          />
        </div>
        {onUseLocation && (
          <button
            type="button"
            onClick={onUseLocation}
            disabled={locating}
            aria-label="Usar a minha localização para escolher a paragem mais próxima"
            title="Usar a minha localização"
            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-hair bg-surface text-primary transition hover:bg-primary-soft disabled:opacity-60"
          >
            <Crosshair className={`h-5 w-5 ${locating ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        )}
      </div>
      {open && (
        <ul id={listId} role="listbox" aria-label={`${label}: paragens`} className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-auto rounded-xl border border-hair bg-surface py-1 shadow-lg">
          {options.length === 0 && <li className="px-4 py-4 text-sm text-muted">Nenhuma paragem encontrada para “{query}”.</li>}
          {options.map((s, i) => (
            <li
              key={s.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={s.id === value}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(s.id)}
              onMouseMove={() => setActive(i)}
              className={`flex min-h-12 cursor-pointer items-center gap-3 px-4 py-2 ${i === active ? 'bg-primary-soft' : ''}`}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[0.95rem] font-semibold leading-snug">{s.name}</span>
                {s.detail && <span className="block text-sm leading-snug text-muted">{s.detail}</span>}
              </span>
              {favs.includes(s.id) && <Star className="h-4 w-4 shrink-0 fill-[#f5b301] text-[#f5b301]" aria-label="Favorita" />}
              <span className="flex shrink-0 gap-1" aria-label={`Linhas: ${linesAtStop(s.id).map((l) => l.name).join(', ')}`}>
                {linesAtStop(s.id).map((l) => (
                  <LineDot key={l.id} line={l} />
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
