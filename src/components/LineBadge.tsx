import { Bus } from 'lucide-react'
import type { Line } from '../types'

export const lineColorVar = (line: Pick<Line, 'id'>) => `var(--line-${line.id})`

/** Cartão/etiqueta da linha. O nome está sempre escrito (a cor nunca é a única informação). */
export function LineBadge({ line, size = 'md', short = false }: { line: Pick<Line, 'id' | 'name' | 'shortName'>; size?: 'sm' | 'md'; short?: boolean }) {
  const sm = size === 'sm'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
      style={{ background: 'color-mix(in srgb, var(--line-' + line.id + ') 14%, var(--surface))', color: lineColorVar(line), border: `1.5px solid ${lineColorVar(line)}` }}
    >
      <Bus className={sm ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      {short ? line.shortName : line.name}
    </span>
  )
}

export function LineDot({ line, className = 'h-3 w-3' }: { line: Pick<Line, 'id'>; className?: string }) {
  return <span aria-hidden="true" className={`inline-block shrink-0 rounded-full ${className}`} style={{ background: lineColorVar(line) }} />
}
