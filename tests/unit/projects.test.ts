import { describe, it, expect } from 'vitest'
import { projects } from '../../.vitepress/data/projects'

describe('projects data', () => {
  it('has at least 10 curated projects', () => {
    expect(projects.length).toBeGreaterThanOrEqual(10)
  })
  it('has 5 or 6 featured projects for the home page', () => {
    const featured = projects.filter((p) => p.featured)
    expect(featured.length).toBeGreaterThanOrEqual(5)
    expect(featured.length).toBeLessThanOrEqual(6)
  })
  it('every project is well-formed', () => {
    for (const p of projects) {
      expect(p.name).toBeTruthy()
      expect(p.repo).toMatch(/^https:\/\/github\.com\/marr-cloud\//)
      expect(p.language).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.description_en).toBeTruthy()
      expect(Array.isArray(p.tags)).toBe(true)
      expect(p.tags.length).toBeGreaterThan(0)
    }
  })
})
