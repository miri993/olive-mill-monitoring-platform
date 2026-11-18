import GlobalStyles from '@mui/material/GlobalStyles'
import { colors, fontSizes, fonts, radius } from './variables'

// Converte i nomi da camelCase a kebab-case (oliveDark -> olive-dark)
const toKebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

// Trasforma i valori di variables.ts in variabili CSS (--color-olive-dark, --font-base...)
const cssVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(colors).map(([name, value]) => [`--color-${toKebab(name)}`, value])),
  '--font-base': fonts.base,
  '--font-heading': fonts.heading,
  ...Object.fromEntries(Object.entries(fontSizes).map(([name, value]) => [`--font-size-${name}`, `${value}px`])),
  '--radius-base': `${radius.base}px`,
  '--radius-small': `${radius.small}px`,
}

// Inserisce le variabili in :root, così i file .css dei componenti le usano con var(--...)
export default function GlobalCssVariables() {
  return <GlobalStyles styles={{ ':root': cssVariables }} />
}
