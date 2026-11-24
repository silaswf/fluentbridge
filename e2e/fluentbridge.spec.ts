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

async function selectLanguage(
  page: import('@playwright/test').Page,
  code: string,
) {
  await page.getByTestId('language-switcher-trigger').click();
  await page.getByTestId(`lang-option-${code}`).click();
}

test.describe('FluentBridge v6.1.0 E2E Suite', () => {
  test('1. Download Gateway on Web landing shows Windows .exe & Android .apk and continues to Web login', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByTestId('download-windows-link')).toHaveAttribute(
      'href',
      /FluentBridge-Setup-6\.1\.0\.exe/,
    );
    await expect(page.getByTestId('download-android-link')).toHaveAttribute(
      'href',
      /FluentBridge-v6\.1\.0\.apk/,
    );
    await page.getByTestId('continue-web-btn').click();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.getByTestId('auth-download-app-btn').click();
    await expect(page.getByTestId('download-windows-link')).toBeVisible();
  });

  test('2. Login, in-app Download App modal & in-app Updater modal from Sidebar', async ({ page }) => {
    await loginAsMasterAdmin(page);
    await page.getByTestId('sidebar-update-app-btn').click();
    await expect(page.getByTestId('app-update-modal')).toBeVisible();
    await page.getByLabel('Fechar atualizador').click();

    await page.getByTestId('sidebar-download-app-btn').click();
    await expect(page.getByTestId('download-windows-link')).toBeVisible();
    await page.getByTestId('continue-web-btn').click();
  });

  test('3. Collapsible Language Dropdown switches Arabic (RTL), Dutch, Afrikaans & Swedish with 103 units each', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);

    await selectLanguage(page, 'ar');
    await expect(page.locator('main')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByText(/Trilha \(103 unid\.\)/i)).toBeVisible();

    await selectLanguage(page, 'nl');
    await expect(page.locator('main')).toHaveAttribute('dir', 'ltr');
    await expect(page.getByText(/Trilha \(103 unid\.\)/i)).toBeVisible();

    await selectLanguage(page, 'af');
    await expect(page.getByText(/Trilha \(103 unid\.\)/i)).toBeVisible();

    await selectLanguage(page, 'sv');
    await expect(page.getByText(/Trilha \(103 unid\.\)/i)).toBeVisible();
  });

  test('4. Dark mode warning box has high contrast and Interactive Short Videos save words to SM-2', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /Tema da interface/i }).click();
    await page.getByRole('button', { name: /Central & Guia/i }).click();

    const warningBox = page.getByTestId('tip-warning-box').first();
    await expect(warningBox).toBeVisible();
    const bgColor = await warningBox.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgColor).not.toBe('rgb(255, 241, 242)');

    await page.getByTestId('tips-tab-videos').click();
    await page.getByTestId('subtitle-word-btn').first().click();
    await expect(page.getByTestId('video-word-popover')).toBeVisible();
    await page.getByTestId('video-save-sm2-btn').click();
    await expect(page.getByTestId('video-save-sm2-btn')).toContainText(/No seu Deck SM-2/i);
  });

  test('5. Script & Stroke Trainer shows complete alphabets via dropdown switcher', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);

    await selectLanguage(page, 'ja');
    await page.getByRole('button', { name: /Central & Guia/i }).click();
    await page.getByRole('button', { name: /Escrita & Traços/i }).click();
    await expect(page.getByText(/Hiragana \(46\)/i)).toBeVisible();

    await selectLanguage(page, 'ru');
    await expect(page.getByText(/Alfabeto Cirílico Completo \(33 letras\)/i)).toBeVisible();

    await selectLanguage(page, 'ar');
    await expect(page.getByText(/Alfabeto Árabe Completo \(28 letras/i)).toBeVisible();
  });

  test('6. LessonPlayer opens without console/React errors and Admin Panel shows all 12 Neural Voices', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /Painel Admin/i }).click();
    await expect(page.getByTestId('admin-voice-health-panel')).toBeVisible();
    for (const code of ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh', 'ar', 'nl', 'af', 'sv']) {
      await expect(page.getByTestId(`voice-health-${code}`)).toBeVisible();
    }

    await page.getByRole('button', { name: /Trilha \(/i }).click();
    await page.getByRole('button', { name: /Começar/i }).first().click();
    await expect(page.getByRole('button', { name: /Continuar|Entendi|Desbloquear/i }).first()).toBeVisible({
      timeout: 8000,
    });
    expect(errors).toEqual([]);
  });

  test('7. CELPIP & IELTS Mock Exams support Category Filter, Speaking Tab & Analytical Writing Rubric', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);
    await selectLanguage(page, 'en');
    await page.getByRole('button', { name: /Simulados Oficiais/i }).click();
    await expect(page.getByRole('heading', { name: 'CELPIP General (Canadá / IRCC)' })).toBeVisible();

    await page.getByTestId('exam-category-full').click();
    await page.getByTestId('start-exam-celpip-sim-1').click();
    await expect(page.getByTestId('exam-timer')).toBeVisible();

    await page.getByTestId('exam-section-tab-speaking').click();
    await expect(page.getByTestId('exam-speaking-section')).toBeVisible();

    await page.getByTestId('finish-exam-btn').first().click();
    await expect(page.getByTestId('exam-result-card')).toBeVisible();
    await expect(page.getByTestId('writing-analytical-rubric')).toBeVisible();
    await expect(page.getByText(/Tabela Oficial de Referência/i)).toBeVisible();
  });

  test('8. Community Hub shows per-language Leagues and interactive Forum post creation', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /Comunidade & Ligas/i }).click();
    await expect(page.getByText(/Placar Semanal/i)).toBeVisible();

    await page.getByTestId('community-tab-forum').click();
    await page.getByTestId('community-new-post-btn').click();
    await page.getByTestId('community-post-title').fill('Dúvida E2E sobre Idioms');
    await page.getByTestId('community-post-body').fill('Como usar piece of cake?');
    await page.getByTestId('community-publish-btn').click();
    await expect(page.getByText('Dúvida E2E sobre Idioms')).toBeVisible();
  });
});
