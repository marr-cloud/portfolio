import { test, expect } from '@playwright/test'

test('home exposes social share (Open Graph + Twitter) meta tags', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /og-image\.png$/
  )
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://maurrod.dev'
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image'
  )
})
