/** Tarifário – transcrito do PDF oficial. */
export interface Tariff {
  label: string
  price: string
}
export const tariffs: Tariff[] = [
  { label: 'Título de viagem', price: '0,50 €' },
  { label: 'Passe geral', price: '15 €' },
  { label: 'Passe SUB 18+TP', price: 'Gratuito' },
  { label: 'Passe SUB 23+TP', price: 'Gratuito' },
  { label: 'Passe para Aposentados', price: '10 €' },
  { label: 'Passe para pessoas com necessidades especiais', price: '10 €' },
  { label: 'Passe para Antigos Combatentes e viúvas de Antigos Combatentes', price: 'Gratuito' },
]
export const OFFICIAL_PDF = 'https://www.cm-pesoregua.pt/cmpesodaregua/uploads/document/file/3201/horarios_tupr_2025.pdf'
export const CM_SITE = 'https://www.cm-pesoregua.pt/'
