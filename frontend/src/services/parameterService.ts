import type { EconomicParameter } from '../models/EconomicParameter'
import { BaseService } from './BaseService'

class ParameterService extends BaseService {
  private readonly parameterUrl = '/parameters'

  // Get lista parametri economici
  async getParameters(): Promise<EconomicParameter[]> {
    try {
      return await this.get<EconomicParameter[]>(this.parameterUrl)
    } catch (error) {
      throw new Error(`Errore nel recupero dei parametri: ${error}`, { cause: error })
    }
  }

  // Update valore di un parametro (es. prezzo olio)
  async updateParameter(id: number, value: number): Promise<EconomicParameter> {
    try {
      return await this.put<{ value: number }, EconomicParameter>(`${this.parameterUrl}/${id}`, { value })
    } catch (error) {
      throw new Error(`Errore nell'aggiornamento del parametro ${id}: ${error}`, { cause: error })
    }
  }
}

export const parameterService = new ParameterService()
