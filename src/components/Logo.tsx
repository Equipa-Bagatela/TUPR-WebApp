import { useT } from '../i18n'

/** Símbolo do Reguamove: um M feito de duas linhas que se encontram numa paragem (usado como ícone da app). `onDark`: acrescenta um aro claro para fundos escuros. */
export function LogoMark({ className = 'h-9 w-9', onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
<defs>
<linearGradient id="rm-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1f6089"/><stop offset="1" stopColor="#0b2a3f"/></linearGradient>
<radialGradient id="rm-gl" cx=".25" cy=".1" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".28"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
<linearGradient id="rm-gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8f080"/><stop offset="1" stopColor="#7cb342"/></linearGradient>
<linearGradient id="rm-rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff9a8a"/><stop offset="1" stopColor="#e5484d"/></linearGradient>
<filter id="rm-sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#04141f" floodOpacity=".45"/></filter>
<clipPath id="rm-cl"><rect width="200" height="200" rx="46"/></clipPath>
</defs>
<rect width="200" height="200" rx="46" fill="url(#rm-bg)"/>
<g clipPath="url(#rm-cl)"><path d="M-10 168C30 150 60 186 100 168S170 150 210 166" fill="none" stroke="#fff" strokeOpacity=".10" strokeWidth="5"/>
<path d="M-10 184C34 168 64 200 104 184S172 168 210 182" fill="none" stroke="#fff" strokeOpacity=".07" strokeWidth="5"/>
<rect width="200" height="200" fill="url(#rm-gl)"/></g>
{onDark && <rect x="3" y="3" width="194" height="194" rx="43" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="6" />}
<rect x="1.5" y="1.5" width="197" height="197" rx="44.5" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="3"/>
<g filter="url(#rm-sh)">
<path d="M48 146V56L100 112" fill="none" stroke="url(#rm-gv)" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M100 112L152 56V146" fill="none" stroke="url(#rm-rv)" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<circle cx="100" cy="114" r="17" fill="#fff"/><circle cx="100" cy="114" r="7.5" fill="#143c57"/>
<circle cx="48" cy="146" r="7" fill="#fff"/><circle cx="152" cy="146" r="7" fill="#fff"/>
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
