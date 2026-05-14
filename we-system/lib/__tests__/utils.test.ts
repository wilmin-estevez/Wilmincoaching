import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate } from '../utils'

describe('formatCurrency', () => {
  it('formats positive amounts', () => {
    const result = formatCurrency(1500)
    expect(result).toContain('1')
    expect(result).toContain('500')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2026-05-14')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })
})
