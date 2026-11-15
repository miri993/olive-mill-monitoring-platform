import { Navigate, Route, Routes } from 'react-router'
import DashboardLayout from './pages/HomePage/DashboardLayout'
import HomePage from './pages/HomePage/HomePage'
import DowntimeSection from './pages/HomePage/sections/DowntimeSection'
import OverviewSection from './pages/HomePage/sections/OverviewSection'
import ParametersSection from './pages/HomePage/sections/ParametersSection'
import ProductionSection from './pages/HomePage/sections/ProductionSection'
import ProjectSection from './pages/HomePage/sections/ProjectSection'
import SustainabilitySection from './pages/HomePage/sections/SustainabilitySection'

// "/" = Il progetto, "/dashboard/<sezione>" = una sezione della dashboard
export default function App() {
  return (
    <Routes>
      <Route element={<HomePage />}>
        <Route index element={<ProjectSection />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="panoramica" replace />} />
          <Route path="panoramica" element={<OverviewSection />} />
          <Route path="produzione" element={<ProductionSection />} />
          <Route path="fermi" element={<DowntimeSection />} />
          <Route path="sostenibilita" element={<SustainabilitySection />} />
          <Route path="parametri" element={<ParametersSection />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
