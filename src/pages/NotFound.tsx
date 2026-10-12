import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui'
import { useT } from '../i18n'

export default function NotFound() {
  const { t } = useT()
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <EmptyState title={t('nf.page')}>
        <Link to="/" className="font-semibold text-primary underline">{t('nf.home')}</Link>
      </EmptyState>
    </div>
  )
}
