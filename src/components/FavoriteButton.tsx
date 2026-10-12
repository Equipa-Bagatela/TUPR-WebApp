import { Star } from 'lucide-react'

export function FavoriteButton({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Remover dos favoritos: ${label}` : `Guardar nos favoritos: ${label}`}
      title={active ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition active:scale-90 ${active ? 'border-transparent bg-[#f5b301] text-[#3b2a00]' : 'border-hair bg-surface text-muted hover:text-ink'}`}
    >
      <Star className={`h-5 w-5 ${active ? 'fill-current' : ''}`} aria-hidden="true" />
    </button>
  )
}
