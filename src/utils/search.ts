import { normalize } from './service'

/** Palavras em inglês (ou abreviadas) → o que aparece nos nomes das paragens, que ficam em português tal como publicados. */
const ALIASES: Record<string, string[]> = {
  station: ['estacao'], railway: ['estacao'], train: ['estacao'],
  church: ['igreja'], matrix: ['matriz'], cathedral: ['igreja'],
  school: ['escola', 'escolar'], college: ['escola'], kindergarten: ['escola'],
  hall: ['camara'], council: ['camara'], municipality: ['municipal', 'camara'], municipal: ['municipal'],
  bridge: ['ponte'], roundabout: ['rtd', 'rotunda'], cemetery: ['cemiterio'], graveyard: ['cemiterio'],
  library: ['biblioteca'], court: ['tribunal'], courthouse: ['tribunal'], police: ['gnr'],
  avenue: ['av'], street: ['r'], road: ['r'], square: ['prc', 'largo', 'lrg'], plaza: ['prc', 'largo', 'lrg'],
  'bus': ['autocarro'], parish: ['junta'], workshops: ['oficinas'], slaughterhouse: ['matadouro'],
  green: ['verde'], red: ['vermelha'], line: ['linha'],
}
/** Palavras que não ajudam a procurar (ex.: "town hall", "bus stop"). */
const STOP_WORDS = new Set(['the', 'of', 'at', 'to', 'from', 'de', 'da', 'do', 'town', 'city', 'bus', 'stop', 'near', 'in'])

export function queryTokens(q: string): string[] {
  return normalize(q.trim()).split(/\s+/).filter(Boolean)
}

/** Verdadeiro se `haystack` (texto já normalizado) responde a todas as palavras da pesquisa, em português ou inglês. */
export function matchesTokens(haystack: string, tokens: string[]): boolean {
  return tokens.every((t) => {
    if (haystack.includes(t)) return true
    const alt = ALIASES[t]
    if (alt && alt.some((a) => haystack.includes(a))) return true
    return STOP_WORDS.has(t) && !haystack.includes(t) ? tokens.length > 1 : false
  })
}

export const stopHaystack = (s: { name: string; detail?: string }) => normalize(`${s.name} ${s.detail ?? ''}`)
