import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {

  test('should successfully log in and log out', async ({ page }) => {
    await page.goto('/');

    const logoutButton = page.getByRole('button', { name: 'Logout' });
    if (await logoutButton.isVisible({ timeout: 10000 })) {
      await logoutButton.click();
      await page.waitForURL('/');
    }

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Hasło')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zaloguj' })).toBeVisible();
    await page.getByLabel('Email').fill('test@gmail.com');
    await page.getByLabel('Hasło').fill('aadmin');

    await page.getByRole('button', { name: 'Zaloguj' }).click();
    await page.waitForURL('/dashboard');
    await expect(page.getByText(/Welcome, Test (developer)/)).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForURL('/');
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('should display an error for invalid login credentials', async ({ page }) => {
    await page.goto('/');

    const logoutButton = page.getByRole('button', { name: 'Logout' });
    if (await logoutButton.isVisible({ timeout: 10000 })) {
      await logoutButton.click();
      await page.waitForURL('/');
    }

    await page.getByLabel('Email').fill('nieistniejacy@example.com');
    await page.getByLabel('Hasło').fill('blednehaslo');
    await page.getByRole('button', { name: 'Zaloguj' }).click();

    await expect(page.getByText('Nieprawidłowe dane logowania')).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel('Email')).toBeVisible();
  });

});