import type { ReactNode } from 'react'
import Chip from '@mui/material/Chip'
import './HeroBanner.css'

type HeroBannerProps = {
  badge?: string
  title: string
  subtitle?: string
  actionButtons?: ReactNode
  imageSrc: string
  imageAlt: string
  imageCredit?: string
  children?: ReactNode
}

// Banner iniziale della scheda "Il progetto": testo e pulsanti da un lato, foto con credito dall'altro
export default function HeroBanner({ badge, title, subtitle, actionButtons, imageSrc, imageAlt, imageCredit, children }: HeroBannerProps) {
  return (
    <section className="hero-banner">
      <div className="hero-banner-text">
        {badge && <Chip label={badge} />}
        <h1 className="hero-banner-title">{title}</h1>
        <div className="hero-banner-body">
          {subtitle && <p className="hero-banner-subtitle">{subtitle}</p>}
          {children}
        </div>
        {actionButtons && <div className="hero-banner-actions">{actionButtons}</div>}
      </div>
      <figure className="hero-banner-image">
        <img decoding="async" src={imageSrc} alt={imageAlt} />
        {imageCredit && <figcaption className="hero-banner-credit">{imageCredit}</figcaption>}
      </figure>
    </section>
  )
}
