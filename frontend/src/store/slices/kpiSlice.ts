import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { CampaignKpi, DailyKpi } from '../../models/Kpi'
import { kpiService } from '../../services/kpiService'
import type { RequestStatus } from '../requestStatus'

// Stato dei KPI nello store: dati ricevuti dal back end e stato di ciascuna richiesta
interface KpiState {
  campaign: CampaignKpi | null
  campaignStatus: RequestStatus
  daily: DailyKpi[]
  dailyStatus: RequestStatus
  error: string | null
}

const initialState: KpiState = {
  campaign: null,
  campaignStatus: 'idle',
  daily: [],
  dailyStatus: 'idle',
  error: null,
}

// Thunk asincroni: chiamano kpiService (GET /api/kpi/campaign e /api/kpi/daily);
// il valore restituito diventa action.payload
export const fetchCampaignKpis = createAsyncThunk('kpi/fetchCampaign', () => kpiService.getCampaignKpis())
export const fetchDailyKpis = createAsyncThunk('kpi/fetchDaily', () => kpiService.getDailyKpis())

const kpiSlice = createSlice({
  name: 'kpi',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // extraReducers: aggiornano lo stato in base all'esito di ciascun thunk
    builder
      // pending: richiesta in corso, DashboardLayout mostra il Loader
      .addCase(fetchCampaignKpis.pending, (state) => {
        state.campaignStatus = 'loading'
        state.error = null
      })
      // fulfilled: il JSON ricevuto (CampaignKpi) viene salvato nello store
      .addCase(fetchCampaignKpis.fulfilled, (state, action) => {
        state.campaignStatus = 'succeeded'
        state.campaign = action.payload
      })
      // rejected: salva il messaggio di errore, la sezione mostra un Alert
      .addCase(fetchCampaignKpis.rejected, (state, action) => {
        state.campaignStatus = 'failed'
        state.error = action.error.message ?? 'Errore sconosciuto'
      })
      .addCase(fetchDailyKpis.pending, (state) => {
        state.dailyStatus = 'loading'
        state.error = null
      })
      .addCase(fetchDailyKpis.fulfilled, (state, action) => {
        state.dailyStatus = 'succeeded'
        state.daily = action.payload
      })
      .addCase(fetchDailyKpis.rejected, (state, action) => {
        state.dailyStatus = 'failed'
        state.error = action.error.message ?? 'Errore sconosciuto'
      })
  },
})

export default kpiSlice.reducer
