import { Check, Share2 } from 'lucide-react'
import { useState } from 'react'
import { useT } from '../i18n'

/** Partilha o endereço da página (planeamento já preenchido): menu de partilha do telemóvel ou, se não existir, copia o link. */
export function ShareButton({ title, className = '' }: { title: string; className?: string }) {
  const { t } = useT()
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* partilha cancelada pelo utilizador: não é um erro */
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={share}
        aria-label={t('share.aria')}
        title={t('share.label')}
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hair bg-surface text-muted transition hover:text-ink active:scale-90 ${className}`}
      >
        {copied ? <Check className="h-5 w-5 text-ok" aria-hidden="true" /> : <Share2 className="h-5 w-5" aria-hidden="true" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? t('share.copied') : ''}
      </span>
    </>
  )
}
