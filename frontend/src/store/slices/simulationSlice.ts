import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { GenerationSummary } from '../../models/GenerationSummary'
import { simulationService } from '../../services/simulationService'
import type { RequestStatus } from '../requestStatus'
import { fetchByProducts } from './byProductSlice'
import { fetchDowntimes } from './downtimeSlice'
import { fetchCampaignKpis, fetchDailyKpis } from './kpiSlice'
import { fetchMachines } from './machineSlice'
import { fetchParameters } from './parameterSlice'
import { fetchProduction } from './productionSlice'

interface SimulationState {
  summary: GenerationSummary | null
  status: RequestStatus
  error: string | null
}

const initialState: SimulationState = { summary: null, status: 'idle', error: null }

// Genera nuovi dati simulati e poi ricarica tutti i dati della dashboard
export const generateData = createAsyncThunk('simulation/generate', async (seed: number | undefined, { dispatch }) => {
  const summary = await simulationService.generateData(seed)
  dispatch(fetchMachines())
  dispatch(fetchProduction())
  dispatch(fetchDowntimes())
  dispatch(fetchByProducts())
  dispatch(fetchParameters())
  dispatch(fetchCampaignKpis())
  dispatch(fetchDailyKpis())
  return summary
})

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateData.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(generateData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.summary = action.payload
      })
      .addCase(generateData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Errore sconosciuto'
      })
  },
})

export default simulationSlice.reducer
