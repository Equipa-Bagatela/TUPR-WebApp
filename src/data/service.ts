import type { ServiceStatus } from '../types'

/**
 * Estado do serviço.
 *
 * Ponto único para ligar a uma API real no futuro: basta substituir `fetchServiceStatus`
 * (por exemplo por um `fetch('/api/estado')`) mantendo o contrato `Promise<ServiceStatus>`.
 * Se a API não enviar `title`/`message`, a interface usa os textos traduzidos do `level`.
 */
export async function fetchServiceStatus(): Promise<ServiceStatus> {
  await new Promise((r) => setTimeout(r, 350))
  return { level: 'normal' }
}
