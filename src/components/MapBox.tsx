import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { TransitMapProps } from './TransitMap'
import { tr } from '../i18n'
import { ErrorBoundary, ErrorState, Skeleton } from './ui'

const RELOADED = 'tupr:chunk-reload'

/**
 * Carrega o mapa à parte. Se o ficheiro já não existir (nova versão publicada enquanto a página estava aberta),
 * recarrega a página uma vez para apanhar a versão nova, em vez de deixar o mapa partido.
 */
const TransitMap = lazy(() =>
  import('./TransitMap')
    .then((m) => {
      try {
        sessionStorage.removeItem(RELOADED)
      } catch {
        /* ignora */
      }
      return m
    })
    .catch((err) => {
      let already = true
      try {
        already = sessionStorage.getItem(RELOADED) === '1'
        if (!already) sessionStorage.setItem(RELOADED, '1')
      } catch {
        /* sem sessionStorage: não recarrega para evitar ciclos */
      }
      if (!already) {
        window.location.reload()
        return new Promise<never>(() => {}) // fica à espera enquanto a página recarrega
      }
      throw err
    }),
)

/** Carrega o Leaflet só quando é preciso e protege o resto da página de falhas do mapa. */
export function MapBox({ height = 'h-[22rem]', id, ...props }: TransitMapProps & { height?: string; id?: string }) {
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
    <div ref={box} id={id} className={`scroll-mt-24 ${height} relative isolate z-0 overflow-hidden rounded-2xl border border-hair bg-surface-2`}>
      <ErrorBoundary fallback={<div className="p-4"><ErrorState title={tr('map.failTitle')} onRetry={() => window.location.reload()}>{tr('map.failText')}</ErrorState></div>}>
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
