// Sottoprodotto: sansa umida e quota recuperata
export interface ByProduct {
  id: number
  date: string // formato "AAAA-MM-GG"
  wetPomaceKg: number
  destination: string
  recoveredKg: number
}
