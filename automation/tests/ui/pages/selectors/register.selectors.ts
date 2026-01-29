import { expect, type Page } from '@playwright/test';

export const RegisterSelectors = {
    
  url: 'http://localhost:3000/#',
  url_register: 'http://localhost:3000/#/register',

  fields: {
    username: 'input[placeholder="Your Name"]',
    email: 'input[placeholder="Email"]',
    password: 'input[placeholder="Password"]',
  },

  buttons: {
    signUp: 'button:has-text("Sign up")',
  },

  href: {
    signInToYourAccount: 'a:has-text("Sign in to your account")',
    home: 'a:has-text("Home")',
    signIn: 'a:has-text("Sign in")',
    signUp: 'a:has-text("Sign up")',
    thinkster: 'a:has-text("Thinkster")',
  },

} as const;

export async function expectRegisterPageVisible(page: Page) {

  await expect(page.locator(RegisterSelectors.fields.username)).toBeVisible();
  await expect(page.locator(RegisterSelectors.fields.email)).toBeVisible();
  await expect(page.locator(RegisterSelectors.fields.password)).toBeVisible();
  await expect(page.locator(RegisterSelectors.href.signInToYourAccount)).toBeVisible();  
  await expect(page.locator(RegisterSelectors.href.home)).toBeVisible();
  await expect(page.locator(RegisterSelectors.href.signIn)).toBeVisible();
  await expect(page.locator(RegisterSelectors.href.signUp)).toBeVisible();
  await expect(page.locator(RegisterSelectors.href.thinkster)).toBeVisible();
  await expect(page.locator(RegisterSelectors.buttons.signUp)).toBeVisible();

}

export async function expectRegisterPageNotVisible(page: Page) {

    await page.goto(`${RegisterSelectors.url_register}`);  
    await page.locator(RegisterSelectors.fields.username).fill('User');
    await page.locator(RegisterSelectors.fields.email).fill('Users@gmail.com');
    await page.locator(RegisterSelectors.fields.password).fill('123');
    await page.locator(RegisterSelectors.buttons.signUp).click();
    await expect(page.locator(RegisterSelectors.fields.username)).not.toBeVisible();
    await expect(page.locator(RegisterSelectors.fields.email)).not.toBeVisible();
    await expect(page.locator(RegisterSelectors.fields.password)).not.toBeVisible();
  
  }