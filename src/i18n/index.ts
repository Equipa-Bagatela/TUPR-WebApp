import { useSyncExternalStore } from 'react'
import { createStore } from '../hooks/store'
import { urlLang } from './routing'
import { en } from './en'
import { pt } from './pt'

export type Lang = 'pt' | 'en'
type Raw = keyof typeof pt
export type Key = Raw extends infer K ? (K extends `${infer B}_one` | `${infer B}_other` ? B : K) : never

const dicts: Record<Lang, Record<string, string>> = { pt, en }

// O idioma vem do endereço (/en/... = inglês). Sem persistência: o URL é a fonte de verdade.
const store = createStore<Lang>(urlLang())

export const getLang = () => store.get()
export const setLang = (l: Lang) => store.set(l)
export const localeOf = (l: Lang = getLang()) => (l === 'pt' ? 'pt-PT' : 'en-GB')
export const pick = (o: { pt: string; en: string }) => o[getLang()]

export function translate(lang: Lang, key: Key, params?: Record<string, string | number>): string {
  const dict = dicts[lang]
  let s = dict[key] ?? pt[key as Raw] ?? key
  if (params && typeof params.count === 'number') {
    const pk = `${key}_${params.count === 1 ? 'one' : 'other'}`
    s = dict[pk] ?? s
  }
  return s.replace(/\{(\w+)\}/g, (_, k) => String(params?.[k] ?? ''))
}

/** Tradução fora de componentes (usa o idioma actual). */
export const tr = (key: Key, params?: Record<string, string | number>) => translate(getLang(), key, params)

export function useT() {
  const lang = useSyncExternalStore(store.subscribe, store.get, store.get)
  return {
    lang,
    locale: localeOf(lang),
    t: (key: Key, params?: Record<string, string | number>) => translate(lang, key, params),
  }
}
