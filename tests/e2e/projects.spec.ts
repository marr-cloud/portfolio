import { test, expect } from '@playwright/test'

test('project cards never show a tag that duplicates the language chip', async ({ page }) => {
  await page.goto('/proyectos')
  for (const name of ['ch-utils', 'aijcriltda', 'kiro-gateway-go', 'Keycloak-ECS']) {
    const card = page.locator('.cm-card').filter({ hasText: name })
    const chips = (await card.locator('.cm-chip').allInnerTexts()).map((c) => c.trim().toLowerCase())
    expect(new Set(chips).size, `duplicate chips on ${name}: ${chips.join(', ')}`).toBe(chips.length)
  }
})

test('tag rows sit at the bottom of every card (consistent alignment)', async ({ page }) => {
  await page.goto('/proyectos')
  const gaps = await page.$$eval('.cm-card', (els) =>
    els.map((el) => {
      const cardBottom = el.getBoundingClientRect().bottom
      const tags = el.querySelector('.cm-card__tags')
      const tagsBottom = tags.getBoundingClientRect().bottom
      return Math.round(cardBottom - tagsBottom)
    })
  )
  // With tags pinned to the bottom, only the card's bottom padding (~16px)
  // sits below them — no card should have a large empty gap.
  for (const g of gaps) expect(g).toBeLessThanOrEqual(24)
})

test('project filters expose their pressed state to assistive tech', async ({ page }) => {
  await page.goto('/proyectos')
  const first = page.locator('.cm-filter').first()
  // the default 'all' filter is active on load
  await expect(first).toHaveAttribute('aria-pressed', 'true')

  // clicking a different filter moves the pressed state
  const rust = page.locator('.cm-filter', { hasText: /^rust$/ })
  await rust.click()
  await expect(rust).toHaveAttribute('aria-pressed', 'true')
  await expect(first).toHaveAttribute('aria-pressed', 'false')
})
