import { useT } from '../i18n'
import { WORDMARK } from './wordmarkPaths'

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
<g clipPath="url(#rm-cl)"><path d="M-10.0 117.5 L-5.6 115.7 L-1.2 114.0 L3.2 112.5 L7.6 111.1 L12.0 109.8 L16.4 108.7 L20.8 107.8 L25.2 107.1 L29.6 106.5 L34.0 106.2 L38.4 106.0 L42.8 106.0 L47.2 106.3 L51.6 106.7 L56.0 107.3 L60.4 108.1 L64.8 109.0 L69.2 110.2 L73.6 111.5 L78.0 112.9 L82.4 114.5 L86.8 116.2 L91.2 118.0 L95.6 119.8 L100.0 121.8 L104.4 123.8 L108.8 125.9 L113.2 127.9 L117.6 130.0 L122.0 132.1 L126.4 134.1 L130.8 136.0 L135.2 137.9 L139.6 139.7 L144.0 141.4 L148.4 143.0 L152.8 144.5 L157.2 145.8 L161.6 146.9 L166.0 147.9 L170.4 148.7 L174.8 149.3 L179.2 149.7 L183.6 150.0 L188.0 150.0 L192.4 149.8 L196.8 149.5 L201.2 148.9 L205.6 148.2 L210.0 147.3 L210 210 L-10 210Z" fill="#fff" fillOpacity=".07"/><path d="M-10.0 126.5 L-5.6 124.7 L-1.2 123.0 L3.2 121.5 L7.6 120.1 L12.0 118.8 L16.4 117.7 L20.8 116.8 L25.2 116.1 L29.6 115.5 L34.0 115.2 L38.4 115.0 L42.8 115.0 L47.2 115.3 L51.6 115.7 L56.0 116.3 L60.4 117.1 L64.8 118.0 L69.2 119.2 L73.6 120.5 L78.0 121.9 L82.4 123.5 L86.8 125.2 L91.2 127.0 L95.6 128.8 L100.0 130.8 L104.4 132.8 L108.8 134.9 L113.2 136.9 L117.6 139.0 L122.0 141.1 L126.4 143.1 L130.8 145.0 L135.2 146.9 L139.6 148.7 L144.0 150.4 L148.4 152.0 L152.8 153.5 L157.2 154.8 L161.6 155.9 L166.0 156.9 L170.4 157.7 L174.8 158.3 L179.2 158.7 L183.6 159.0 L188.0 159.0 L192.4 158.8 L196.8 158.5 L201.2 157.9 L205.6 157.2 L210.0 156.3" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="2.2"/><path d="M-10.0 135.5 L-5.6 133.7 L-1.2 132.0 L3.2 130.5 L7.6 129.1 L12.0 127.8 L16.4 126.7 L20.8 125.8 L25.2 125.1 L29.6 124.5 L34.0 124.2 L38.4 124.0 L42.8 124.0 L47.2 124.3 L51.6 124.7 L56.0 125.3 L60.4 126.1 L64.8 127.0 L69.2 128.2 L73.6 129.5 L78.0 130.9 L82.4 132.5 L86.8 134.2 L91.2 136.0 L95.6 137.8 L100.0 139.8 L104.4 141.8 L108.8 143.9 L113.2 145.9 L117.6 148.0 L122.0 150.1 L126.4 152.1 L130.8 154.0 L135.2 155.9 L139.6 157.7 L144.0 159.4 L148.4 161.0 L152.8 162.5 L157.2 163.8 L161.6 164.9 L166.0 165.9 L170.4 166.7 L174.8 167.3 L179.2 167.7 L183.6 168.0 L188.0 168.0 L192.4 167.8 L196.8 167.5 L201.2 166.9 L205.6 166.2 L210.0 165.3" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="2.2"/><path d="M-10.0 144.5 L-5.6 142.7 L-1.2 141.0 L3.2 139.5 L7.6 138.1 L12.0 136.8 L16.4 135.7 L20.8 134.8 L25.2 134.1 L29.6 133.5 L34.0 133.2 L38.4 133.0 L42.8 133.0 L47.2 133.3 L51.6 133.7 L56.0 134.3 L60.4 135.1 L64.8 136.0 L69.2 137.2 L73.6 138.5 L78.0 139.9 L82.4 141.5 L86.8 143.2 L91.2 145.0 L95.6 146.8 L100.0 148.8 L104.4 150.8 L108.8 152.9 L113.2 154.9 L117.6 157.0 L122.0 159.1 L126.4 161.1 L130.8 163.0 L135.2 164.9 L139.6 166.7 L144.0 168.4 L148.4 170.0 L152.8 171.5 L157.2 172.8 L161.6 173.9 L166.0 174.9 L170.4 175.7 L174.8 176.3 L179.2 176.7 L183.6 177.0 L188.0 177.0 L192.4 176.8 L196.8 176.5 L201.2 175.9 L205.6 175.2 L210.0 174.3" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="2.2"/><path d="M-10.0 137.3 L-5.6 136.4 L-1.2 135.6 L3.2 135.0 L7.6 134.5 L12.0 134.2 L16.4 134.0 L20.8 134.0 L25.2 134.2 L29.6 134.5 L34.0 135.0 L38.4 135.6 L42.8 136.4 L47.2 137.3 L51.6 138.3 L56.0 139.5 L60.4 140.7 L64.8 142.1 L69.2 143.5 L73.6 145.0 L78.0 146.6 L82.4 148.1 L86.8 149.7 L91.2 151.4 L95.6 152.9 L100.0 154.5 L104.4 156.0 L108.8 157.5 L113.2 158.9 L117.6 160.2 L122.0 161.3 L126.4 162.4 L130.8 163.4 L135.2 164.2 L139.6 164.9 L144.0 165.4 L148.4 165.7 L152.8 166.0 L157.2 166.0 L161.6 165.9 L166.0 165.6 L170.4 165.2 L174.8 164.6 L179.2 163.9 L183.6 163.0 L188.0 162.0 L192.4 160.8 L196.8 159.6 L201.2 158.3 L205.6 156.9 L210.0 155.4 L210 210 L-10 210Z" fill="#fff" fillOpacity=".09"/><path d="M-10.0 146.3 L-5.6 145.4 L-1.2 144.6 L3.2 144.0 L7.6 143.5 L12.0 143.2 L16.4 143.0 L20.8 143.0 L25.2 143.2 L29.6 143.5 L34.0 144.0 L38.4 144.6 L42.8 145.4 L47.2 146.3 L51.6 147.3 L56.0 148.5 L60.4 149.7 L64.8 151.1 L69.2 152.5 L73.6 154.0 L78.0 155.6 L82.4 157.1 L86.8 158.7 L91.2 160.4 L95.6 161.9 L100.0 163.5 L104.4 165.0 L108.8 166.5 L113.2 167.9 L117.6 169.2 L122.0 170.3 L126.4 171.4 L130.8 172.4 L135.2 173.2 L139.6 173.9 L144.0 174.4 L148.4 174.7 L152.8 175.0 L157.2 175.0 L161.6 174.9 L166.0 174.6 L170.4 174.2 L174.8 173.6 L179.2 172.9 L183.6 172.0 L188.0 171.0 L192.4 169.8 L196.8 168.6 L201.2 167.3 L205.6 165.9 L210.0 164.4" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="2.2"/><path d="M-10.0 155.3 L-5.6 154.4 L-1.2 153.6 L3.2 153.0 L7.6 152.5 L12.0 152.2 L16.4 152.0 L20.8 152.0 L25.2 152.2 L29.6 152.5 L34.0 153.0 L38.4 153.6 L42.8 154.4 L47.2 155.3 L51.6 156.3 L56.0 157.5 L60.4 158.7 L64.8 160.1 L69.2 161.5 L73.6 163.0 L78.0 164.6 L82.4 166.1 L86.8 167.7 L91.2 169.4 L95.6 170.9 L100.0 172.5 L104.4 174.0 L108.8 175.5 L113.2 176.9 L117.6 178.2 L122.0 179.3 L126.4 180.4 L130.8 181.4 L135.2 182.2 L139.6 182.9 L144.0 183.4 L148.4 183.7 L152.8 184.0 L157.2 184.0 L161.6 183.9 L166.0 183.6 L170.4 183.2 L174.8 182.6 L179.2 181.9 L183.6 181.0 L188.0 180.0 L192.4 178.8 L196.8 177.6 L201.2 176.3 L205.6 174.9 L210.0 173.4" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="2.2"/><path d="M-10 182C30 175 66 190 104 182S170 175 210 181V210H-10Z" fill="#7ec3ea" fillOpacity=".55"/></g>

