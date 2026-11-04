import type { CampaignKpi, DailyKpi, Kpi } from '../models/Kpi'
import { BaseService } from './BaseService'

class KpiService extends BaseService {
  private readonly kpiUrl = '/kpi'

  // Get KPI dell'intera campagna
  async getCampaignKpis(): Promise<CampaignKpi> {
    try {
      return await this.get<CampaignKpi>(`${this.kpiUrl}/campaign`)
    } catch (error) {
      throw new Error(`Errore nel recupero dei KPI di campagna: ${error}`, { cause: error })
    }
  }

  // Get KPI giorno per giorno
  async getDailyKpis(): Promise<DailyKpi[]> {
    try {
      return await this.get<DailyKpi[]>(`${this.kpiUrl}/daily`)
    } catch (error) {
      throw new Error(`Errore nel recupero dei KPI giornalieri: ${error}`, { cause: error })
    }
  }

  // Get KPI salvati nel database
  async getSavedKpis(): Promise<Kpi[]> {
    try {
      return await this.get<Kpi[]>(this.kpiUrl)
    } catch (error) {
      throw new Error(`Errore nel recupero dei KPI salvati: ${error}`, { cause: error })
    }
  }
}

export const kpiService = new KpiService()
