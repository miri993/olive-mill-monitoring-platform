import { configureStore } from '@reduxjs/toolkit'
import byProductReducer from './slices/byProductSlice'
import downtimeReducer from './slices/downtimeSlice'
import kpiReducer from './slices/kpiSlice'
import machineReducer from './slices/machineSlice'
import parameterReducer from './slices/parameterSlice'
import productionReducer from './slices/productionSlice'
import simulationReducer from './slices/simulationSlice'

export const store = configureStore({
  reducer: {
    machines: machineReducer,
    production: productionReducer,
    downtimes: downtimeReducer,
    byProducts: byProductReducer,
    parameters: parameterReducer,
    kpi: kpiReducer,
    simulation: simulationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
