import type { Machine } from './Machine'

// Produzione giornaliera di una macchina
export interface DailyProduction {
  id: number
  date: string // formato "AAAA-MM-GG"
  machine: Machine
  plannedHours: number
  workedHours: number
  processedKg: number
  kwh: number
  oilYieldPct: number
  oilKg: number
  oilLiters: number
  wetPomaceKg: number
  downgradedOilLiters: number
}
