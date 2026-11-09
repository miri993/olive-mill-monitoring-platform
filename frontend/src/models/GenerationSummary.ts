// Riepilogo restituito dal generatore di dati simulati (POST /api/simulation/generate)
export interface GenerationSummary {
  seed: number
  from: string // formato "AAAA-MM-GG"
  to: string // formato "AAAA-MM-GG"
  productionRows: number
  downtimeRows: number
  byProductRows: number
}
