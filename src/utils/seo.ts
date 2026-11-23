import { lines, lineById } from '../data/lines'
import { stopById, linesAtStop } from '../data/network'
import { stops } from '../data/stops'
import { translate, type Key, type Lang } from '../i18n'

export interface SeoInfo {
  title: string
  description: string
  /** Páginas sem valor de pesquisa (ex.: 404) */
  noindex?: boolean
}

/** Título e descrição de cada página. Os nomes das linhas usam o idioma activo (`setLang` antes de chamar, no build). */
export function seoFor(path: string, lang: Lang): SeoInfo {
  const t = (k: Key, p?: Record<string, string | number>) => translate(lang, k, p)
  const suffix = t('seo.suffix')
  const clean = path.replace(/\/$/, '') || '/'
  const page = (k: 'plan' | 'next' | 'timetables' | 'lines' | 'map' | 'terms' | 'privacy'): SeoInfo => ({
    title: t(`seo.${k}.title` as Key) + suffix,
    description: t(`seo.${k}.desc` as Key),
  })

  if (clean === '/') return { title: t('seo.home.title'), description: t('seo.home.desc') }
  if (clean === '/planear') return page('plan')
  if (clean === '/proximos') return page('next')
  if (clean === '/horarios') return page('timetables')
  if (clean === '/linhas') return page('lines')
  if (clean === '/mapa') return page('map')
  if (clean === '/termos') return page('terms')
  if (clean === '/privacidade') return page('privacy')
  if (clean === '/paragens') return { title: t('seo.stops.title') + suffix, description: t('seo.stops.desc', { n: stops.length }) }

  const line = /^\/linhas\/([\w-]+)$/.exec(clean)
  if (line) {
    const l = lineById(line[1])
    if (l) return { title: t('seo.line.title', { name: l.name }) + suffix, description: t('seo.line.desc', { name: l.name, stops: l.stops.length - 1, trips: l.trips.length, summary: l.summary }) }
  }
  const stop = /^\/paragens\/([\w-]+)$/.exec(clean)
  if (stop) {
    const s = stopById.get(stop[1])
    if (s) {
      // paragens com nome e indicação iguais (ex.: duas "Av. Dr. Manuel de Arriaga") distinguem-se pela linha
      const twin = stops.some((o) => o.id !== s.id && o.name === s.name && (o.detail ?? '') === (s.detail ?? ''))
      const extra = s.detail ?? (twin ? linesAtStop(s.id)[0]?.name : undefined)
      const label = extra ? `${s.name} (${extra})` : s.name
      return {
        title: t('seo.stop.title', { name: s.name, detail: extra ? ` (${extra})` : '' }) + suffix,
        description: t('seo.stop.desc', { label, lines: linesAtStop(s.id).map((l) => l.name).join(', ') }),
      }
    }
  }
  return { title: t('seo.notfound.title') + suffix, description: t('seo.home.desc'), noindex: true }
}

/** Todos os caminhos com página própria (para pré-geração e sitemap). */
export function allPaths(): string[] {
  return [
    '/', '/planear', '/proximos', '/horarios', '/linhas', ...lines.map((l) => `/linhas/${l.id}`),
    '/paragens', ...stops.map((s) => `/paragens/${s.id}`), '/mapa', '/termos', '/privacidade',
  ]
}
