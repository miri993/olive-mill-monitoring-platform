import { useState } from 'react'
import Button from '@mui/material/Button'
import MenuIcon from '@mui/icons-material/Menu'
import { Outlet, useLocation, useNavigate } from 'react-router'
import SideMenu, { type MenuItem } from '../../components/SideMenu/SideMenu'

const dashboardSections: MenuItem[] = [
  { value: 'panoramica', label: 'Panoramica' },
  { value: 'produzione', label: 'Produzione' },
  { value: 'fermi', label: 'Fermi' },
  { value: 'sostenibilita', label: 'Sostenibilità' },
  { value: 'parametri', label: 'Parametri' },
]

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = pathname.split('/')[2] ?? 'panoramica'
  const activeLabel = dashboardSections.find((section) => section.value === activeSection)?.label

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
        <Outlet />
      </div>
    </div>
  )
}
