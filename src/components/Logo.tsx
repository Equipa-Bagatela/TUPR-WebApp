import { useT } from '../i18n'

/** Símbolo do Reguamove: duas linhas que se cruzam numa paragem (usado como ícone da app). `onDark`: acrescenta um aro claro para fundos escuros. */
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
      <path d="M34.0 138.0 L37.3 137.9 L40.6 137.5 L43.9 137.0 L47.2 136.1 L50.5 135.1 L53.8 133.9 L57.1 132.4 L60.4 130.7 L63.7 128.9 L67.0 126.9 L70.3 124.7 L73.6 122.3 L76.9 119.9 L80.2 117.3 L83.5 114.5 L86.8 111.7 L90.1 108.9 L93.4 105.9 L96.7 103.0 L100.0 100.0 L103.3 97.0 L106.6 94.1 L109.9 91.1 L113.2 88.3 L116.5 85.5 L119.8 82.7 L123.1 80.1 L126.4 77.7 L129.7 75.3 L133.0 73.1 L136.3 71.1 L139.6 69.3 L142.9 67.6 L146.2 66.1 L149.5 64.9 L152.8 63.9 L156.1 63.0 L159.4 62.5 L162.7 62.1 L166.0 62.0" fill="none" stroke="#9bd14f" strokeWidth="22" strokeLinecap="round" />
      <path d="M34.0 62.0 L37.3 62.1 L40.6 62.5 L43.9 63.0 L47.2 63.9 L50.5 64.9 L53.8 66.1 L57.1 67.6 L60.4 69.3 L63.7 71.1 L67.0 73.1 L70.3 75.3 L73.6 77.7 L76.9 80.1 L80.2 82.7 L83.5 85.5 L86.8 88.3 L90.1 91.1 L93.4 94.1 L96.7 97.0 L100.0 100.0 L103.3 103.0 L106.6 105.9 L109.9 108.9 L113.2 111.7 L116.5 114.5 L119.8 117.3 L123.1 119.9 L126.4 122.3 L129.7 124.7 L133.0 126.9 L136.3 128.9 L139.6 130.7 L142.9 132.4 L146.2 133.9 L149.5 135.1 L152.8 136.1 L156.1 137.0 L159.4 137.5 L162.7 137.9 L166.0 138.0" fill="none" stroke="#e5484d" strokeWidth="22" strokeLinecap="round" />
      <circle cx="100" cy="100" r="19" fill="#fff" stroke="#143c57" strokeWidth="10" />
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
