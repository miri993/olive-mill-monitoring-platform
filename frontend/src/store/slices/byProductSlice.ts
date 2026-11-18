import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { ByProduct } from '../../models/ByProduct'
import { byProductService } from '../../services/byProductService'
import type { RequestStatus } from '../requestStatus'

interface ByProductState {
  items: ByProduct[]
  status: RequestStatus
  error: string | null
}

const initialState: ByProductState = { items: [], status: 'idle', error: null }

// Thunk asincrono: chiama il service e restituisce la risposta già tipizzata
export const fetchByProducts = createAsyncThunk('byProducts/fetch', () => byProductService.getByProducts())

const byProductSlice = createSlice({
  name: 'byProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Tre stati della richiesta: in attesa, completata, fallita
    builder
      .addCase(fetchByProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchByProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchByProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Errore sconosciuto'
      })
  },
})

export default byProductSlice.reducer
