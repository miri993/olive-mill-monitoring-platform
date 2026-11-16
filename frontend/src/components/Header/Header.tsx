import type { ReactNode } from 'react'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import { Link } from 'react-router'
import './Header.css'

type HeaderProps = {
  title: string
  logoSrc: string
  homePath: string
  children?: ReactNode 
}

export default function Header({ title, logoSrc, homePath, children }: HeaderProps) {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters className="header-toolbar">
          <Link to={homePath} className="header-box" aria-label={title} onClick={() => window.scrollTo({ top: 0 })}>
            <img src={logoSrc} alt="" className="header-logo" />
            <span className="header-title">{title}</span>
          </Link>
          {children}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
