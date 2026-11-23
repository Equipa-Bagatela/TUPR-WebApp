import { MailWarning } from 'lucide-react'
import { useT } from '../i18n'
import { CONTACT_EMAIL } from '../i18n/legal'

/** Abre o email do utilizador já preparado para reportar um erro nos horários (não enviamos nada a partir da app). */
export function ReportError({ what, className = '' }: { what?: string; className?: string }) {
  const { t } = useT()
  const href = () => {
    const subject = t('report.subject', { what: what ?? window.location.pathname })
    const body = t('report.body', { url: window.location.href })
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      onClick={(e) => {
        e.currentTarget.href = href() // monta o endereço no momento do clique (com a página atual)
      }}
      className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline ${className}`}
    >
      <MailWarning className="h-4 w-4" aria-hidden="true" />
      {t('report.link')}
    </a>
  )
}
