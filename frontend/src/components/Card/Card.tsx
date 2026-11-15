import type { ReactNode } from 'react'
import MuiCard from '@mui/material/Card'
import './Card.css'

type CardProps = {
  imageSrc?: string
  imageAlt: string
  imageCredit?: string
  title: string
  label?: string
  children?: ReactNode
}

export default function Card({ imageSrc, imageAlt, imageCredit, title, label, children }: CardProps) {
  return (
    <MuiCard className="card">
      {imageSrc
        ? <img className="card-image" src={imageSrc} alt={imageAlt} />
        : <div className="card-image card-image-placeholder">[Foto: {imageAlt}]</div>}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {label && <p className="card-label">{label}</p>}
        {children && <div className="card-text">{children}</div>}
        {imageCredit && <p className="card-credit">{imageCredit}</p>}
      </div>
    </MuiCard>
  )
}
