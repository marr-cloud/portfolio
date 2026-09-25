import { test, expect } from '@playwright/test'

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
