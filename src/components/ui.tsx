import { AlertTriangle, SearchX } from 'lucide-react'
import type { ReactNode } from 'react'
import { Component } from 'react'

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div role="status" className="rounded-2xl border border-dashed border-hair bg-surface px-5 py-8 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-muted">{icon ?? <SearchX className="h-5 w-5" aria-hidden="true" />}</div>
      <p className="font-display text-base font-semibold">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-md text-sm text-muted">{children}</div>}
    </div>
  )
}

export function ErrorState({ title = 'Algo correu mal', children, onRetry }: { title?: string; children?: ReactNode; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-bad/40 bg-surface px-5 py-6 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-bad">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-display text-base font-semibold">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-md text-sm text-muted">{children}</div>}
      {onRetry && (
        <button onClick={onRetry} className="mt-4 min-h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary">
          Tentar de novo
        </button>
      )}
    </div>
  )
}

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.error(err)
  }
  render() {
    if (this.state.failed) {
      return this.props.fallback ?? <ErrorState title="Não foi possível mostrar este conteúdo" onRetry={() => this.setState({ failed: false })} />
    }
    return this.props.children
  }
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>}
        <h2 className="text-2xl font-bold text-ink sm:text-[1.75rem]">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <header className="border-b border-hair bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-base text-muted">{subtitle}</p>}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </header>
  )
}

export const card = 'rounded-2xl border border-hair bg-surface'
