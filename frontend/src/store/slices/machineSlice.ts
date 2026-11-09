import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Machine } from '../../models/Machine'
import { machineService } from '../../services/machineService'
import type { RequestStatus } from '../requestStatus'

interface MachineState {
  items: Machine[]
  status: RequestStatus
  error: string | null
}

const initialState: MachineState = { items: [], status: 'idle', error: null }

export const fetchMachines = createAsyncThunk('machines/fetch', () => machineService.getMachines())

const machineSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Errore sconosciuto'
      })
  },
})

export default machineSlice.reducer
