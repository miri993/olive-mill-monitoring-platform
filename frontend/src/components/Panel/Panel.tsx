import type { ReactNode } from 'react'
import './Panel.css'

type PanelProps = {
  title: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export default function Panel({ title, subtitle, className, children }: PanelProps) {
  return (
    <section className={className ? `panel ${className}` : 'panel'}>
      <div className="panel-header">
        <h2 className="panel-title">{title}</h2>
        {subtitle && <p className="panel-subtitle">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
