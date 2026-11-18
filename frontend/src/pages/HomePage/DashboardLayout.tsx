import { useState } from 'react'
import Button from '@mui/material/Button'
import MenuIcon from '@mui/icons-material/Menu'
import { Outlet, useLocation, useNavigate } from 'react-router'
import SideMenu, { type MenuItem } from '../../components/SideMenu/SideMenu'
import Loader from '../../components/Loader/Loader'
import { useAppSelector } from '../../store/hooks'

// Sezioni della dashboard: ognuna ha la sua rotta /dashboard/<sezione>
const dashboardSections: MenuItem[] = [
  { value: 'panoramica', label: 'Panoramica' },
  { value: 'produzione', label: 'Produzione' },
  { value: 'fermi', label: 'Fermi' },
  { value: 'sostenibilita', label: 'Sostenibilità' },
  { value: 'parametri', label: 'Parametri' },
]

// Layout comune della dashboard: menu laterale, pulsante del menu e sezione attiva (Outlet di React Router)
export default function DashboardLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = pathname.split('/')[2] ?? 'panoramica'
  const activeLabel = dashboardSections.find((section) => section.value === activeSection)?.label

  // Mostra il Loader finché almeno una delle richieste necessarie è in corso
  const loading = useAppSelector((state) =>
    [state.kpi.campaignStatus, state.kpi.dailyStatus, state.downtimes.status, state.byProducts.status, state.parameters.status]
      .some((status) => status === 'loading') || state.kpi.campaignStatus === 'idle',
  )

  // Cambio sezione: aggiorna l'indirizzo e riporta la pagina in alto
  const changeSection = (section: string) => {
    navigate(`/dashboard/${section}`)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="dashboard-layout">
      <SideMenu items={dashboardSections} value={activeSection} onChange={changeSection}
        open={menuOpen} onClose={() => setMenuOpen(false)} ariaLabel="Sezioni della dashboard" />

      <div className="dashboard-content">
        <Button className="dashboard-menu-button" variant="outlined" startIcon={<MenuIcon />}
          onClick={() => setMenuOpen(true)} aria-label={`Apri il menu delle sezioni, sezione attuale ${activeLabel}`}>
          {activeLabel}
        </Button>
        {loading && <Loader label="Caricamento dei dati…" />}
        <div className={loading ? 'dashboard-outlet dashboard-outlet-hidden' : 'dashboard-outlet'}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
