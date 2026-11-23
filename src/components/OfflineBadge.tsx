import { WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useT } from '../i18n'

/** Aviso discreto quando o dispositivo está sem rede: os horários continuam disponíveis, os autocarros em direto e o mapa não. */
export function OfflineBadge() {
  const { t } = useT()
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  if (online) return null
  return (
    <div role="status" className="rise flex items-center justify-center gap-2 bg-surface-2 px-4 py-2 text-center text-sm font-semibold text-ink">
      <WifiOff className="h-4 w-4 shrink-0 text-warn" aria-hidden="true" />
      {t('offline.text')}
    </div>
  )
}
