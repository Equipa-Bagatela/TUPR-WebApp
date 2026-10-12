import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { lines } from '../data/lines'
import { linesAtStop, stopById, stopLabel } from '../data/network'
import { stops } from '../data/stops'
import { useBuses } from '../hooks/useBuses'
import { useTheme } from '../hooks/useTheme'
import { useT } from '../i18n'
import type { LatLng } from '../types'

export interface TransitMapProps {
  /** Linhas visíveis (por omissão, todas) */
  lineIds?: string[]
  originId?: string | null
  destId?: string | null
  highlightStopId?: string | null
  userPos?: LatLng | null
  /** Mostra os autocarros em tempo real (por omissão, sim) */
  showBuses?: boolean
  /** Ao mudar, o mapa centra-se neste autocarro */
  focusBusId?: string | null
  focusTick?: number
  interactive?: boolean
  className?: string
  /** Descrição acessível do mapa */
  label?: string
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()

/** Mapa Leaflet + OpenStreetMap (tiles oficiais, com atribuição visível). */
export default function TransitMap({ lineIds, originId, destId, highlightStopId, userPos, showBuses = true, focusBusId, focusTick, interactive = true, className = '', label }: TransitMapProps) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const busLayer = useRef<L.LayerGroup | null>(null)
  const busMarkers = useRef(new Map<string, L.Marker>())
  const anim = useRef(new Map<string, number>())
  const fitted = useRef('')
  const { theme } = useTheme()
  const { t, lang } = useT()

