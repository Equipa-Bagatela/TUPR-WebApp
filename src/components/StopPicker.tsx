import { Crosshair, MapPin, Star } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { stops } from '../data/stops'
import { linesAtStop, stopById } from '../data/network'
import { useFavorites } from '../hooks/useFavorites'
import { useT } from '../i18n'
import { matchesTokens, queryTokens, stopHaystack } from '../utils/search'
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
  /** 'row': linha sem moldura própria (para juntar origem e destino num só cartão) */
  variant?: 'field' | 'row'
  /** Ícone à esquerda no modo 'row' */
  leading?: ReactNode
}

export function StopPicker({ label, value, onChange, placeholder, onUseLocation, locating, id, variant = 'field', leading }: Props) {
  const { t } = useT()
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
    const tokens = queryTokens(query)
    const list = stops.filter((s) => matchesTokens(stopHaystack(s), tokens))
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

  const row = variant === 'row'
  const listbox = open && (
    <ul id={listId} role="listbox" aria-label={t('picker.listAria', { label })} className={`solid absolute left-0 right-0 z-30 max-h-72 overflow-auto rounded-xl border border-hair bg-surface py-1 shadow-[0_18px_40px_-12px_rgba(15,42,61,0.55)] ring-1 ring-black/5 ${row ? 'top-full mt-1' : 'mt-2'}`}>
      {options.length === 0 && <li className="px-4 py-4 text-sm text-muted">{t('picker.none', { q: query })}</li>}
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
          {favs.includes(s.id) && <Star className="h-4 w-4 shrink-0 fill-[#f5b301] text-[#f5b301]" aria-label={t('picker.fav')} />}
          <span className="flex shrink-0 gap-1" aria-label={t('stop.linesList', { list: linesAtStop(s.id).map((l) => l.name).join(', ') })}>
            {linesAtStop(s.id).map((l) => (
              <LineDot key={l.id} line={l} />
            ))}
          </span>
        </li>
      ))}
    </ul>
  )
  const inputProps = {
    id: inputId,
    type: 'text' as const,
    role: 'combobox' as const,
    'aria-expanded': open,
    'aria-controls': listId,
    'aria-autocomplete': 'list' as const,
    'aria-activedescendant': open && options[active] ? `${listId}-${active}` : undefined,
    autoComplete: 'off',
    autoCorrect: 'off',
    spellCheck: false,
    enterKeyHint: 'search' as const,
    placeholder: placeholder ?? t('picker.placeholder'),
    value: open ? query : selected ? selected.name + (selected.detail ? ` (${selected.detail})` : '') : '',
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      setOpen(true)
      setQuery('')
      e.currentTarget.select()
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      setOpen(true)
    },
    onKeyDown: onKey,
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.scrollLeft = 0
    },
  }

  if (row) {
    return (
      <div ref={wrapRef} className="relative">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <span className="pointer-events-none absolute left-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center">{leading}</span>
        <input {...inputProps} className="h-[3.4rem] w-full truncate bg-transparent pl-14 pr-16 text-[1.02rem] font-semibold text-ink placeholder:font-normal placeholder:text-muted focus-visible:outline-offset-[-3px]" />
        {listbox}
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input {...inputProps} className="h-14 w-full truncate rounded-xl border border-hair bg-surface pl-11 pr-3 text-base text-ink placeholder:text-muted focus:border-primary" />
        </div>
        {onUseLocation && (
          <button
            type="button"
            onClick={onUseLocation}
            disabled={locating}
            aria-label={t('picker.locateAria')}
            title={t('loc.use')}
            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-hair bg-surface text-primary transition hover:bg-primary-soft disabled:opacity-60"
          >
            <Crosshair className={`h-5 w-5 ${locating ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        )}
      </div>
      {listbox}
    </div>
  )
}
