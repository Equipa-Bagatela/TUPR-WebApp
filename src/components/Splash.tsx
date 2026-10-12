import { useEffect, useState } from 'react'
import { LogoMark } from './Logo'

const KEY = 'tupr:intro'

const seen = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/** Autocarro TUPR (desenho próprio). As rodas giram através de CSS (.wheel). */
function Bus() {
  return (
    <svg viewBox="0 0 280 120" className="splash-bus-svg block h-full w-full" aria-hidden="true">
      <ellipse cx="140" cy="112" rx="118" ry="4" fill="#000" opacity="0.25" />
      <rect x="8" y="14" width="256" height="82" rx="16" fill="#fff" />
      <path d="M8 74h256v10a12 12 0 0 1-12 12H20A12 12 0 0 1 8 84z" fill="#7cb342" />
      <path d="M8 74h256v6H8z" fill="#416e48" />
      <g fill="#cfe6f2">
        <rect x="22" y="26" width="38" height="30" rx="5" />
        <rect x="66" y="26" width="38" height="30" rx="5" />
        <rect x="110" y="26" width="38" height="30" rx="5" />
        <rect x="154" y="26" width="38" height="30" rx="5" />
        <path d="M200 26h46a8 8 0 0 1 8 8v22h-54z" />
      </g>
      <text x="136" y="70" textAnchor="middle" fontFamily="Sora Variable, Sora, sans-serif" fontWeight="800" fontSize="15" letterSpacing="5" fill="#143c57">TUPR</text>
      <rect x="258" y="62" width="10" height="10" rx="3" fill="#ffd54a" />
      <rect x="2" y="64" width="8" height="8" rx="2" fill="#c12a2b" />
      {[62, 214].map((cx) => (
        <g key={cx} transform={`translate(${cx} 96)`}>
          <circle r="15" fill="#0f2a3d" />
          <g className="wheel">
            <circle r="8" fill="#e8eff4" />
            <path d="M0-8V8M-8 0H8M-5.600-5.600 5.600 5.600M5.600-5.600-5.600 5.600" stroke="#0f2a3d" strokeWidth="1.600" />
          </g>
          <circle r="2.500" fill="#0f2a3d" />
        </g>
      ))}
    </svg>
  )
}

/**
 * Abertura: um autocarro TUPR atravessa o ecrã e, à sua passagem, a página vai aparecendo.
 * Só aparece uma vez por sessão e não aparece com "reduzir movimento".
 */
export function Splash() {
  const [show, setShow] = useState(() => !seen() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (!show) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* ignora */
    }
    const skip = (e: KeyboardEvent) => (e.key === 'Escape' || e.key === 'Enter') && setShow(false)
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [show])
  if (!show) return null
  return (
    <div className="splash" aria-hidden="true" onClick={() => setShow(false)} onAnimationEnd={(e) => e.animationName === 'splash-wipe' && setShow(false)}>
      <div className="splash-brand" style={{ ['--logo-hole' as string]: '#143c57', ['--logo-swoosh' as string]: '#fff' }}>
        <LogoMark className="h-20 w-20 sm:h-24 sm:w-24" />
        <span className="font-display text-5xl font-extrabold tracking-[0.2em] text-white sm:text-6xl">TUPR</span>
        <span className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white/80 sm:text-xs">Transportes Urbanos · Peso da Régua</span>
      </div>
      <div className="splash-road" />
      <div className="splash-bus">
        <Bus />
      </div>
    </div>
  )
}
