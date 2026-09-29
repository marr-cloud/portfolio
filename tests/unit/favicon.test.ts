import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const svg = readFileSync(
  fileURLToPath(new URL('../../public/favicon.svg', import.meta.url)),
  'utf8'
)

describe('favicon', () => {
  it('has no opaque dark background — gear only, transparent', () => {
    // the old dark background/hole color must be gone
    expect(svg).not.toMatch(/#17120d/i)
    // a full-canvas background rect would make it opaque
    expect(svg).not.toMatch(/<rect[^>]*width="100"[^>]*height="100"[^>]*fill="#[0-9a-fA-F]{6}"/)
  })
  it('keeps the gear centre transparent via a mask', () => {
    expect(svg).toMatch(/<mask/)
  })
})
