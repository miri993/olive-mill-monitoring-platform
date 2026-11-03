import type { Machine } from './Machine'

// Fermo macchina
export interface Downtime {
  id: number
  date: string // formato "AAAA-MM-GG"
  machine: Machine
  startTime: string // formato "HH:MM" (o "HH:MM:SS" se ci sono i secondi)
  durationHours: number
  cause: string
}
