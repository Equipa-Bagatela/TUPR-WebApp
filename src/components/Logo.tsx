import { useT } from '../i18n'

/** Símbolo do Reguamove: um M feito de duas linhas que se encontram numa paragem (usado como ícone da app). `onDark`: acrescenta um aro claro para fundos escuros. */
export function LogoMark({ className = 'h-9 w-9', onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
<defs>
<linearGradient id="rm-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a7bb0"/><stop offset="1" stopColor="#143c57"/></linearGradient>
<radialGradient id="rm-gl" cx=".25" cy=".1" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".28"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
<linearGradient id="rm-gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#dcecf7"/></linearGradient>
<linearGradient id="rm-rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#dcecf7"/></linearGradient>
<filter id="rm-sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#04141f" floodOpacity=".28"/></filter>
<clipPath id="rm-cl"><rect width="200" height="200" rx="46"/></clipPath>
</defs>
<rect width="200" height="200" rx="46" fill="url(#rm-bg)"/>
{onDark && <rect x="3" y="3" width="194" height="194" rx="43" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="6" />}
<g clipPath="url(#rm-cl)"><path d="M-10 160C30 148 66 172 104 160S170 148 210 158V210H-10Z" fill="#fff" fillOpacity=".14"/><path d="M-10 178C34 168 68 188 106 178S172 168 210 176V210H-10Z" fill="#fff" fillOpacity=".12"/></g>

<g filter="url(#rm-sh)">
<path d="M48 150V54L100 104" fill="none" stroke="url(#rm-gv)" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M100 104L152 54V150" fill="none" stroke="url(#rm-rv)" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<circle cx="100" cy="104" r="23" fill="#143c57"/><path d="M100 104L118.00 104.00A18 18 0 0 1 112.73 116.73Z" fill="#d8232a"/><path d="M100 104L112.73 116.73A18 18 0 0 1 100.00 122.00Z" fill="#ffffff"/><path d="M100 104L100.00 122.00A18 18 0 0 1 87.27 116.73Z" fill="#d8232a"/><path d="M100 104L87.27 116.73A18 18 0 0 1 82.00 104.00Z" fill="#ffffff"/><path d="M100 104L82.00 104.00A18 18 0 0 1 87.27 91.27Z" fill="#d8232a"/><path d="M100 104L87.27 91.27A18 18 0 0 1 100.00 86.00Z" fill="#ffffff"/><path d="M100 104L100.00 86.00A18 18 0 0 1 112.73 91.27Z" fill="#d8232a"/><path d="M100 104L112.73 91.27A18 18 0 0 1 118.00 104.00Z" fill="#ffffff"/>

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
