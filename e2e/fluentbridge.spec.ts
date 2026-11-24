import { expect, test } from '@playwright/test';

async function loginAsMasterAdmin(page: import('@playwright/test').Page) {
  await page.goto('/');
  const continueBtn = page.getByTestId('continue-web-btn');
  if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await continueBtn.click();
  }
  await page.locator('input[type="email"]').fill('silaswf@gmail.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText('Idioma em estudo')).toBeVisible({ timeout: 10000 });
}

test.describe('FluentBridge v5.0.0 E2E Suite', () => {
  test('1. Download Gateway on Web landing shows Windows .exe & Android .apk and continues to Web login', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByTestId('download-windows-link')).toHaveAttribute(
      'href',
      /FluentBridge-Setup-5\.0\.0\.exe/,
    );
    await expect(page.getByTestId('download-android-link')).toHaveAttribute(
      'href',
      /FluentBridge-v5\.0\.0\.apk/,
    );
    await page.getByTestId('continue-web-btn').click();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.getByTestId('auth-download-app-btn').click();
    await expect(page.getByTestId('download-windows-link')).toBeVisible();
  });

  test('2. Login & in-app Download App modal from Sidebar', async ({ page }) => {
    await loginAsMasterAdmin(page);
    await page.getByTestId('sidebar-download-app-btn').click();
    await expect(page.getByTestId('download-windows-link')).toBeVisible();
    await page.getByTestId('continue-web-btn').click();
  });

  test('3. Switch to Arabic (RTL), Dutch, Afrikaans, and Swedish with 100 units each', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);

    await page.getByTitle('Árabe (العربية)').click();
    await expect(page.locator('main')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByText(/Trilha \(100 unid\.\)/i)).toBeVisible();

    await page.getByTitle('Holandês (Nederlands)').click();
    await expect(page.locator('main')).toHaveAttribute('dir', 'ltr');
    await expect(page.getByText(/Trilha \(100 unid\.\)/i)).toBeVisible();

    await page.getByTitle('Africâner (Afrikaans)').click();
    await expect(page.getByText(/Trilha \(100 unid\.\)/i)).toBeVisible();

    await page.getByTitle('Sueco (Svenska)').click();
    await expect(page.getByText(/Trilha \(100 unid\.\)/i)).toBeVisible();
  });

  test('4. Script & Stroke Trainer shows complete alphabets (46 Hiragana, 33 Cyrillic, 28 Arabic)', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);

    await page.getByTitle('Japonês (日本語)').click();
    await page.getByRole('button', { name: /Central & Guia/i }).click();
    await page.getByRole('button', { name: /Escrita & Traços/i }).click();
    await expect(page.getByText(/Hiragana \(46\)/i)).toBeVisible();

    await page.getByTitle('Russo (Русский)').click();
    await expect(page.getByText(/Alfabeto Cirílico Completo \(33 letras\)/i)).toBeVisible();

    await page.getByTitle('Árabe (العربية)').click();
    await expect(page.getByText(/Alfabeto Árabe Completo \(28 letras/i)).toBeVisible();
  });

  test('5. Open and advance lesson without console/React errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /Trilha \(/i }).click();
    await page.getByRole('button', { name: /Começar/i }).first().click();
    await expect(page.getByRole('button', { name: /Continuar|Entendi/i }).first()).toBeVisible({
      timeout: 8000,
    });
    expect(errors).toEqual([]);
  });

  test('6. Timed Official Mock Exam runs timer and grades with official reference table', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /Simulados Oficiais/i }).click();
    await page.getByTestId('start-exam-ielts-sim-1').click();
    await expect(page.getByTestId('exam-timer')).toBeVisible();
    await page.getByTestId('finish-exam-btn').click();
    await expect(page.getByTestId('exam-result-card')).toBeVisible();
    await expect(page.getByText(/Tabela Oficial de Referência/i)).toBeVisible();
  });

  test('7. Community Hub shows per-language Leagues and interactive Forum post creation', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /Comunidade & Ligas/i }).click();
    await expect(page.getByText(/Placar Semanal/i)).toBeVisible();

    await page.getByTestId('community-tab-forum').click();
    await page.getByTestId('community-new-post-btn').click();
    await page.getByTestId('community-post-title').fill('Dúvida E2E sobre Present Perfect');
    await page.getByTestId('community-post-body').fill('Quando devo usar since vs for?');
    await page.getByTestId('community-publish-btn').click();
    await expect(page.getByText('Dúvida E2E sobre Present Perfect')).toBeVisible();
  });
});
