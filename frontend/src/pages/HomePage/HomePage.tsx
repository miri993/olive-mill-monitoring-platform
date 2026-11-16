import { useEffect } from 'react'
import Container from '@mui/material/Container'
import { Outlet, useLocation, useNavigate } from 'react-router'
import Header from '../../components/Header/Header'
import NavTabs, { type TabItem } from '../../components/NavTabs/NavTabs'
import { useAppDispatch } from '../../store/hooks'
import { fetchCampaignKpis, fetchDailyKpis } from '../../store/slices/kpiSlice'
import './HomePage.css'

const tabs: TabItem[] = [
  { value: 'progetto', label: 'Il progetto' },
  { value: 'dashboard', label: 'Dashboard' },
]

// Struttura comune a tutte le pagine: header con i tab e contenuto della rotta attiva
export default function HomePage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const activeTab = pathname.startsWith('/dashboard') ? 'dashboard' : 'progetto'

  // Al primo avvio carica i KPI della campagna e quelli giornalieri
  useEffect(() => {
    dispatch(fetchCampaignKpis())
    dispatch(fetchDailyKpis())
  }, [dispatch])

  const changeTab = (tab: string) => {
    navigate(tab === 'dashboard' ? '/dashboard/panoramica' : '/')
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <Header title="Frantoi in EVOluzione" logoSrc="/favicon.svg" homePath="/">
        <NavTabs tabs={tabs} value={activeTab} onChange={changeTab} ariaLabel="Viste della piattaforma" />
      </Header>

      <Container component="main" maxWidth="lg">
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          <Outlet />
        </div>
      </Container>
    </>
  )
}
