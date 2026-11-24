import { WORDMARK } from './wordmarkPaths'

/** Ícone do Réguamove (do pacote de identidade): M com a paragem e o rio. `onDark` acrescenta um aro claro para fundos escuros. */
export function LogoMark({ className = 'h-9 w-9', onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <clipPath id="rm-c">
        <rect width="64" height="64" rx="14.4" />
      </clipPath>
      <g clipPath="url(#rm-c)">
        <rect width="64" height="64" fill="#143c57" />
        <path d="M0 41C10 35 19 47 31 41S53 35 64 41" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="1.4" />
        <path d="M0 46C10 40 19 52 31 46S53 40 64 46" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="1.4" />
        <path d="M0 51C10 45 19 57 31 51S53 45 64 51" fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth="1.4" />
        <path d="M0 57C11 53 21 61 33 57S54 53 64 57V64H0Z" fill="#6a94b1" fillOpacity=".55" />
        <path d="M17 47V20L32 35L47 20V47" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="24.5" r="5" fill="#a6d062" stroke="#143c57" strokeWidth="2.4" />
      </g>
      {onDark && <rect x="1" y="1" width="62" height="62" rx="13.4" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />}
    </svg>
  )
}

/** Logótipo horizontal "Réguamove." (símbolo + nome em Space Grotesk Bold, desenhado em contornos). */
export function Wordmark({ light = false, symbol = true, className = '' }: { light?: boolean; symbol?: boolean; className?: string }) {
  const ink = light ? '#ffffff' : '#143c57'
  const green = light ? '#a6d062' : '#5c962b'
  return (
    <svg viewBox={`${symbol ? 0 : 70} ${WORDMARK.y0} ${symbol ? WORDMARK.w : WORDMARK.w - 70} ${WORDMARK.h - WORDMARK.y0}`} className={className} role="img" aria-label="Réguamove">
      {symbol && (
      <g transform="scale(1.2609) translate(-9 -12)">
        <path d="M17 47V20L32 35L47 20V47" fill="none" stroke={ink} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="24.5" r="5" fill="#a6d062" stroke="#143c57" strokeWidth="2.4" />
      </g>
      )}
      <path d={WORDMARK.regua} fill={ink} />
      <path d={WORDMARK.move} fill={green} />
      <path d={WORDMARK.dot} fill={ink} />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return <Wordmark light={light} className="h-[2.1rem] w-auto shrink-0 sm:h-[2.5rem]" />
}
