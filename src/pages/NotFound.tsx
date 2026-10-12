import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <EmptyState title="Página não encontrada">
        <Link to="/" className="font-semibold text-primary underline">Voltar ao início</Link>
      </EmptyState>
    </div>
  )
}
