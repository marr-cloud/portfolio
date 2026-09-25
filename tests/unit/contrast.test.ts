import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const css = readFileSync(
  fileURLToPath(new URL('../../.vitepress/theme/custom.css', import.meta.url)),
  'utf8'
)

// Extract a `--var: #hex;` value from within a given top-level selector block.
function tokenIn(selector: string, name: string): string {
  const block = css.slice(css.indexOf(selector + ' {'))
  const m = block.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!m) throw new Error(`token ${name} not found under ${selector}`)
  return m[1]
}

function luminance(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function contrast(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

const AA = 4.5

describe('theme text contrast meets WCAG AA (4.5:1) in both modes', () => {
  for (const mode of [':root', '.dark'] as const) {
    const brand = tokenIn(mode, '--vp-c-brand-1')
    const bg = tokenIn(mode, '--vp-c-bg')
    const bgSoft = tokenIn(mode, '--vp-c-bg-soft')

    it(`${mode}: brand-1 on bg`, () => {
      expect(contrast(brand, bg)).toBeGreaterThanOrEqual(AA)
    })
    it(`${mode}: brand-1 on bg-soft (chips/cards)`, () => {
      expect(contrast(brand, bgSoft)).toBeGreaterThanOrEqual(AA)
    })
  }
})
