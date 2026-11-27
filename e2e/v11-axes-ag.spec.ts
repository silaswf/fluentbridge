/**
 * @file e2e/v11-axes-ag.spec.ts
 * @description Suíte E2E Playwright para os Eixos A–G (v11): Multi-tenancy B2B, Revisão Expressa, Ilustrações Visuais Duolingo, Seletor de Velocidade de Áudio e Acessibilidade/Mobile.
 * @exports (Playwright test suite)
 */
import { expect, test, type Page } from '@playwright/test';

async function loginAsMasterAdmin(page: Page, isMobile = false) {
  await page.goto('/');
  const continueBtn = page.getByTestId('continue-web-btn');
  if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await continueBtn.click();
  }
  await page.locator('input[type="email"]').fill('silaswf@gmail.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();
  if (isMobile) {
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  } else {
    await expect(page.getByText('Idioma em estudo')).toBeVisible({ timeout: 10000 });
  }
}

test.describe('FluentBridge v11 Eixos A–G E2E Suite', () => {
  test('1. Multi-tenant isolation & B2B tools: criar Escola Alpha, abrir QR modal e filtrar por escola', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);

    // Abrir Painel Admin
    await page.getByRole('button', { name: /Admin/i }).first().click();
    const schoolsPanel = page.getByTestId('admin-schools-panel');
    await expect(schoolsPanel).toBeVisible({ timeout: 8000 });

    // Criar "Escola Alpha"
    const schoolNameInput = schoolsPanel.locator(
      'input[placeholder*="Nome da nova escola"]',
    );
    await schoolNameInput.fill('Escola Alpha');
    await schoolsPanel.getByRole('button', { name: /\+ Nova Escola/i }).click();
    await expect(schoolsPanel.locator('p', { hasText: 'Escola Alpha' }).first()).toBeVisible();

    // Abrir QR modal da escola
    const qrTrigger = schoolsPanel
      .locator('[data-testid^="school-qr-btn"], button[title*="QR"], button:has-text("QR")')
      .first();
    await qrTrigger.click();
    const qrModal = page.getByTestId('school-qr-modal');
    await expect(qrModal).toBeVisible();
    await qrModal.getByRole('button', { name: /Fechar/i }).first().click();

    // Filtrar painel por "Escola Alpha"
    const schoolFilterSelect = schoolsPanel.getByLabel('Filtrar painel por escola');
    const alphaOption = await schoolFilterSelect
      .locator('option', { hasText: 'Escola Alpha' })
      .first()
      .getAttribute('value');
    expect(alphaOption).toBeTruthy();
    await schoolFilterSelect.selectOption(alphaOption!);
    await expect(schoolFilterSelect).toHaveValue(alphaOption!);
  });

  test('2. Express Review, Visual Duolingo illustrations & audio speed selector', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);

    // Ir para a Trilha de Aprendizado
    await page.getByRole('button', { name: /Trilha/i }).first().click();

    // Revisão Expressa (modal)
    const expressBtn = page.getByTestId('express-review-btn');
    await expect(expressBtn).toBeVisible();
    await expressBtn.click();
    const expressModal = page.getByTestId('express-review-modal');
    await expect(expressModal).toBeVisible();
    await expressModal.getByRole('button', { name: /Fechar/i }).first().click();

    // Abrir primeira lição para verificar ilustrações visuais no VocabIntroStep e seletor de velocidade
    await page.getByRole('button', { name: /Começar|Continuar|Refazer/i }).first().click();

    const vocabImages = page.locator('.fixed.inset-0.z-50 img');
    await expect(vocabImages.first()).toBeVisible({ timeout: 8000 });
    const imgCount = await vocabImages.count();
    expect(imgCount).toBeGreaterThan(0);
    await expect
      .poll(
        async () =>
          vocabImages
            .first()
            .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
        { timeout: 8000 },
      )
      .toBe(true);

    // Avançar até encontrar o seletor de velocidade (audio-speed-cycle) em Listening / PictureChoice / Reading
    const speedBtn = page.getByTestId('audio-speed-cycle').first();
    for (let stepIdx = 0; stepIdx < 6; stepIdx += 1) {
      if (await speedBtn.isVisible().catch(() => false)) break;
      const picStep = page.getByTestId('picture-choice-step');
      if (await picStep.isVisible().catch(() => false)) {
        await picStep.locator('.grid button').first().click();
      }
      const nextBtn = page
        .locator('.fixed.inset-0.z-50')
        .getByRole('button', { name: /Desbloquear|Avançar|Continuar|Entendi|Got it|Next/i })
        .last();
      if (await nextBtn.isVisible().catch(() => false)) {
        await nextBtn.click();
      }
    }
    await expect(speedBtn).toBeVisible({ timeout: 5000 });
    const beforeLabel = (await speedBtn.innerText()).trim();
    await speedBtn.click();
    const afterLabel = (await speedBtn.innerText()).trim();
    expect(afterLabel).not.toBe(beforeLabel);
  });

  test('3. Accessibility sanity: <main>, skip link and zero horizontal overflow on 390x844', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsMasterAdmin(page, true);

    await expect(page.locator('main')).toBeVisible();
    const skipLink = page.locator('a[href^="#main"], a:has-text("Pular para")').first();
    await expect(skipLink).toHaveCount(1);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