<g filter="url(#rm-sh)">
<path d="M48 150V54L100 97" fill="none" stroke="url(#rm-gv)" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M100 97L152 54V150" fill="none" stroke="url(#rm-rv)" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<circle cx="100" cy="96" r="17" fill="#9bd14f" stroke="#143c57" strokeWidth="4"/>

    </svg>
  )
}

/** Nome "Reguamove" desenhado em Outfit: o "a" liga-se ao "m" de "move" e termina com o ponto do ícone. */
export function Wordmark({ light = false, className = '' }: { light?: boolean; className?: string }) {
  const [dx, dy, dr] = WORDMARK.dot
  return (
    <svg viewBox={`0 ${WORDMARK.top} ${WORDMARK.w} ${WORDMARK.bottom - WORDMARK.top}`} className={className} role="img" aria-label="Reguamove">
      <path d={WORDMARK.left} fill={light ? '#ffffff' : '#143c57'} />
      <path d={WORDMARK.right} fill={light ? '#9bd14f' : '#5f9a2a'} />
      <circle cx={dx} cy={dy} r={dr} fill="#9bd14f" stroke="#143c57" strokeWidth={dr * 0.3} />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  const { t } = useT()
  return (
    <span className="flex min-w-0 flex-col leading-none">
      <Wordmark light={light} className="h-[1.6rem] w-auto sm:h-[1.95rem]" />
      <span className={`mt-1.5 text-[0.5rem] font-semibold uppercase leading-[1.2] tracking-[0.03em] min-[360px]:text-[0.54rem] min-[360px]:tracking-[0.07em] sm:text-[0.6rem] sm:tracking-[0.12em] ${light ? 'text-white/80' : 'text-muted'}`}>{t('brand.sub')}</span>
    </span>
  )
}
