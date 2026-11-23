import { useT } from '../i18n'
import { privacy, terms, type LegalDoc } from '../i18n/legal'
import { PageHeader } from '../components/ui'

function LegalPage({ docs }: { docs: Record<'pt' | 'en', LegalDoc> }) {
  const { lang } = useT()
  const doc = docs[lang]
  return (
    <>
      <PageHeader title={doc.title} subtitle={doc.intro}>
        <p className="text-sm text-muted">{doc.updated}</p>
      </PageHeader>
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
        {doc.sections.map((s) => (
          <section key={s.h} aria-labelledby={`h-${s.h}`}>
            <h2 id={`h-${s.h}`} className="mb-2 text-xl font-bold text-ink">{s.h}</h2>
            {s.p?.map((t, i) => <p key={i} className="mb-2 leading-relaxed text-ink/90">{t}</p>)}
            {s.ul && (
              <ul className="ml-5 list-disc space-y-1.5 leading-relaxed text-ink/90 marker:text-accent">
                {s.ul.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            )}
          </section>
        ))}
      </article>
    </>
  )
}

export const Terms = () => <LegalPage docs={terms} />
export const Privacy = () => <LegalPage docs={privacy} />
