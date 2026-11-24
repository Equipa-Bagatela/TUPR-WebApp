import { Map as MapIcon } from 'lucide-react'
import { useT } from '../i18n'

export const MAP_SECTION_ID = 'mapa-seccao'

/** Em telemóvel o mapa fica no fim da página; este botão leva-o até ao mapa. */
export function JumpToMap({ className = '' }: { className?: string }) {
  const { t } = useT()
  return (
    <button
      type="button"
      onClick={() => document.getElementById(MAP_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-hair bg-surface px-4 text-sm font-bold text-primary lg:hidden ${className}`}
    >
      <MapIcon className="h-4 w-4" aria-hidden="true" /> {t('stop.seeMap')}
    </button>
  )
}
