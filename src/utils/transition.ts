import { flushSync } from 'react-dom'

interface Opts {
  /** Ponto de origem (px) para o efeito "círculo que se expande" */
  origin?: { x: number; y: number }
}

type VT = { ready: Promise<void>; finished: Promise<void>; updateCallbackDone?: Promise<void> }
type DocVT = Document & { startViewTransition?: (cb: () => void) => VT }

/**
 * Executa uma actualização de estado com transição suave entre o "antes" e o "depois"
 * (View Transitions API). Sem suporte, ou com "reduzir movimento", aplica de imediato.
 */
export function smoothUpdate(update: () => void, opts: Opts = {}) {
  const doc = document as DocVT
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!doc.startViewTransition || reduce) return update()
  const root = document.documentElement
  root.dataset.vt = opts.origin ? 'reveal' : 'fade'
  const vt = doc.startViewTransition(() => flushSync(update))
  vt.updateCallbackDone?.catch(() => {})
  if (opts.origin) {
    const { x, y } = opts.origin
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    vt.ready.then(() =>
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' }),
    ).catch(() => {})
  }
  // `finished` rejeita se a transição for saltada (ex.: separador oculto); não é um erro da app
  vt.finished.catch(() => {}).finally(() => delete root.dataset.vt)
}
