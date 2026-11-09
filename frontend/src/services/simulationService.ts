import type { GenerationSummary } from '../models/GenerationSummary'
import { BaseService } from './BaseService'

class SimulationService extends BaseService {
  private readonly simulationUrl = '/simulation'

  // Genera i dati simulati della campagna
  async generateData(seed = 2026): Promise<GenerationSummary> {
    try {
      return await this.post<undefined, GenerationSummary>(`${this.simulationUrl}/generate?seed=${seed}`)
    } catch (error) {
      throw new Error(`Errore nella generazione dei dati: ${error}`, { cause: error })
    }
  }
}

export const simulationService = new SimulationService()
