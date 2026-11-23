import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useT } from '../i18n'
import { urlFor } from '../i18n/routing'
import { seoFor } from '../utils/seo'

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    const m = /\[(\w+)="([^"]+)"\]/.exec(selector)
    if (m) el.setAttribute(m[1], m[2])
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

/** Mantém título, descrição e endereço canónico em dia quando se navega dentro da app. */
export function Seo() {
  const { pathname } = useLocation()
  const { lang } = useT()
  useEffect(() => {
    const info = seoFor(pathname, lang)
    const url = window.location.origin + urlFor(lang, pathname)
    document.title = info.title
    setMeta('meta[name="description"]', 'content', info.description)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', info.title)
    setMeta('meta[property="og:description"]', 'content', info.description)
    setMeta('meta[property="og:url"]', 'content', url)
    // 404: pede noindex (sem mexer num noindex já definido no build)
    document.head.querySelector('meta[name="robots"][data-dyn]')?.remove()
    if (info.noindex && !document.head.querySelector('meta[name="robots"]')) {
      const m = document.createElement('meta')
      m.setAttribute('name', 'robots')
      m.setAttribute('content', 'noindex')
      m.setAttribute('data-dyn', '1')
      document.head.appendChild(m)
    }
  }, [pathname, lang])
  return null
}
