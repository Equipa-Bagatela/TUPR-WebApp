import { lazy, Suspense } from 'react'
import type { TransitMapProps } from './TransitMap'
import { tr } from '../i18n'
import { ErrorBoundary, ErrorState, Skeleton } from './ui'

const TransitMap = lazy(() => import('./TransitMap'))

/** Carrega o Leaflet só quando é preciso e protege o resto da página de falhas do mapa. */
export function MapBox({ height = 'h-[22rem]', ...props }: TransitMapProps & { height?: string }) {
  return (
    <div className={`${height} overflow-hidden rounded-2xl border border-hair bg-surface-2`}>
      <ErrorBoundary fallback={<div className="p-4"><ErrorState title={tr('map.failTitle')}>{tr('map.failText')}</ErrorState></div>}>
        <Suspense fallback={<Skeleton className="h-full w-full !rounded-none" />}>
          <TransitMap {...props} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
