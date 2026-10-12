export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 6C21.500 6 13 14 13 24.200 13 37 32 58 32 58s19-21 19-33.800C51 14 42.500 6 32 6z" fill="#7cb342" />
      <path d="M32 58S13 37 13 24.200c0-.9.100-1.800.2-2.600L32 40z" fill="#416e48" />
      <circle cx="32" cy="24" r="8" fill="var(--logo-hole, #fff)" />
      <path d="M5 26C9 14 28 9 41 16 27 13 13 19 11 31 7 31 5 28 5 26z" fill="var(--logo-swoosh, #143c57)" />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3" style={{ ['--logo-hole' as string]: light ? '#143c57' : 'var(--surface)', ['--logo-swoosh' as string]: light ? '#fff' : 'var(--primary)' }}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.65rem] font-extrabold tracking-[0.18em] ${light ? 'text-white' : 'text-primary'}`}>TUPR</span>
        <span className={`mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] ${light ? 'text-white/85' : 'text-muted'}`}>
          Transportes Urbanos
          <br />
          Peso da Régua
        </span>
      </span>
    </span>
  )
}
