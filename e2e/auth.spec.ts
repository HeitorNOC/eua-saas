import { test, expect } from '@playwright/test'

// NOTE: These tests assume the app is running at http://localhost:3000
// Start the app with `npm run dev` or `npm start` before running tests.

const base = 'http://localhost:3000'

test.describe('Auth smoke', () => {
  test('can register, login, and logout', async ({ page }) => {
    const unique = Date.now()
    const email = `e2e+${unique}@example.com`
    const password = 'Password123!'

    // Register
    await page.goto(`${base}/register`)
    await page.fill('input[name="firstName"]', 'E2E')
    await page.fill('input[name="lastName"]', 'Tester')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')

    // After register should redirect to dashboard or show no error
    await page.waitForTimeout(800)
    expect(page.url()).toContain('/dashboard')

    // Logout
    await page.goto(`${base}/`)
    await page.click('text=Sair')
    await page.waitForTimeout(500)

    // Login
    await page.goto(`${base}/login`)
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(800)
    expect(page.url()).toContain('/dashboard')
  })
})
