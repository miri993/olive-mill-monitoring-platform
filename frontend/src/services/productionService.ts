import type { DailyProduction } from '../models/DailyProduction'
import { BaseService } from './BaseService'

class ProductionService extends BaseService {
  private readonly productionUrl = '/production'

  // Get produzione giornaliera di tutte le macchine
  async getProduction(): Promise<DailyProduction[]> {
    try {
      return await this.get<DailyProduction[]>(this.productionUrl)
    } catch (error) {
      throw new Error(`Errore nel recupero della produzione: ${error}`, { cause: error })
    }
  }
}

export const productionService = new ProductionService()
