import type { Machine } from '../models/Machine'
import { BaseService } from './BaseService'

class MachineService extends BaseService {
  private readonly machineUrl = '/machines'

  // Get lista macchine
  async getMachines(): Promise<Machine[]> {
    try {
      return await this.get<Machine[]>(this.machineUrl)
    } catch (error) {
      throw new Error(`Errore nel recupero delle macchine: ${error}`, { cause: error })
    }
  }
}

export const machineService = new MachineService()
