import { describe, it, expect } from 'vitest'
import { calcMacros, defaultCycle } from '../macros'

describe('calcMacros', () => {
  it('returns positive numbers for a typical male client', () => {
    const result = calcMacros({
      weight_kg: 80, height_m: 1.75, age: 30,
      sex: 'M', goal: 'lose_fat', training_days: 4,
    })
    expect(result.kcal).toBeGreaterThan(1500)
    expect(result.protein_g).toBe(176)
    expect(result.fat_g).toBeGreaterThan(0)
    expect(result.carbs_high_g).toBeGreaterThan(result.carbs_mid_g)
    expect(result.carbs_mid_g).toBeGreaterThan(result.carbs_low_g)
    expect(result.carbs_low_g).toBeGreaterThan(0)
    expect(result.cycle).toHaveLength(7)
  })

  it('gain_muscle gives more kcal than lose_fat', () => {
    const base = { weight_kg: 70, height_m: 1.70, age: 25, sex: 'M', training_days: 3 }
    const cut = calcMacros({ ...base, goal: 'lose_fat' })
    const bulk = calcMacros({ ...base, goal: 'gain_muscle' })
    expect(bulk.kcal).toBeGreaterThan(cut.kcal)
  })

  it('handles all-null input with safe defaults', () => {
    const result = calcMacros({
      weight_kg: null, height_m: null, age: null,
      sex: null, goal: null, training_days: null,
    })
    expect(result.kcal).toBeGreaterThan(0)
    expect(result.cycle).toHaveLength(7)
  })

  it('female BMR is lower than male for same stats', () => {
    const base = { weight_kg: 65, height_m: 1.65, age: 28, goal: 'habits' as const, training_days: 3 }
    const male = calcMacros({ ...base, sex: 'M' })
    const female = calcMacros({ ...base, sex: 'F' })
    expect(male.kcal).toBeGreaterThan(female.kcal)
  })
})

describe('defaultCycle', () => {
  it('returns exactly 7 values', () => {
    expect(defaultCycle(4)).toHaveLength(7)
    expect(defaultCycle(null)).toHaveLength(7)
    expect(defaultCycle(2)).toHaveLength(7)
  })

  it('returns only 0, 1, or 2', () => {
    [2, 3, 4, 5, 6].forEach((days) => {
      defaultCycle(days).forEach((level) => {
        expect([0, 1, 2]).toContain(level)
      })
    })
  })
})
