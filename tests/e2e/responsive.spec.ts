import { test, expect } from '@playwright/test'

// Each case pins the element that proves the *real* page rendered, so a 404
// (which has no horizontal overflow) cannot pass the test trivially.
const cases = [
  { path: '/', ready: '.cm-hero' },
  { path: '/proyectos', ready: '.cm-grid' }
]

for (const { path, ready } of cases) {
  test(`no horizontal overflow at 375px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto(path)
    await expect(page.locator(ready).first()).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(1) // allow sub-pixel rounding
  })
}
