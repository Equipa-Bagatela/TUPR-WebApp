import { useT } from '../i18n'

/** Símbolo do Reguamove: um R cuja perna é o caminho até à paragem. `onDark`: acrescenta um aro claro para fundos escuros. */
export function LogoMark({ className = 'h-9 w-9', onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="rm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1c5578" />
          <stop offset="1" stopColor="#0f3249" />
        </linearGradient>
        <clipPath id="rm-c">
          <rect width="200" height="200" rx="46" />
        </clipPath>
      </defs>
      <rect width="200" height="200" rx="46" fill="url(#rm-g)" />
      {onDark && <rect x="3" y="3" width="194" height="194" rx="43" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="6" />}
      <g clipPath="url(#rm-c)">
        <path d="M-10 150C40 120 80 178 120 150S170 128 210 142V210H-10Z" fill="#7cb342" opacity=".22" />
      </g>
      <path d="M62 152V48H104a32 32 0 0 1 0 64H62" fill="none" stroke="#fff" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M106 114L136 141" fill="none" stroke="#9bd14f" strokeWidth="22" strokeLinecap="round" />
      <circle cx="160" cy="161" r="11" fill="#e5484d" />
      <circle cx="160" cy="161" r="4.5" fill="#fff" />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  const { t } = useT()
  return (
    <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <LogoMark onDark={light} className="h-9 w-9 shrink-0 rounded-[0.65rem] sm:h-10 sm:w-10 sm:rounded-[0.7rem]" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.12rem] font-extrabold tracking-tight sm:text-[1.3rem] ${light ? 'text-white' : 'text-primary'}`}>Reguamove</span>
        <span className={`mt-1.5 text-[0.5rem] font-semibold uppercase leading-[1.2] tracking-[0.03em] min-[360px]:text-[0.54rem] min-[360px]:tracking-[0.07em] sm:text-[0.6rem] sm:tracking-[0.12em] ${light ? 'text-white/80' : 'text-muted'}`}>{t('brand.sub')}</span>
      </span>
    </span>
  )
}
