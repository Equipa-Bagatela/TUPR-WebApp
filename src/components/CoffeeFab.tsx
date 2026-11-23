import { Coffee } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useT } from '../i18n'

export const COFFEE_URL = 'https://buymeacoffee.com/bagatela'

/** Botão flutuante "Paga-nos um café" (canto inferior direito). Esconde-se quando o rodapé, que já o tem, está à vista. */
export function CoffeeFab() {
  const { t } = useT()
  const { pathname } = useLocation()
  const [atFooter, setAtFooter] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting), { threshold: 0.05 })
    io.observe(footer)
    return () => io.disconnect()
  }, [pathname])

  return (
    <a
      href={COFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('fab.aria')}
      title={t('footer.support')}
      tabIndex={atFooter ? -1 : 0}
      aria-hidden={atFooter}
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      className={`group fixed right-4 z-[900] inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#FFD84D] text-[#143c57] shadow-[0_8px_24px_-6px_rgba(15,42,61,0.55)] ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#ffe27a] active:scale-95 w-14 sm:w-auto sm:px-5 ${atFooter ? 'pointer-events-none translate-y-6 opacity-0' : 'opacity-100'}`}
    >
      <Coffee className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:-rotate-12" aria-hidden="true" />
      <span className="hidden font-display text-[0.95rem] font-extrabold sm:inline">{t('footer.support')}</span>
    </a>
  )
}
