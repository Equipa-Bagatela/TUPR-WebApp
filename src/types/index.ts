export type LatLng = [lat: number, lng: number]

export interface Stop {
  id: string
  /** Nome tal como no PDF oficial */
  name: string
  /** Indicação entre parênteses no PDF */
  detail?: string
  /** Coordenadas APROXIMADAS (OpenStreetMap) – só para o mapa */
  coords?: LatLng
}

/** mon-sat: segunda a sábado · mon-fri: segunda a sexta (não se realiza ao sábado) */
export type DayRule = 'mon-sat' | 'mon-fri'

export interface Trip {
  id: string
  /** Hora de partida do início do circuito "HH:MM" */
  departure: string
  days: DayRule
}

export interface TimetableStop {
  stopId: string
  /** times[j] = hora da viagem trips[j] nesta paragem */
  times: string[]
}

export interface LineTimetable {
  trips: Trip[]
  stops: TimetableStop[]
}

export interface LineMeta {
  id: string
  name: string
  /** Cor oficial (barra do PDF) */
  color: string
  /** Variante mais clara para o modo escuro */
  colorDark: string
  shortName: string
  summary: string
}

export interface Line extends LineMeta, LineTimetable {
  shape: LatLng[]
}

export type ServiceLevel = 'normal' | 'disrupted' | 'suspended' | 'none'

export interface ServiceStatus {
  level: ServiceLevel
  title: string
  message?: string
  updatedAt?: string
}
