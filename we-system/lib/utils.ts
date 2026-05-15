import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function daysRemaining(expiresAt: string | null): number | null {
  if (!expiresAt) return null
  return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
}

const GOAL_LABELS: Record<string, string> = {
  lose_fat:    'Pérdida de grasa',
  gain_muscle: 'Ganar músculo',
  habits:      'Hábitos',
  performance: 'Rendimiento',
}

export function goalLabel(goal: string | null): string {
  if (!goal) return '—'
  return GOAL_LABELS[goal] ?? goal
}
