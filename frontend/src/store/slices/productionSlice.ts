import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { DailyProduction } from '../../models/DailyProduction'
import { productionService } from '../../services/productionService'
import type { RequestStatus } from '../requestStatus'

interface ProductionState {
  items: DailyProduction[]
  status: RequestStatus
  error: string | null
}

const initialState: ProductionState = { items: [], status: 'idle', error: null }

// Thunk asincrono: chiama il service e restituisce la risposta già tipizzata
export const fetchProduction = createAsyncThunk('production/fetch', () => productionService.getProduction())

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Tre stati della richiesta: in attesa, completata, fallita
    builder
      .addCase(fetchProduction.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProduction.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProduction.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Errore sconosciuto'
      })
  },
})

export default productionSlice.reducer
