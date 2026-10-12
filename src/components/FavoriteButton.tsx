import { Star } from 'lucide-react'
import { useT } from '../i18n'

export function FavoriteButton({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  const { t } = useT()
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? t('fav.removeLabel', { name: label }) : t('fav.addLabel', { name: label })}
      title={active ? t('fav.remove') : t('fav.add')}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition active:scale-90 ${active ? 'border-transparent bg-[#f5b301] text-[#3b2a00]' : 'border-hair bg-surface text-muted hover:text-ink'}`}
    >
      <Star className={`h-5 w-5 transition-transform duration-300 ${active ? 'scale-110 fill-current' : ''}`} aria-hidden="true" />
    </button>
  )
}
