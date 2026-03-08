import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../../src/App'

describe('App', () => {
  it('toont startscherm met titel en getallen 3 t/m 10', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /vriendjes van getallen/i })).toBeInTheDocument()
    expect(screen.getByText(/kies een getal en zoek de combinaties/i)).toBeInTheDocument()
    for (let n = 3; n <= 10; n++) {
      expect(screen.getByRole('button', { name: new RegExp(`getal ${n}`, 'i') })).toBeInTheDocument()
    }
  })

  it('na kiezen getal verschijnt memorybord', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /getal 4 kiezen/i }))
    expect(screen.getByText(/zoek de combinaties die samen \d+ maken/i)).toBeInTheDocument()
    expect(screen.getByText(/getal: 4/i)).toBeInTheDocument()
    const cards = screen.getAllByRole('button', { name: /kaart|gesloten kaart/i })
    expect(cards.length).toBeGreaterThanOrEqual(5)
  })

  it('klikken op kaart opent kaart', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /getal 3 kiezen/i }))
    const closed = screen.getAllByRole('button', { name: 'Gesloten kaart' })
    await user.click(closed[0])
    expect(screen.getByRole('button', { name: /^Kaart \d+$/ })).toBeInTheDocument()
  })

  it('terugknop gaat naar start', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /getal 5 kiezen/i }))
    await user.click(screen.getByRole('button', { name: /terug naar getalkeuze/i }))
    expect(screen.getByRole('heading', { name: /vriendjes van getallen/i })).toBeInTheDocument()
  })
})
