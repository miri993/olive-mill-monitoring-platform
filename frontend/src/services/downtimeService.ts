import type { Downtime } from '../models/Downtime'
import { BaseService } from './BaseService'

class DowntimeService extends BaseService {
  private readonly downtimeUrl = '/downtimes'

  // Get lista fermi macchina
  async getDowntimes(): Promise<Downtime[]> {
    try {
      return await this.get<Downtime[]>(this.downtimeUrl)
    } catch (error) {
      throw new Error(`Errore nel recupero dei fermi: ${error}`, { cause: error })
    }
  }
}

export const downtimeService = new DowntimeService()
