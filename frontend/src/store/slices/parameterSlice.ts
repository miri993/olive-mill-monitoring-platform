import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { EconomicParameter } from '../../models/EconomicParameter'
import { parameterService } from '../../services/parameterService'
import type { RequestStatus } from '../requestStatus'
import { fetchCampaignKpis, fetchDailyKpis } from './kpiSlice'

interface ParameterState {
  items: EconomicParameter[]
  status: RequestStatus
  error: string | null
}

const initialState: ParameterState = { items: [], status: 'idle', error: null }

export const fetchParameters = createAsyncThunk('parameters/fetch', () => parameterService.getParameters())

// Quando cambia un parametro (es. prezzo olio) ricarico i KPI
export const updateParameter = createAsyncThunk(
  'parameters/update',
  async ({ id, value }: { id: number; value: number }, { dispatch }) => {
    const updated = await parameterService.updateParameter(id, value)
    dispatch(fetchCampaignKpis())
    dispatch(fetchDailyKpis())
    return updated
  },
)

const parameterSlice = createSlice({
  name: 'parameters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParameters.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchParameters.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchParameters.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Errore sconosciuto'
      })
      .addCase(updateParameter.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateParameter.rejected, (state, action) => {
        state.error = action.error.message ?? 'Errore sconosciuto'
      })
  },
})

export default parameterSlice.reducer
