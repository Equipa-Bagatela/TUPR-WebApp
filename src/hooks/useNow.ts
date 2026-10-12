import { useEffect, useState } from 'react'

/** Hora do dispositivo; actualiza a cada `ms` e quando o separador volta a ficar visível. */
export function useNow(ms = 10_000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = setInterval(tick, ms)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [ms])
  return now
}
