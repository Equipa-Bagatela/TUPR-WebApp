import type { Key } from '../i18n'

/** Tarifário – transcrito do PDF oficial. `label` é uma chave de tradução; `price` é o valor do PDF. */
export interface Tariff {
  label: Key
  price: string
  free?: boolean
}
export const tariffs: Tariff[] = [
  { label: 'tariff.ticket', price: '0,50 €' },
  { label: 'tariff.general', price: '15 €' },
  { label: 'tariff.sub18', price: '', free: true },
  { label: 'tariff.sub23', price: '', free: true },
  { label: 'tariff.retired', price: '10 €' },
  { label: 'tariff.disabled', price: '10 €' },
  { label: 'tariff.veterans', price: '', free: true },
]
export const OFFICIAL_PDF = 'https://www.cm-pesoregua.pt/cmpesodaregua/uploads/document/file/3201/horarios_tupr_2025.pdf'
export const CM_SITE = 'https://www.cm-pesoregua.pt/'
