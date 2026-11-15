import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import './KpiCard.css'

type KpiCardProps = {
  label: string
  value: string
  info?: string
}

export default function KpiCard({ label, value, info }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span>{label}</span>
        {info && (
          <Tooltip title={info}>
            <IconButton size="small" aria-label={`Cos'è ${label}`}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <p className="kpi-card-value">{value}</p>
    </div>
  )
}
