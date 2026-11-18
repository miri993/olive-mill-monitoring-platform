import type { ReactNode } from 'react'
import MuiCard from '@mui/material/Card'
import './Card.css'

type CardProps = {
  imageSrc?: string
  imageAlt: string
  imageCredit?: string
  imagePosition?: string
  title: string
  label?: string
  children?: ReactNode
}

// Card riutilizzabile con foto, credito della foto, titolo e testo
export default function Card({ imageSrc, imageAlt, imageCredit, imagePosition, title, label, children }: CardProps) {
  return (
    <MuiCard className="card">
      {imageSrc
        ? (
          <figure className="card-figure">
            <img decoding="async" className="card-image" src={imageSrc} alt={imageAlt} style={{ objectPosition: imagePosition }} />
            {imageCredit && <figcaption className="card-credit">{imageCredit}</figcaption>}
          </figure>
        )
        : <div className="card-image card-image-placeholder">[Foto: {imageAlt}]</div>}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {label && <p className="card-label">{label}</p>}
        {children && <div className="card-text">{children}</div>}
      </div>
    </MuiCard>
  )
}
