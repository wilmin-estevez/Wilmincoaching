// Fuzzy match exercise name to a GIF key from the manifest
export function normalizeExerciseName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim()
}

// Score how well an exercise name matches a GIF name (F1-style)
function matchScore(exerciseName: string, gifName: string): number {
  const exWords = normalizeExerciseName(exerciseName).split(' ').filter(w => w.length > 2)
  const gifWords = normalizeExerciseName(gifName).split(/[_\s]+/).filter(w => w.length > 2)

  if (!exWords.length || !gifWords.length) return 0

  let matches = 0
  for (const w of exWords) {
    if (gifWords.some(g => g.includes(w) || w.includes(g))) matches++
  }
  const precision = matches / exWords.length
  const recall = matches / gifWords.length
  if (precision + recall === 0) return 0
  return (2 * precision * recall) / (precision + recall)
}

let manifest: { baseUrl: string; exercises: Record<string, string> } | null = null

async function loadManifest() {
  if (manifest) return manifest
  try {
    const res = await fetch('/exercise-gifs.json')
    if (!res.ok) throw new Error('not found')
    manifest = await res.json()
  } catch {
    manifest = null
  }
  return manifest
}

export async function findExerciseGif(exerciseName: string): Promise<string | null> {
  const m = await loadManifest()
  if (!m) return null

  let bestKey: string | null = null
  let bestScore = 0

  for (const [name, key] of Object.entries(m.exercises)) {
    const score = matchScore(exerciseName, name)
    if (score > bestScore) {
      bestScore = score
      bestKey = key
    }
  }

  if (bestScore < 0.4) return null
  return bestKey ? `${m.baseUrl}/${bestKey}` : null
}
