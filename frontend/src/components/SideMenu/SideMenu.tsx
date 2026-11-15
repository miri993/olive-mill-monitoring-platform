import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import './SideMenu.css'

export type MenuItem = {
  value: string
  label: string
}

type SideMenuProps = {
  items: MenuItem[]
  value: string
  onChange: (value: string) => void
  open: boolean
  onClose: () => void
  ariaLabel: string
}

// Menu fisso da desktop, hamburger da mobile
export default function SideMenu({ items, value, onChange, open, onClose, ariaLabel }: SideMenuProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const handleClick = (itemValue: string) => {
    onChange(itemValue)
    onClose()
  }

  return (
    <Drawer
      className="side-menu"
      variant={isDesktop ? 'permanent' : 'temporary'}
      open={isDesktop || open}
      onClose={onClose}
    >
      <nav aria-label={ariaLabel}>
        <List className="side-menu-list">
          {items.map((item) => (
            <ListItemButton
              key={item.value}
              className="side-menu-item"
              selected={item.value === value}
              aria-current={item.value === value ? 'page' : undefined}
              onClick={() => handleClick(item.value)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </nav>
    </Drawer>
  )
}
