import { Coffee, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'
import { COFFEE_URL } from './CoffeeFab'

const DELAY_MS = 10_000

/**
 * Aviso discreto que aparece sempre que a app é aberta, ao fim de 10 s. Não bloqueia a página, nunca interrompe quem está a
 * escrever ou a usar um diálogo, e depois de fechado não volta a aparecer até a app ser aberta de novo.
 */
export function SupportToast() {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const busy = () => {
      const a = document.activeElement
      const typing = !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.getAttribute('role') === 'combobox')
      return typing || !!document.querySelector('.splash, [role="dialog"][aria-modal="true"]')
    }
    const attempt = () => {
      if (busy()) timer = setTimeout(attempt, 5000) // volta a tentar mais tarde, sem interromper
      else setOpen(true)
    }
    timer = setTimeout(attempt, DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [open])

  const close = () => setOpen(false)
  if (!open) return null

  return (
    <div
      ref={card}
      role="dialog"
      aria-modal="false"
      aria-labelledby="support-title"
      style={{ bottom: 'calc(max(1rem, env(safe-area-inset-bottom)) + 4.5rem)' }}
      className="rise fixed right-4 z-[1000] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-hair bg-surface p-4 shadow-[0_18px_44px_-10px_rgba(15,42,61,0.55)] ring-1 ring-black/5"
    >
      <button onClick={close} aria-label={t('support.close')} className="absolute right-1.5 top-1.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-surface-2">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="flex items-start gap-3 pr-8">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFD84D] text-[#143c57]">
          <Coffee className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="support-title" className="font-display text-base font-extrabold text-primary">{t('support.title')}</h2>
          <p className="mt-1 text-sm leading-snug text-ink/90">{t('support.text')}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={COFFEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FFD84D] px-4 text-sm font-extrabold text-[#143c57] transition hover:bg-[#ffe27a] active:scale-95"
        >
          <Coffee className="h-4 w-4" aria-hidden="true" />
          {t('support.cta')}
        </a>
        <button onClick={close} className="min-h-11 rounded-full px-3 text-sm font-semibold text-muted hover:bg-surface-2">
          {t('support.later')}
        </button>
      </div>
    </div>
  )
}
