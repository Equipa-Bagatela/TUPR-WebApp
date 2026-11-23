import type { Key } from '../i18n'

/** Tarifário (informação pública do serviço). `label` é uma chave de tradução. */
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
