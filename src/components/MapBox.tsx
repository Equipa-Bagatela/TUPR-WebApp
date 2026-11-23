import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { TransitMapProps } from './TransitMap'
import { tr } from '../i18n'
import { ErrorBoundary, ErrorState, Skeleton } from './ui'

const TransitMap = lazy(() => import('./TransitMap'))

/** Carrega o Leaflet só quando é preciso e protege o resto da página de falhas do mapa. */
export function MapBox({ height = 'h-[22rem]', ...props }: TransitMapProps & { height?: string }) {
  // O mapa (Leaflet + imagens) só é carregado quando está perto de aparecer no ecrã: poupa dados e acelera a página.
  const box = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = box.current
    if (!el || near) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near])
  return (
    <div ref={box} className={`${height} relative isolate z-0 overflow-hidden rounded-2xl border border-hair bg-surface-2`}>
      <ErrorBoundary fallback={<div className="p-4"><ErrorState title={tr('map.failTitle')}>{tr('map.failText')}</ErrorState></div>}>
        {near ? (
          <Suspense fallback={<Skeleton className="h-full w-full !rounded-none" />}>
            <TransitMap {...props} />
          </Suspense>
        ) : (
          <Skeleton className="h-full w-full !rounded-none" />
        )}
      </ErrorBoundary>
    </div>
  )
}
