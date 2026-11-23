/** Símbolo da Bagatela (etiqueta roxa com o "b" e o anel amarelo), redesenhado em SVG a partir da identidade da equipa. */
export function BagatelaMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <path d="M38 0H121L200 79V162A38 38 0 0 1 162 200H38A38 38 0 0 1 0 162V38A38 38 0 0 1 38 0Z" fill="#6B46E5" />
      <line x1="66" y1="56" x2="66" y2="146" stroke="#F7F2E9" strokeWidth="24" strokeLinecap="round" />
      <circle cx="106" cy="121" r="44" fill="#FFD84D" />
      <circle cx="105.500" cy="121" r="18" fill="#6B46E5" />
      <circle cx="151" cy="47" r="15" fill="#F7F2E9" />
    </svg>
  )
}
