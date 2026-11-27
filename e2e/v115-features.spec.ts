/**
 * @file e2e/v115-features.spec.ts
 * @description Suíte E2E Playwright para v11.5.0: zero rolagem horizontal na tela Revisão (390x844), Simulados v2 (Modo Prova Real + Redação Cronometrada) e Trilhas Especializadas Inéditas.
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

test.describe('FluentBridge v11.5.0 E2E Suite', () => {
  test('1. VocabReview mobile (390x844) has ZERO horizontal overflow and renders all mode buttons cleanly', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsMasterAdmin(page, true);

    await page.getByTestId('mobile-nav-review').click();
    await expect(page.getByText(/Revisão Inteligente/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByTestId('vocab-mode-cloze')).toBeVisible();
    await expect(page.getByTestId('open-hands-free-btn')).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('2. Simulados v2: Modo Prova Real, Cronômetro de Redação e Evolução Comparativa', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /Simulados/i }).first().click();

    const realExamToggle = page.getByTestId('real-exam-mode-toggle');
    await expect(realExamToggle).toBeVisible({ timeout: 8000 });
    await realExamToggle.click();

    // Iniciar primeiro simulado disponível
    await page.locator('[data-testid^="start-exam-"]').first().click();
    await expect(page.getByTestId('real-exam-active-badge')).toBeVisible({ timeout: 8000 });

    // Ir para aba Writing e verificar cronômetro dedicado de redação
    await page.getByTestId('exam-section-tab-writing').click();
    await expect(page.getByTestId('writing-timer-badge')).toBeVisible();
  });

  test('3. Trilhas Especializadas Inéditas (Negócios, Tech, Saúde, Viagens) abrem unidade no LessonPlayer', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /Trilhas Especializadas/i }).first().click();

    const hub = page.getByTestId('specialized-tracks-hub');
    await expect(hub).toBeVisible({ timeout: 8000 });
    await expect(hub.getByRole('heading', { name: /Negócios & Liderança/i })).toBeVisible();
    await expect(hub.getByRole('tab', { name: /Tecnologia & Engenharia/i })).toBeVisible();

    await hub.getByRole('button', { name: /Estudar Unidade|Revisar Unidade/i }).first().click();
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible({ timeout: 8000 });
  });
});
