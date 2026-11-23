import { useT } from '../i18n'

/** Símbolo da app: um autocarro visto de frente (desenho próprio). `onDark`: versão clara para fundos escuros. */
export function LogoMark({ className = 'h-9 w-9', onDark = false }: { className?: string; onDark?: boolean }) {
  const sq = onDark ? '#ffffff' : '#143c57'
  const body = onDark ? '#143c57' : '#ffffff'
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill={sq} />
      <rect x="14" y="11" width="36" height="35" rx="8" fill={body} />
      <rect x="18.5" y="16" width="27" height="14" rx="3.5" fill={sq} />
      <rect x="14" y="35" width="36" height="4.5" fill="#7cb342" />
      <circle cx="21.5" cy="43" r="2.3" fill={sq} />
      <circle cx="42.5" cy="43" r="2.3" fill={sq} />
      <rect x="19" y="45.5" width="8" height="7" rx="2.5" fill={body} />
      <rect x="37" y="45.5" width="8" height="7" rx="2.5" fill={body} />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  const { t } = useT()
  return (
    <span className="flex items-center gap-3">
      <LogoMark onDark={light} className="h-10 w-10 shrink-0 rounded-[0.7rem] ring-1 ring-hair" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.3rem] font-extrabold tracking-tight ${light ? 'text-white' : 'text-primary'}`}>Horários TUPR</span>
        <span className={`mt-1.5 text-[0.6rem] font-semibold uppercase leading-[1.2] tracking-[0.12em] ${light ? 'text-white/80' : 'text-muted'}`}>{t('brand.sub')}</span>
      </span>
    </span>
  )
}
