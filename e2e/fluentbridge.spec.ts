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

test.describe('FluentBridge v8.2.0 E2E Suite', () => {
  test('1. Download Gateway on Web landing shows Windows .exe & Android .apk and continues to Web login', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByTestId('download-windows-link')).toHaveAttribute(
      'href',
      /silaswf\/fluentbridge-releases\/releases\/download\/v9\.0\.0\/FluentBridge-Setup-9\.0\.0\.exe/,
    );
    await expect(page.getByTestId('download-android-link')).toHaveAttribute(
      'href',
      /silaswf\/fluentbridge-releases\/releases\/download\/v9\.0\.0\/FluentBridge-v9\.0\.0\.apk/,
    );
    await page.getByTestId('continue-web-btn').click();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.getByTestId('auth-download-app-btn').click();
    await expect(page.getByTestId('download-windows-link')).toBeVisible();
  });

  test('2. Login, in-app Download App modal & in-app Updater modal from Settings', async ({ page }) => {
    await loginAsMasterAdmin(page);
    await page.getByTestId('open-settings-btn').click();
    await expect(page.getByTestId('settings-modal')).toBeVisible();
    await page.getByTestId('sidebar-update-app-btn').click();
    await expect(page.getByTestId('app-update-modal')).toBeVisible();
    await page.getByLabel('Fechar atualizador').click();

    await page.getByTestId('open-settings-btn').click();
    await page.getByTestId('sidebar-download-app-btn').click();
    await expect(page.getByTestId('download-windows-link')).toBeVisible();
    await page.getByTestId('continue-web-btn').click();
  });

  test('3. Collapsible Language Dropdown switches Arabic (RTL), Dutch, Afrikaans & Swedish with 150 units each', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);

    await selectLanguage(page, 'ar');
    await expect(page.locator('main')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByText(/Trilha.*\(150/i)).toBeVisible();

    await selectLanguage(page, 'nl');
    await expect(page.locator('main')).toHaveAttribute('dir', 'ltr');
    await expect(page.getByText(/Trilha.*\(150/i)).toBeVisible();

    await selectLanguage(page, 'af');
    await expect(page.getByText(/Trilha.*\(150/i)).toBeVisible();

    await selectLanguage(page, 'sv');
    await expect(page.getByText(/Trilha.*\(150/i)).toBeVisible();
  });

  test('4. Dark mode warning box has high contrast and Interactive Short Videos save words to SM-2', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /^Tema/i }).click();
    await page.getByRole('button', { name: /Guias & Gramática|Imersão & Guias|Central & Guia/i }).click();

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
    await page.getByRole('button', { name: /Guias & Gramática|Imersão & Guias|Central & Guia/i }).click();
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
    await page.getByRole('button', { name: /Admin Mestre|Painel Admin/i }).click();
    await expect(page.getByTestId('admin-voice-health-panel')).toBeVisible();
    for (const code of ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh', 'ar', 'nl', 'af', 'sv']) {
      await expect(page.getByTestId(`voice-health-${code}`)).toBeVisible();
    }

    await page.getByRole('button', { name: /Trilha.*\(/i }).click();
    const startBtn6 = page.getByRole('button', { name: /^Começar$/i }).first();
    if (!(await startBtn6.isVisible({ timeout: 2000 }).catch(() => false))) {
      await page.getByTestId('toggle-all-modules-btn').click();
    }
    await startBtn6.click();
    await expect(page.getByText(/Etapa 1 · Vocabulário da Unidade \([1-9]\d+ palavras\)/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole('button', { name: /Desbloquear palavras/i })).toBeVisible();
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

  test('9. v7.0.0 Cloze SM-2, Grammar Drills, Graded Readers, Live Classroom & i18n/a11y controls work', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);

    // Cloze mode in VocabReview
    await page.getByRole('button', { name: /Revisão.*\(/i }).click();
    await page.getByTestId('vocab-mode-cloze').click();
    await expect(page.getByTestId('vocab-mode-cloze')).toBeVisible();

    // Grammar Drills & Graded Readers in TipsLibrary
    await page.getByRole('button', { name: /Guias & Gramática|Imersão & Guias|Central & Guia/i }).click();
    await page.getByTestId('tips-tab-drills').click();
    await expect(page.getByTestId('grammar-drill-lab')).toBeVisible();
    await page.getByTestId('tips-tab-readers').click();
    await expect(page.getByTestId('graded-readers-view')).toBeVisible();

    // Live Classroom
    await page.getByRole('button', { name: /Aulas ao Vivo/i }).click();
    await expect(page.getByTestId('live-classroom-view')).toBeVisible();

    // Accessibility Font Scale & i18n toggle inside SettingsModal
    await page.getByTestId('open-settings-btn').click();
    await expect(page.getByTestId('settings-modal')).toBeVisible();
    await page.getByTestId('font-scale-lg').click();
    await expect(page.locator('html')).toHaveAttribute('data-font-scale', 'lg');
    await page.getByTestId('font-scale-md').click();

    await page.getByTestId('ui-locale-en').click();
    await page.getByTestId('ui-locale-pt').click();
    await page.getByLabel('Fechar').click();
  });

  test('10. v8.0.0 Dark Mode Reading contrast, Japanese Kana toggle, DET Mock Exam & Trail Checkpoint work', async ({
    page,
  }) => {
    await loginAsMasterAdmin(page);
    await page.getByRole('button', { name: /Trilha.*\(/i }).click();

    // 1) Busuu-style Module Header & Trail Checkpoint Modal on LearningPath
    await expect(page.getByTestId('module-header-card').first()).toBeVisible();
    await page.getByTestId('trail-checkpoint-card').first().getByRole('button').click();
    await expect(page.getByTestId('trail-checkpoint-modal')).toBeVisible();
    await page.getByTestId('complete-checkpoint-btn').click();
    await expect(page.getByTestId('trail-checkpoint-modal')).toBeHidden();

    // 2) Dark mode Reading passage contrast
    await selectLanguage(page, 'en');
    await expect(page.getByText(/Inglês · .*150 unidades/i)).toBeVisible({ timeout: 8000 });
    await page.getByRole('button', { name: /^Tema/i }).click();
    const startBtn10 = page.getByRole('button', { name: /^Começar$/i }).first();
    if (!(await startBtn10.isVisible({ timeout: 2000 }).catch(() => false))) {
      await page.getByTestId('toggle-all-modules-btn').click();
    }
    await startBtn10.click();
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible({ timeout: 8000 });
    for (let i = 0; i < 12; i++) {
      if (await page.getByTestId('reading-passage-box').isVisible().catch(() => false)) break;
      const unlockBtn = page.getByRole('button', { name: /Desbloquear palavras/i });
      if (await unlockBtn.isVisible().catch(() => false)) {
        await unlockBtn.click();
        continue;
      }
      const gotItBtn = page.getByRole('button', { name: /Entendi|Got it/i }).first();
      if (await gotItBtn.isVisible().catch(() => false)) {
        await gotItBtn.click();
        continue;
      }
      const verifyBtn = page.getByRole('button', { name: /Verificar resposta|Check/i });
      if (await verifyBtn.isVisible().catch(() => false)) {
        await page
          .locator(
            '.fixed.inset-0.z-50 main .space-y-2\\.5 > button:not([disabled]), .fixed.inset-0.z-50 main .grid.grid-cols-1.gap-2\\.5 > button:not([disabled])',
          )
          .first()
          .click();
        await expect(verifyBtn).toBeEnabled();
        await verifyBtn.click();
        await page.locator('.fixed.inset-0.z-50 footer button').last().click();
      }
    }
    const readingBox = page.getByTestId('reading-passage-box');
    await expect(readingBox).toBeVisible();
    const readingBg = await readingBox.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(readingBg).toBe('rgb(15, 23, 42)');
    await page.getByRole('button', { name: 'Sair da lição' }).click();
    await expect(page.locator('.fixed.inset-0.z-50')).toBeHidden();

    // 3) Japanese script_phonics step & Kana toggle
    await selectLanguage(page, 'ja');
    const jaCard = page.locator('article').filter({ hasText: /Hiragana|Katakana/i }).first();
    await expect(jaCard).toBeVisible({ timeout: 8000 });
    await jaCard.getByRole('button', { name: /Começar|Refazer|Continuar/i }).click();
    await expect(page.getByTestId('ja-kana-toggle')).toBeVisible();
    await page.getByTestId('ja-kana-toggle').click();
    await expect(page.getByTestId('ja-kana-toggle')).toContainText(/Kana/i);
    await page.locator('.fixed.inset-0.z-50 button').filter({ has: page.locator('svg.lucide-x') }).first().click();

    // 4) DET Mock Exam in English
    await selectLanguage(page, 'en');
    await page.getByRole('button', { name: /Simulados Oficiais/i }).click();
    await expect(page.getByRole('heading', { name: 'Duolingo English Test (DET)' })).toBeVisible();
    await page.getByTestId('start-exam-det-sim-1').click();
    await expect(page.getByTestId('exam-timer')).toBeVisible();
  });
});
