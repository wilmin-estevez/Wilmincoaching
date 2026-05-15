import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, daysRemaining, goalLabel } from '../utils'

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

describe('daysRemaining', () => {
  it('returns null for null input', () => {
    expect(daysRemaining(null)).toBeNull()
  })

  it('returns a negative number for past dates', () => {
    const past = new Date(Date.now() - 10 * 86400000).toISOString()
    expect(daysRemaining(past)).toBeLessThan(0)
  })

  it('returns a positive number for future dates', () => {
    const future = new Date(Date.now() + 10 * 86400000).toISOString()
    expect(daysRemaining(future)).toBeGreaterThan(0)
  })
})

describe('goalLabel', () => {
  it('maps lose_fat', () => {
    expect(goalLabel('lose_fat')).toBe('Pérdida de grasa')
  })

  it('returns raw string for unknown goals', () => {
    expect(goalLabel('unknown_goal')).toBe('unknown_goal')
  })

  it('returns dash for null', () => {
    expect(goalLabel(null)).toBe('—')
  })
})
