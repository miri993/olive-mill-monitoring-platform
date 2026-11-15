import { createTheme } from '@mui/material/styles'
import { colors, fonts, radius } from '../styles/variables'

// Tema del sito, basato sui colori del logo e sulle variabili definite in styles/variables.ts
export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: { main: colors.oliveDark, light: colors.olive, contrastText: colors.white },
    secondary: { main: colors.amber, contrastText: colors.white },
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    background: { default: colors.background, paper: colors.white },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
    divider: colors.border,
  },
  typography: {
    fontFamily: fonts.base,
    h1: {
      fontFamily: fonts.heading,
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (min-width:900px)': { fontSize: '1.75rem' },
    },
    h2: { fontFamily: fonts.heading, fontSize: '1.0625rem', fontWeight: 600 }, 
    h3: { fontFamily: fonts.heading, fontSize: '1.125rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: radius.base,
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}` },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 44, borderRadius: radius.small, paddingInline: 20, whiteSpace: 'nowrap' },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { borderColor: colors.border, borderRadius: radius.base },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { backgroundColor: colors.oliveLight, color: colors.oliveDark, fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { color: colors.textSecondary, fontWeight: 600 },
        root: { borderBottomColor: colors.border },
      },
    },
  },
})
