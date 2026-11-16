import CircularProgress from '@mui/material/CircularProgress'
import './Loader.css'

type LoaderProps = {
  label: string
}

export default function Loader({ label }: LoaderProps) {
  return (
    <div className="loader" role="status">
      <CircularProgress className="loader-spinner" size={40} />
      <p className="loader-label">{label}</p>
    </div>
  )
}
