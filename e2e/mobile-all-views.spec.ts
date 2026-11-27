/**
 * @file e2e/mobile-all-views.spec.ts
 * @description Auditoria E2E automatizada de zero rolagem horizontal em resoluções mobile (360x800 e 390x844) nas principais telas do FluentBridge.
 * @exports (Playwright test suite)
 */
import { expect, test, type Page } from '@playwright/test';

async function loginMobile(page: Page) {
  await page.goto('/');
  const continueBtn = page.getByTestId('continue-web-btn');
  if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await continueBtn.click();
  }
  await page.locator('input[type="email"]').fill('silaswf@gmail.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
}

async function assertNoHorizontalOverflow(page: Page, label: string) {
  const diff = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(diff, `Overflow horizontal em ${label}: ${diff}px`).toBeLessThanOrEqual(1);
}

for (const vp of [
  { width: 390, height: 844 },
  { width: 360, height: 800 },
]) {
  test(`Mobile Zero-Overflow Audit (${vp.width}x${vp.height}) across core views`, async ({
    page,
  }) => {
    await page.setViewportSize(vp);
    await loginMobile(page);

    // 1. Trilha de Aulas
    await assertNoHorizontalOverflow(page, `LearningPath (${vp.width})`);

    // 2. Revisão Inteligente
    await page.getByTestId('mobile-nav-review').click();
    await expect(page.getByText(/Revisão Inteligente/i)).toBeVisible({ timeout: 8000 });
    await assertNoHorizontalOverflow(page, `VocabReview (${vp.width})`);

    // 3. Tutor IA
    await page.getByTestId('mobile-nav-tutor').click();
    await expect(page.getByText(/Tutor IA/i).first()).toBeVisible({ timeout: 8000 });
    await assertNoHorizontalOverflow(page, `AITutor (${vp.width})`);

    // 4. Simulados Oficiais v2
    await page.getByTestId('mobile-nav-exams').click();
    await expect(page.getByTestId('real-exam-mode-toggle')).toBeVisible({ timeout: 8000 });
    await assertNoHorizontalOverflow(page, `MockExamHub (${vp.width})`);

    // 5. Trilhas Especializadas
    await page.getByTestId('mobile-nav-learn').click();
    await page.getByTestId('open-specialized-tracks-btn').click();
    await expect(page.getByTestId('specialized-tracks-hub')).toBeVisible({ timeout: 8000 });
    await assertNoHorizontalOverflow(page, `SpecializedTracksHub (${vp.width})`);

    // 6. Menu Mais -> Comunidade, Tradutor, Estúdio Docente e Admin
    const main = page.locator('main');
    const moreBtn = page.getByTestId('mobile-more-trigger');
    const sheet = page.getByTestId('mobile-more-sheet');

    await moreBtn.click();
    await sheet.getByRole('button', { name: /Comunidade/i }).click();
    await expect(main.getByText(/Comunidade|Ligas|Grupos de Estudo/i).first()).toBeVisible({
      timeout: 8000,
    });
    await assertNoHorizontalOverflow(page, `CommunityHub (${vp.width})`);

    await moreBtn.click();
    await sheet.getByRole('button', { name: /Tradutor/i }).click();
    await expect(page.getByTestId('course-translator-view')).toBeVisible({ timeout: 8000 });
    await assertNoHorizontalOverflow(page, `CourseTranslatorView (${vp.width})`);

    await moreBtn.click();
    await sheet.getByRole('button', { name: /Professor|Estúdio/i }).click();
    await expect(main.getByText(/Estúdio|Turmas|Submissões/i).first()).toBeVisible({
      timeout: 8000,
    });
    await assertNoHorizontalOverflow(page, `TeacherStudio (${vp.width})`);

    await moreBtn.click();
    await sheet.getByRole('button', { name: /Admin/i }).click();
    await expect(page.getByTestId('admin-voice-health-panel')).toBeVisible({
      timeout: 8000,
    });
    await assertNoHorizontalOverflow(page, `AdminPanel (${vp.width})`);
  });
}