  useEffect(() => {
    if (!el.current || map.current) return
    // Em ecrãs tácteis, um dedo faz scroll da página (não fica "preso" no mapa); dois dedos movem/ampliam.
    const touch = window.matchMedia('(pointer: coarse)').matches
    const m = L.map(el.current, {
      zoomControl: interactive,
      dragging: interactive && !touch,
      scrollWheelZoom: false,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
      center: [41.1635, -7.792],
      zoom: 14,
    })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    busLayer.current = L.layerGroup().addTo(m)
    map.current = m
    const ro = new ResizeObserver(() => m.invalidateSize())
    ro.observe(el.current)
    if (interactive) {
      // roda do rato só com Ctrl/⌘ para não "prender" o scroll da página
      el.current.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) m.scrollWheelZoom.enable()
        else m.scrollWheelZoom.disable()
      })
    }
    return () => {
      ro.disconnect()
      anim.current.forEach((f) => cancelAnimationFrame(f))
      anim.current.clear()
      busMarkers.current.clear() // os marcadores pertencem ao mapa que vai ser removido
      m.remove()
      map.current = null
    }
  }, [interactive])

  useEffect(() => {
    const m = map.current
    const g = layer.current
    if (!m || !g) return
    g.clearLayers()
    const shown = lines.filter((l) => !lineIds || lineIds.includes(l.id))
    const bounds: L.LatLngExpression[] = []
    const dark = theme === 'dark'
    shown.forEach((line, i) => {
      const color = css(`--line-${line.id}`) || (dark ? line.colorDark : line.color)
      const w = i === 0 ? 7 : 3.5 // a 2.ª linha é mais fina para não tapar a 1.ª onde coincidem
      if (i === 0) L.polyline(line.shape, { color: dark ? '#0b1a26' : '#fff', weight: 10, opacity: 0.9 }).addTo(g)
      L.polyline(line.shape, { color, weight: w, opacity: 0.95 }).addTo(g).bindTooltip(line.name, { sticky: true })
      line.shape.forEach((p) => bounds.push(p))
    })
    const visibleStops = new Set(shown.flatMap((l) => l.stops.map((s) => s.stopId)))
    for (const s of stops) {
      if (!s.coords || !visibleStops.has(s.id)) continue
      const isO = s.id === originId
      const isD = s.id === destId
      const isH = s.id === highlightStopId
      const special = isO || isD || isH
      const mk = L.circleMarker(s.coords, {
        radius: special ? 10 : 6,
        weight: special ? 4 : 2.5,
        color: isO ? css('--ok') : isD ? css('--bad') : isH ? css('--focus') : css('--primary'),
        fillColor: css('--surface'),
        fillOpacity: 1,
      }).addTo(g)
      const ls = linesAtStop(s.id)
        .map((l) => esc(l.shortName))
        .join(' · ')
      const tag = isO ? `<b>${esc(t('map.origin'))}</b><br/>` : isD ? `<b>${esc(t('map.dest'))}</b><br/>` : ''
      mk.bindPopup(`${tag}<strong>${esc(s.name)}</strong>${s.detail ? `<br/><span>${esc(s.detail)}</span>` : ''}<br/><small>${esc(t('map.lines'))}: ${ls}</small><br/><a href="#/paragens/${esc(s.id)}">${esc(t('map.seeDepartures'))} →</a>`)
      mk.getElement()?.setAttribute('aria-label', stopLabel(s))
      if (special) mk.bringToFront()
    }
    if (userPos) {
      L.circleMarker(userPos, { radius: 8, color: '#fff', weight: 3, fillColor: '#1a73e8', fillOpacity: 1 }).addTo(g).bindTooltip(t('loc.yours'), { permanent: false })
      L.circle(userPos, { radius: 60, color: '#1a73e8', weight: 1, fillOpacity: 0.08 }).addTo(g)
      bounds.push(userPos)
    }
    const key = `${(lineIds ?? []).join()}|${originId}|${destId}|${highlightStopId}|${userPos ? 'u' : ''}`
    if (fitted.current !== key) {
      fitted.current = key
      const focus = [originId, destId, highlightStopId].map((id) => (id ? stopById.get(id)?.coords : undefined)).filter(Boolean) as LatLng[]
      if (focus.length >= 2) m.fitBounds(L.latLngBounds(focus), { padding: [50, 50], maxZoom: 16 })
      else if (focus.length === 1) m.setView(focus[0], 16)
      else if (bounds.length) m.fitBounds(L.latLngBounds(bounds), { padding: [24, 24] })
    }
  }, [lineIds, originId, destId, highlightStopId, userPos, theme, lang])

  /** Desliza o marcador até à nova posição (entre duas actualizações da API, ~10 s). */
  const glide = (mk: L.Marker, to: LatLng) => {
    const id = [...busMarkers.current].find(([, m]) => m === mk)?.[0]
    if (!id) return
    cancelAnimationFrame(anim.current.get(id) ?? 0)
    const from = mk.getLatLng()
    const t0 = performance.now()
    const dur = 9000
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur)
      mk.setLatLng([from.lat + (to[0] - from.lat) * k, from.lng + (to[1] - from.lng) * k])
      if (k < 1) anim.current.set(id, requestAnimationFrame(step))
    }
    anim.current.set(id, requestAnimationFrame(step))
  }

  // ───── Autocarros em tempo real (camada própria: não mexe no zoom nem no enquadramento) ─────
  const { buses } = useBuses()
  useEffect(() => {
    const g = busLayer.current
    if (!g) return
    const visible = showBuses ? buses.filter((b) => !lineIds || lineIds.includes(b.lineId)) : []
    const seen = new Set<string>()
    for (const b of visible) {
      seen.add(b.id)
      const line = lines.find((l) => l.id === b.lineId)
      if (!line) continue
      const near = stops
        .filter((s) => s.coords && linesAtStop(s.id).some((l) => l.id === line.id))
        .map((s) => ({ s, d: Math.hypot(s.coords![0] - b.position[0], (s.coords![1] - b.position[1]) * 0.75) }))
        .sort((a, c) => a.d - c.d)[0]?.s
      const status = b.status === 'ontime' ? t('bus.onTime') : t('bus.statusOther', { status: b.status || '—' })
      const html = `<strong>${esc(line.name)}</strong><br/>${esc(status)}${near ? `<br/><small>${esc(t('bus.near'))}: ${esc(near.name)}</small>` : ''}`
      const existing = busMarkers.current.get(b.id)
      if (existing) {
        glide(existing, b.position)
        existing.setPopupContent(html)
        const el = existing.getElement()
        el?.setAttribute('aria-label', `${line.name} – ${status}`)
      } else {
        const icon = L.divIcon({
          className: 'bus-marker',
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          html: `<span class="bus-pin" style="--c:var(--line-${line.id})" role="img" aria-label="${esc(line.name)}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6v6M16 6v6M2 12h19.600M18 18h3s.500-1.700.800-4.700c.300-3-.300-6.300-.800-6.300H5C3.800 7 2.800 9.500 2 13v5h2"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg></span>`,
        })
        const mk = L.marker(b.position, { icon, zIndexOffset: 1000, keyboard: true, title: line.name }).addTo(g)
        mk.bindPopup(html)
        busMarkers.current.set(b.id, mk)
      }
    }
    for (const [id, mk] of busMarkers.current) {
      if (!seen.has(id)) {
        cancelAnimationFrame(anim.current.get(id) ?? 0)
        anim.current.delete(id)
        g.removeLayer(mk)
        busMarkers.current.delete(id)
      }
    }
  }, [buses, showBuses, lineIds, lang, t])

  useEffect(() => {
    if (!focusBusId) return
    const mk = busMarkers.current.get(focusBusId)
    if (mk && map.current) {
      map.current.flyTo(mk.getLatLng(), Math.max(map.current.getZoom(), 16), { duration: 0.8 })
      mk.openPopup()
    }
  }, [focusBusId, focusTick])

  return <div ref={el} role="region" aria-label={label ?? t('map.defaultLabel')} className={`h-full w-full ${className}`} style={{ touchAction: 'pan-y pinch-zoom' }} />
}
