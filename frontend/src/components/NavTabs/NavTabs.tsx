import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import './NavTabs.css'

export type TabItem = {
  value: string
  label: string
}

type NavTabsProps = {
  tabs: TabItem[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}

export default function NavTabs({ tabs, value, onChange, ariaLabel }: NavTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={(_, newValue: string) => onChange(newValue)}
      aria-label={ariaLabel}
      className="nav-tabs"
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={tab.label}
          id={`tab-${tab.value}`}
          aria-controls={`panel-${tab.value}`}
          className="nav-tab"
        />
      ))}
    </Tabs>
  )
}
