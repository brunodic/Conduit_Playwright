import { test, expect } from '@playwright/test';
import { RegisterSelectors,expectRegisterPageNotVisible,expectRegisterPageVisible, } from './selectors/register.selectors';
import { deleteUser } from '../../../services/db';
import { test as testRegister } from '@playwright/test';

test.describe('Register @ui @smoke @regression @high @risk @businessCritical @critical', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(RegisterSelectors.url_register);
  });

  test('TC-REGISTER-001: Acesso à tela de Registro', async ({ page }) => {
    await expectRegisterPageVisible(page);
  });

  test('TC-REGISTER-002: Registro bem-sucedido', async ({ page }) => {
    await deleteUser('Users@gmail.com');
    await expectRegisterPageNotVisible(page);    
   
  });

  test('TC-REGISTER-003: Registro negativo - email já utilizado', async ({ page }) => {
    




    
  });






});
