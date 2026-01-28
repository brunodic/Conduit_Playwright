import { test, expect } from '@playwright/test';
import { deleteUser } from './db';
import { time } from 'console';


test.describe('Login', () => {
   

  test('should load the login page', async ({ page }) => {
    
    await page.goto('http://localhost:3000');
    await page.click('a.nav-link[href="#/register"]');
    await expect(page).toHaveURL('http://localhost:3000/#/register');
 
    await page.fill('input[placeholder="Your Name"]', 'testuser');
    await page.fill('input[placeholder="Email"]', 'testuser@gmail.com');
    await page.fill('input[placeholder="Password"]', '123');     
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.locator('a.nav-link[href="#/editor"]')).toBeVisible();
    await page.waitForTimeout(2000);

    await deleteUser('testuser@gmail.com');
  });

  
});

