import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { lines } from '../data/lines'
import { linesAtStop, stopById, stopLabel } from '../data/network'
import { stops } from '../data/stops'
import { useTheme } from '../hooks/useTheme'
import type { LatLng } from '../types'

export interface TransitMapProps {
  /** Linhas visíveis (por omissão, todas) */
  lineIds?: string[]
  originId?: string | null
  destId?: string | null
  highlightStopId?: string | null
  userPos?: LatLng | null
  interactive?: boolean
  className?: string
  /** Descrição acessível do mapa */
  label?: string
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()

/** Mapa Leaflet + OpenStreetMap (tiles oficiais, com atribuição visível). */
export default function TransitMap({ lineIds, originId, destId, highlightStopId, userPos, interactive = true, className = '', label = 'Mapa dos percursos TUPR' }: TransitMapProps) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const fitted = useRef('')
  const { theme } = useTheme()

  useEffect(() => {
    if (!el.current || map.current) return
    const m = L.map(el.current, {
      zoomControl: interactive,
      dragging: interactive,
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
      const tag = isO ? '<b>Origem</b><br/>' : isD ? '<b>Destino</b><br/>' : ''
      mk.bindPopup(`${tag}<strong>${esc(s.name)}</strong>${s.detail ? `<br/><span>${esc(s.detail)}</span>` : ''}<br/><small>Linhas: ${ls}</small><br/><a href="#/paragens/${esc(s.id)}">Ver partidas →</a>`)
      mk.getElement()?.setAttribute('aria-label', stopLabel(s))
      if (special) mk.bringToFront()
    }
    if (userPos) {
      L.circleMarker(userPos, { radius: 8, color: '#fff', weight: 3, fillColor: '#1a73e8', fillOpacity: 1 }).addTo(g).bindTooltip('A sua localização', { permanent: false })
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
  }, [lineIds, originId, destId, highlightStopId, userPos, theme])

  return <div ref={el} role="region" aria-label={label} className={`h-full w-full ${className}`} />
}
