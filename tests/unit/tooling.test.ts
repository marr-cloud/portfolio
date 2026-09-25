import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../package.json', import.meta.url)), 'utf8')
)

describe('tooling config', () => {
  it('declares a pnpm packageManager so pnpm/action-setup@v4 works in CI', () => {
    expect(pkg.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+/)
  })
})
