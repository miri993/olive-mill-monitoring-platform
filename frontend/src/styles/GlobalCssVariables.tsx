import GlobalStyles from '@mui/material/GlobalStyles'
import { colors, fontSizes, fonts, radius } from './variables'

const toKebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const cssVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(colors).map(([name, value]) => [`--color-${toKebab(name)}`, value])),
  '--font-base': fonts.base,
  '--font-heading': fonts.heading,
  ...Object.fromEntries(Object.entries(fontSizes).map(([name, value]) => [`--font-size-${name}`, `${value}px`])),
  '--radius-base': `${radius.base}px`,
  '--radius-small': `${radius.small}px`,
}

export default function GlobalCssVariables() {
  return <GlobalStyles styles={{ ':root': cssVariables }} />
}
