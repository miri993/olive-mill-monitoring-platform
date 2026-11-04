import type { Machine } from './Machine'

// KPI salvato nel database
export interface Kpi {
  id: number
  calculationDate: string // formato "AAAA-MM-GG"
  name: string
  machine: Machine | null // null per i KPI di linea
  value: number
}

// KPI dell'intera campagna
export interface CampaignKpi {
  oeeFrangitorePct: number
  oeeDecanterPct: number
  qualityPct: number
  lineOeePct: number
  hourlyDowntimeCostEur: number
  frangitoreDowntimeCostEur: number
  decanterDowntimeCostEur: number
  co2GramsPerLiter: number
  co2TotalKg: number
  recoveredByProductPct: number
}

// KPI di un singolo giorno 
export interface DailyKpi {
  date: string // formato "AAAA-MM-GG"
  processedKg: number
  oilLiters: number
  kwh: number
  oeeFrangitorePct: number
  oeeDecanterPct: number
  lineOeePct: number
  downgradedOilPct: number
  co2GramsPerLiter: number
  downtimeHours: number
  downtimeCostEur: number
  recoveredByProductPct: number
}
