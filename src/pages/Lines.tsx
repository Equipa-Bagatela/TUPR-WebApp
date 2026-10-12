import { LineCard } from '../components/LineCard'
import { PageHeader } from '../components/ui'
import { lines } from '../data/lines'

export default function Lines() {
  return (
    <>
      <PageHeader title="Linhas" subtitle="A rede TUPR tem duas linhas circulares, com viagens de hora a hora de segunda-feira a sábado." />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-2">
        {lines.map((l) => (
          <LineCard key={l.id} line={l} />
        ))}
      </div>
    </>
  )
}
