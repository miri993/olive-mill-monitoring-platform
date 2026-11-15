import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import '@fontsource-variable/figtree'
import '@fontsource-variable/montserrat'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { store } from './store/store'
import GlobalCssVariables from './styles/GlobalCssVariables'
import { theme } from './theme/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* injectFirst: i nostri file .css vincono sugli stili di MUI */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalCssVariables />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  </StrictMode>,
)
