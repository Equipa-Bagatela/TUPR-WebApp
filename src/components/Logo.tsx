import { useT } from '../i18n'

/** Símbolo do Reguamove: um M feito de duas linhas que se encontram numa paragem (usado como ícone da app). `onDark`: acrescenta um aro claro para fundos escuros. */
export function LogoMark({ className = 'h-9 w-9', onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="rm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1c5578" />
          <stop offset="1" stopColor="#0f3249" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="46" fill="url(#rm-g)" />
      {onDark && <rect x="3" y="3" width="194" height="194" rx="43" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="6" />}
      <path d="M46 148V58L100 118" fill="none" stroke="#9bd14f" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M100 118L154 58V148" fill="none" stroke="#e5484d" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="100" cy="118" r="15" fill="#fff" stroke="#143c57" strokeWidth="9"/>
      <circle cx="46" cy="148" r="8" fill="#fff"/><circle cx="154" cy="148" r="8" fill="#fff"/>
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  const { t } = useT()
  return (
    <span className="flex min-w-0 flex-col leading-none">
      <span className="font-display text-[1.45rem] font-extrabold tracking-tight sm:text-[1.7rem]">
        <span className={light ? 'text-white' : 'text-primary'}>Regua</span>
        <span className={light ? 'text-[#9bd14f]' : 'text-[#5f9a2a]'}>move</span>
      </span>
      <span className={`mt-1.5 text-[0.5rem] font-semibold uppercase leading-[1.2] tracking-[0.03em] min-[360px]:text-[0.54rem] min-[360px]:tracking-[0.07em] sm:text-[0.6rem] sm:tracking-[0.12em] ${light ? 'text-white/80' : 'text-muted'}`}>{t('brand.sub')}</span>
    </span>
  )
}
