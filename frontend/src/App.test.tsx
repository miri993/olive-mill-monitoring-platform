import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App'
import { store } from './store/store'

function renderAt(path: string) {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>,
  )
}

describe('App', () => {
  it('apre la pagina del progetto', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'Frantoi in EVOluzione' })).toBeInTheDocument()
  })

  it('passa alla dashboard cliccando la tab e mostra la Panoramica', () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('tab', { name: 'Dashboard' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Panoramica' })).toBeInTheDocument()
  })

  it('apre direttamente una sezione dal suo indirizzo', () => {
    renderAt('/dashboard/produzione')
    expect(screen.getByRole('heading', { level: 1, name: 'Produzione' })).toBeInTheDocument()
  })
})