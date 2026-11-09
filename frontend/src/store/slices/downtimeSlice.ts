import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Downtime } from '../../models/Downtime'
import { downtimeService } from '../../services/downtimeService'
import type { RequestStatus } from '../requestStatus'

interface DowntimeState {
  items: Downtime[]
  status: RequestStatus
  error: string | null
}

const initialState: DowntimeState = { items: [], status: 'idle', error: null }

export const fetchDowntimes = createAsyncThunk('downtimes/fetch', () => downtimeService.getDowntimes())

const downtimeSlice = createSlice({
  name: 'downtimes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDowntimes.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDowntimes.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchDowntimes.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Errore sconosciuto'
      })
  },
})

export default downtimeSlice.reducer
