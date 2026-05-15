import type { Client } from './supabase/types'

export const DAYS_ES = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const
export type DayKey = typeof DAYS_ES[number]

export type CycleLevel = 0 | 1 | 2

export const CYCLE_LABELS: Record<CycleLevel, string> = {
  0: 'ALTO',
  1: 'MEDIO',
  2: 'BAJO',
}

export interface Macros {
  kcal: number
  protein_g: number
  carbs_high_g: number
  carbs_mid_g: number
  carbs_low_g: number
  fat_g: number
  cycle: CycleLevel[]
}

type ClientFields = Pick<Client, 'weight_kg' | 'height_m' | 'age' | 'sex' | 'goal' | 'training_days'>

export function calcMacros(client: ClientFields): Macros {
  const weight = client.weight_kg ?? 75
  const height = client.height_m ?? 1.70
  const age = client.age ?? 30
  const isMale = (client.sex ?? 'M').toUpperCase() !== 'F'
  const trainingDays = client.training_days ?? 4

  const heightCm = height * 100
  const bmr = isMale
    ? 10 * weight + 6.25 * heightCm - 5 * age + 5
    : 10 * weight + 6.25 * heightCm - 5 * age - 161

  const activityFactor =
    trainingDays >= 6 ? 1.725 :
    trainingDays >= 4 ? 1.55 :
    trainingDays >= 2 ? 1.375 : 1.2

  const tdee = bmr * activityFactor

  const goal = client.goal ?? 'habits'
  const kcalMultiplier =
    goal === 'lose_fat' ? 0.85 :
    goal === 'gain_muscle' ? 1.10 : 1.0

  const kcal = Math.round(tdee * kcalMultiplier)
  const protein_g = Math.round(weight * 2.2)
  const fat_g = Math.round((kcal * 0.25) / 9)
  const carbs_high_g = Math.round((kcal - protein_g * 4 - fat_g * 9) / 4)
  const carbs_mid_g = Math.round(carbs_high_g * 0.70)
  const carbs_low_g = Math.round(carbs_high_g * 0.40)
  const cycle = defaultCycle(trainingDays)

  return { kcal, protein_g, carbs_high_g, carbs_mid_g, carbs_low_g, fat_g, cycle }
}

export function defaultCycle(trainingDays: number | null): CycleLevel[] {
  const days = trainingDays ?? 4
  if (days >= 5) return [0, 1, 0, 1, 0, 1, 2]
  if (days === 4) return [0, 1, 0, 1, 2, 2, 2]
  if (days === 3) return [0, 2, 1, 2, 0, 2, 2]
  return [0, 2, 2, 1, 2, 2, 2]
}
