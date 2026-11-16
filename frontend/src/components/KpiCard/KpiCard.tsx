import { useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import './KpiCard.css'

type KpiCardProps = {
  label: string
  value: string
  info?: string
}

export default function KpiCard({ label, value, info }: KpiCardProps) {
  const [infoOpen, setInfoOpen] = useState(false)
  // Su mobile si accede alle info con un click
  const isTouchScreen = useMediaQuery('(hover: none)')

  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span>{label}</span>
        {info && (
          <ClickAwayListener onClickAway={() => setInfoOpen(false)}>
            <Tooltip title={info} open={infoOpen} onOpen={() => setInfoOpen(true)} onClose={() => setInfoOpen(false)}
              disableTouchListener disableHoverListener={isTouchScreen}
              classes={{ tooltip: 'kpi-card-tooltip' }}>
              <IconButton size="small" aria-label={`Cos'è ${label}`} onClick={() => setInfoOpen(true)}>
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </ClickAwayListener>
        )}
      </div>
      <p className="kpi-card-value">{value}</p>
    </div>
  )
}
