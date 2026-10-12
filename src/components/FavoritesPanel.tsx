import { ArrowRight, MapPin, Star, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStop } from '../data/network'
import { useFavorites } from '../hooks/useFavorites'
import { useT } from '../i18n'

export function FavoritesPanel() {
  const { t } = useT()
  const f = useFavorites()
  const empty = f.stops.length === 0 && f.routes.length === 0
  return (
    <section aria-labelledby="fav-titulo" className="rounded-2xl border border-hair bg-surface p-4">
      <h3 id="fav-titulo" className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">
        <Star className="h-4 w-4 fill-[#f5b301] text-[#f5b301]" aria-hidden="true" /> {t('fav.heading')}
      </h3>
      {empty ? (
        <p className="text-sm text-muted">{t('fav.empty')}</p>
      ) : (
        <div className="space-y-4">
          {f.routes.length > 0 && (
            <ul className="space-y-2" aria-label={t('fav.routes')}>
              {f.routes.map((r) => (
                <li key={r.from + r.to} className="flex items-center gap-1">
                  <Link to={`/planear?de=${r.from}&para=${r.to}`} className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border border-hair px-3 text-sm font-semibold hover:bg-primary-soft">
                    <span className="truncate">{getStop(r.from).name}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-label={t('plan.toWord')} />
                    <span className="truncate">{getStop(r.to).name}</span>
                  </Link>
                  <button onClick={() => f.toggleRoute(r)} aria-label={t('fav.removeRoute', { a: getStop(r.from).name, b: getStop(r.to).name })} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-surface-2">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {f.stops.length > 0 && (
            <ul className="space-y-2" aria-label={t('fav.stops')}>
              {f.stops.map((id) => (
                <li key={id} className="flex items-center gap-1">
                  <Link to={`/paragens/${id}`} className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border border-hair px-3 text-sm font-semibold hover:bg-primary-soft">
                    <MapPin className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    <span className="truncate">{getStop(id).name}{getStop(id).detail ? <span className="font-normal text-muted"> · {getStop(id).detail}</span> : null}</span>
                  </Link>
                  <button onClick={() => f.toggleStop(id)} aria-label={t('fav.removeStop', { name: getStop(id).name })} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-surface-2">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
