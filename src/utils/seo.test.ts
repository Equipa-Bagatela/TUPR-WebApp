import { describe, expect, it } from 'vitest'
import { setLang } from '../i18n'
import { allPaths, seoFor } from './seo'

describe('SEO', () => {
  for (const lang of ['pt', 'en'] as const) {
    it(`cada página tem título e descrição próprios (${lang})`, () => {
      setLang(lang)
      const infos = allPaths().map((p) => ({ p, ...seoFor(p, lang) }))
      for (const i of infos) {
        expect(i.title.length, i.p).toBeGreaterThan(10)
        expect(i.description.length, i.p).toBeGreaterThan(30)
        expect(i.noindex, i.p).toBeFalsy()
      }
      expect(new Set(infos.map((i) => i.title)).size).toBe(infos.length) // títulos únicos
      expect(infos.find((i) => i.p === '/paragens/estacao')!.title).toContain('Lrg. da Estação')
    })
  }
  it('caminhos desconhecidos pedem noindex', () => {
    expect(seoFor('/nao-existe', 'pt').noindex).toBe(true)
  })
  it('há 72 páginas (por idioma): 12 fixas/linhas + 59 paragens + …', () => {
    expect(allPaths().length).toBe(70)
  })
})
