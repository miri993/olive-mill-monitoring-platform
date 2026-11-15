import type { ReactNode } from 'react'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import './Header.css'

type HeaderProps = {
  title: string
  logoSrc: string
  children?: ReactNode 
}

export default function Header({ title, logoSrc, children }: HeaderProps) {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters className="header-toolbar">
          <div className="header-box">
            <img src={logoSrc} alt="" className="header-logo" />
            <span className="header-title">{title}</span>
          </div>
          {children}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
