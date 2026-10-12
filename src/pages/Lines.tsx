import { LineCard } from '../components/LineCard'
import { PageHeader } from '../components/ui'
import { lines } from '../data/lines'
import { useT } from '../i18n'

export default function Lines() {
  const { t } = useT()
  return (
    <>
      <PageHeader title={t('nav.lines')} subtitle={t('lines.subtitle')} />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-2">
        {lines.map((l) => (
          <LineCard key={l.id} line={l} />
        ))}
      </div>
    </>
  )
}
