import Anthropic from '@anthropic-ai/sdk'

const rawKey = process.env.ANTHROPIC_API_KEY ?? ''
// Strip BOM (0xFEFF) and surrounding whitespace that can sneak in via some env injection methods
const apiKey = rawKey.replace(/^﻿/, '').trim()

export const anthropic = new Anthropic({ apiKey })

export const MODEL = 'claude-sonnet-4-6'
