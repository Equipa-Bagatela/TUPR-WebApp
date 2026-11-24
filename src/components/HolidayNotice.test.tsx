// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { HolidayNotice } from './HolidayNotice'

afterEach(cleanup)

describe('HolidayNotice', () => {
  it('avisa no Natal', () => {
    const { container } = render(<HolidayNotice date={new Date(2026, 11, 25)} />)
    expect(container.textContent).toMatch(/Feriado nacional: Natal/)
  })
  it('não aparece num dia normal', () => {
    const { container } = render(<HolidayNotice date={new Date(2026, 10, 24)} />)
    expect(container.textContent).toBe('')
  })
})
