import { ArrowDown, Plus, Share, SquarePlus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'
import { LogoMark } from './Logo'

const KEY = 'tupr:a2hs-dismissed'
const PHONE = '(max-width: 767px)'

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true

const wasDismissed = () => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/** Faixa no topo (só telemóvel) a sugerir adicionar a app ao ecrã principal + guia para iPhone. */
export function InstallBanner() {
  const { t } = useT()
  const [phone, setPhone] = useState(() => window.matchMedia(PHONE).matches)
  const [dismissed, setDismissed] = useState(wasDismissed)
  const [open, setOpen] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia(PHONE)
    const on = () => setPhone(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    sheet.current?.querySelector<HTMLElement>('button')?.focus()
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', key)
    }
  }, [open])

  if (!phone || dismissed || isStandalone()) return null

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* ignora */
    }
    setOpen(false)
    setDismissed(true)
  }

  const steps = [
    { icon: <Share className="h-6 w-6" aria-hidden="true" />, title: t('a2hs.s1'), text: t('a2hs.s1t') },
    { icon: <SquarePlus className="h-6 w-6" aria-hidden="true" />, title: t('a2hs.s2'), text: t('a2hs.s2t') },
    { icon: <Plus className="h-6 w-6" aria-hidden="true" />, title: t('a2hs.s3'), text: t('a2hs.s3t') },
  ]

  return (
    <>
      <div role="region" aria-label={t('a2hs.region')} className="flex items-center gap-2 bg-primary px-3 py-2 text-on-primary">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15" style={{ ['--logo-hole' as string]: '#143c57', ['--logo-swoosh' as string]: '#fff' }}>
          <LogoMark className="h-6 w-6" />
        </span>
        <p className="min-w-0 flex-1 text-[0.82rem] font-semibold leading-tight">{t('a2hs.banner')}</p>
        <button onClick={() => setOpen(true)} className="min-h-10 shrink-0 rounded-lg bg-white px-3 text-sm font-bold text-[#143c57]">
          {t('a2hs.how')}
        </button>
        <button onClick={dismiss} aria-label={t('a2hs.close')} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/15">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-end bg-black/55 sheet-fade" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div ref={sheet} role="dialog" aria-modal="true" aria-labelledby="a2hs-title" className="sheet-up max-h-[92dvh] w-full overflow-auto rounded-t-3xl bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 text-ink">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-hair" aria-hidden="true" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="a2hs-title" className="text-xl font-extrabold text-primary">{t('a2hs.title')}</h2>
                <p className="mt-1 text-sm text-muted">{t('a2hs.intro')}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label={t('a2hs.closeDialog')} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-2">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ol className="mt-4 space-y-3">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-3 rounded-2xl border border-hair bg-bg p-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">{s.icon}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-[0.95rem] font-bold leading-snug">{i + 1}. {s.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            {/* barra do Safari com a seta a apontar para o botão Partilhar */}
            <div className="mt-5 rounded-2xl bg-surface-2 px-4 pb-4 pt-3" aria-hidden="true">
              <div className="flex justify-center"><ArrowDown className="bounce-y h-6 w-6 text-primary" /></div>
              <div className="mt-1 flex items-center justify-around rounded-xl border border-hair bg-surface px-2 py-2.5 text-muted">
                <span className="text-lg">‹</span>
                <span className="text-lg">›</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary ring-4 ring-accent/40"><Share className="h-5 w-5" /></span>
                <span className="h-5 w-5 rounded border-2 border-current opacity-60" />
                <span className="h-5 w-5 rounded border-2 border-current opacity-60" />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">{t('a2hs.safariNote')}</p>
            <p className="mt-1 text-xs text-muted">{t('a2hs.android')}</p>

            <div className="mt-5 grid gap-2">
              <button onClick={() => setOpen(false)} className="min-h-12 rounded-xl bg-primary px-4 font-bold text-on-primary">{t('a2hs.gotIt')}</button>
              <button onClick={dismiss} className="min-h-11 rounded-xl text-sm font-semibold text-muted">{t('a2hs.never')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
