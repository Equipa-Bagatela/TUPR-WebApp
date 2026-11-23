import type { Lang } from './index'

/**
 * Endereços: português na raiz (`/horarios`), inglês sob `/en` (`/en/horarios`).
 * BASE só é diferente de '' quando a app está numa subpasta (ex.: GitHub Pages).
 */
export const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')

export function splitPath(pathname: string): { lang: Lang; path: string } {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname
  if (rest === '/en' || rest.startsWith('/en/')) return { lang: 'en', path: rest.slice(3) || '/' }
  return { lang: 'pt', path: rest }
}

export const urlLang = (): Lang => (typeof window === 'undefined' ? 'pt' : splitPath(window.location.pathname).lang)

export const routerBasename = (lang: Lang) => BASE + (lang === 'en' ? '/en' : '')

/** Endereço público (sem domínio) de um caminho da app, no idioma pedido. */
export function urlFor(lang: Lang, path: string): string {
  const p = path === '/' ? '' : path.replace(/\/$/, '')
  return `${routerBasename(lang)}${p}` || '/'
}

/** Muda de idioma indo para o mesmo caminho no outro prefixo (carrega a página nova). */
export function switchLanguage(to: Lang) {
  const { path } = splitPath(window.location.pathname)
  window.location.assign(urlFor(to, path) + window.location.search)
}
