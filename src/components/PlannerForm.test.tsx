// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PlannerForm } from './PlannerForm'

afterEach(cleanup)

describe('PlannerForm', () => {
  it('pede origem e destino antes de planear', () => {
    const onSubmit = vi.fn()
    render(<PlannerForm onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: /Planear viagem/i }))
    expect(screen.getByRole('alert').textContent).toMatch(/Escolha a paragem de partida e a de destino/)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('escolhe paragens, troca e submete', () => {
    const onSubmit = vi.fn()
    render(<PlannerForm onSubmit={onSubmit} initial={{ date: '2026-12-01', time: '09:00' }} />)
    const [de, para] = screen.getAllByRole('combobox')
    for (const [input, texto] of [[de, 'estacao'], [para, 'ponte']] as const) {
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: texto } })
      fireEvent.keyDown(input, { key: 'Enter' })
    }
    fireEvent.click(screen.getByRole('button', { name: /Trocar origem e destino/i }))
    fireEvent.click(screen.getByRole('button', { name: /Planear viagem/i }))
    expect(onSubmit).toHaveBeenCalledWith({ from: 'ponte', to: 'estacao', date: '2026-12-01', time: '09:00' })
  })

  it('não deixa origem e destino iguais', () => {
    const onSubmit = vi.fn()
    render(<PlannerForm onSubmit={onSubmit} initial={{ from: 'estacao', to: 'estacao' }} />)
    fireEvent.click(screen.getByRole('button', { name: /Planear viagem/i }))
    expect(screen.getByRole('alert').textContent).toMatch(/diferentes/)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
