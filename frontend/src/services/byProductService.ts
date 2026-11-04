import type { ByProduct } from '../models/ByProduct'
import { BaseService } from './BaseService'

class ByProductService extends BaseService {
  private readonly byProductUrl = '/by-products'

  // Get lista sottoprodotti
  async getByProducts(): Promise<ByProduct[]> {
    try {
      return await this.get<ByProduct[]>(this.byProductUrl)
    } catch (error) {
      throw new Error(`Errore nel recupero dei sottoprodotti: ${error}`, { cause: error })
    }
  }
}

export const byProductService = new ByProductService()
