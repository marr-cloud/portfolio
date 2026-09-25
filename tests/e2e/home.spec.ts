import { test, expect } from '@playwright/test'

test('home certifications render as themed badges with icons', async ({ page }) => {
  await page.goto('/')
  const certs = page.locator('.cm-cert')
  expect(await certs.count()).toBe(2)
  await expect(page.locator('.cm-cert .cm-cat-icon').first()).toBeVisible()
  await expect(certs.first()).toContainText('SAA-C03')
})
