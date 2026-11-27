/**
 * @file e2e/human-journey.spec.ts
 * @description Jornadas humanas E2E (Desktop, Polyglot/LGPD, Mobile 390x844 + Admin Health/Quotas, WCAG AA Contrast e Jornada 5 v9.x).
 */
import { expect, test } from '@playwright/test';

async function attachErrorGuards(page: import('@playwright/test').Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      // Ignore network 404/CORS in offline/local preview for external GitHub/Worker if any
      if (!txt.includes('api.github.com') && !txt.includes('Failed to load resource')) {
        errors.push(`console.error: ${txt}`);
      }
    }
  });
  return errors;
}

async function loginAsHumanStudent(
  page: import('@playwright/test').Page,
  isMobile = false,
) {
  await page.goto('/');
  const continueBtn = page.getByTestId('continue-web-btn');
  if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await continueBtn.click();
  }
  await page.locator('input[type="email"]').fill('silaswf@gmail.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();
  if (isMobile) {
    await expect(page.getByLabel('Selecionar idioma')).toBeVisible({ timeout: 10000 });
  } else {
    await expect(page.getByText('Idioma em estudo')).toBeVisible({ timeout: 10000 });
  }
}

test.describe('Human Simulation Journeys (v8.2.0)', () => {
  test('Human Journey 1 (Desktop): Collapsible modules, regional accents, ambient noise, Reading & Writing Diff', async ({
    page,
  }) => {
    const errors = await attachErrorGuards(page);
    await loginAsHumanStudent(page);

    await page.getByTestId('language-switcher-trigger').click();
    await page.getByTestId('lang-option-en').click();
    await page.getByRole('button', { name: /Trilha.*\(/i }).click();

    // Verify collapsible module accordions: only 1 module expanded by default
    const headers = page.getByTestId('module-header-card');
    expect(await headers.count()).toBeGreaterThan(1);
    await expect(headers.first()).toHaveAttribute('aria-expanded', 'true');
    await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'false');

    // Human expands second module, then collapses it back
    await headers.nth(1).click();
    await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'true');
    await headers.nth(1).click();
    await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'false');

    // Open Unit 1 (always has Vocab -> Listening -> Reading -> Matching -> WritingFree)
    const unit1Card = page
      .locator('article')
      .filter({ hasText: /Cumprimentos e Primeiras Impressões/i })
      .first();
    await unit1Card.getByRole('button', { name: /Começar|Continuar|Refazer/i }).click();
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible({ timeout: 8000 });
    const vocabPill = page
      .locator('.fixed.inset-0.z-50 button')
      .filter({ hasText: /^Vocabulário$/i })
      .first();
    if (await vocabPill.isVisible().catch(() => false)) {
      await vocabPill.click();
    }

    // Adaptive difficulty badge visible
    await expect(page.getByTestId('adaptive-difficulty-badge')).toBeVisible();

    let sawListening = false;
    let sawReading = false;
    let sawWritingDiff = false;

    for (let step = 0; step < 22; step++) {
      // 0) If hearts ran out, activate Relaxed Mode like a human
      const relaxedBtn = page.getByRole('button', { name: /Ativar Modo Sem Pressão/i });
      if (await relaxedBtn.isVisible().catch(() => false)) {
        await relaxedBtn.click();
        continue;
      }

      // 1) Vocab Intro
      const unlockBtn = page.getByRole('button', { name: /Desbloquear palavras/i });
      if (await unlockBtn.isVisible().catch(() => false)) {
        await unlockBtn.click();
        continue;
      }

      // 2) Tip
      const gotItBtn = page.getByRole('button', { name: /Entendi|Got it/i }).first();
      if (await gotItBtn.isVisible().catch(() => false)) {
        await gotItBtn.click();
        continue;
      }

      // 3) Listening: test +N sotaques popover & ambient noise preset
      const ambientSelector = page.getByTestId('ambient-noise-selector');
      if (!sawListening && (await ambientSelector.isVisible().catch(() => false))) {
        sawListening = true;
        await page.getByTestId('ambient-preset-cafe').click();
        await page.getByTestId('ambient-preset-clean').click();

        const moreAccentsBtn = page.getByTestId('more-accents-trigger').first();
        if (await moreAccentsBtn.isVisible().catch(() => false)) {
          await moreAccentsBtn.click();
          await expect(page.getByTestId('more-accents-menu')).toBeVisible();
          await page.getByTestId('accent-option-en-AU').click();
        }
      }

      // 4) Reading: click a glossary chip if present
      const readingBox = page.getByTestId('reading-passage-box');
      if (!sawReading && (await readingBox.isVisible().catch(() => false))) {
        sawReading = true;
        const firstGloss = readingBox.locator('.reading-gloss-chip').first();
        if (await firstGloss.isVisible().catch(() => false)) {
          await firstGloss.click();
        }
      }

      // 5) Writing Free: type human text and run Grammar & Diff analysis
      const diffBtn = page.getByTestId('analyze-writing-diff-btn');
      if (await diffBtn.isVisible().catch(() => false)) {
        const textarea = page.locator('.fixed.inset-0.z-50 textarea').first();
        await textarea.fill('hello i work in london and study english every day');
        await diffBtn.click();
        await expect(page.getByTestId('writing-diff-panel')).toBeVisible({ timeout: 15000 });
        sawWritingDiff = true;
        break;
      }

      // 5b) Dictation step (has textarea without diffBtn)
      const dictationTextarea = page.locator('.fixed.inset-0.z-50 textarea').first();
      if (await dictationTextarea.isVisible().catch(() => false)) {
        await dictationTextarea.fill('hello');
        const checkDictBtn = page.getByRole('button', { name: /Verificar resposta|Check/i });
        if (await checkDictBtn.isEnabled().catch(() => false)) {
          await checkDictBtn.click();
          await page.locator('.fixed.inset-0.z-50 footer button').last().click();
          continue;
        }
      }

      // 6) Matching pairs: solve like a human
      const matchingHint = page.getByText(/Toque em uma expressão à esquerda/i);
      if (await matchingHint.isVisible().catch(() => false)) {
        const leftLabels = page.getByTestId('matching-target-label');
        const leftCards = page.getByTestId('matching-target-item');
        const rightBtns = page.getByTestId('matching-pt-item');
        const totalPairs = await leftCards.count();
        for (let li = 0; li < totalPairs; li++) {
          if ((await leftCards.nth(li).getAttribute('tabindex')) === '-1') continue;
          for (let ri = 0; ri < (await rightBtns.count()); ri++) {
            const relaxedBtn = page.getByRole('button', { name: /Ativar Modo Sem Pressão/i });
            if (await relaxedBtn.isVisible().catch(() => false)) {
              await relaxedBtn.click();
            }
            const right = rightBtns.nth(ri);
            if (await right.isDisabled().catch(() => false)) continue;
            await leftLabels.nth(li).click();
            await right.click();
            await page.waitForTimeout(50);
            if ((await leftCards.nth(li).getAttribute('tabindex')) === '-1') break;
          }
        }
        const nextAfterMatch = page.locator('.fixed.inset-0.z-50 footer button').last();
        if (await nextAfterMatch.isEnabled().catch(() => false)) {
          await nextAfterMatch.click();
          continue;
        }
      }

      // 7) Writing Builder: pick word bank buttons & verify
      const builderHint = page.getByText(/Clique nas palavras abaixo na ordem correta/i);
      if (await builderHint.isVisible().catch(() => false)) {
        const bankBtns = page.locator('.fixed.inset-0.z-50 .mt-5.flex.flex-wrap button');
        for (let bi = 0; bi < (await bankBtns.count()); bi++) {
          const b = bankBtns.nth(bi);
          if (!(await b.isDisabled().catch(() => false))) {
            await b.click();
          }
        }
        const checkBuilder = page.getByRole('button', { name: /Verificar resposta|Check/i });
        if (await checkBuilder.isEnabled().catch(() => false)) {
          await checkBuilder.click();
          await page.locator('.fixed.inset-0.z-50 footer button').last().click();
          continue;
        }
      }

      // 8) Multiple choice (Listening, Reading, FillBlank, Story)
      const verifyBtn = page.getByRole('button', { name: /Verificar resposta|Check/i });
      if (await verifyBtn.isVisible().catch(() => false)) {
        const mcOpt = page
          .locator(
            '.fixed.inset-0.z-50 main .space-y-2\\.5 > button:not([disabled]), .fixed.inset-0.z-50 main .space-y-2 > button:not([disabled]), .fixed.inset-0.z-50 main .grid.grid-cols-1.gap-2\\.5 > button:not([disabled])',
          )
          .first();
        if (await mcOpt.isVisible().catch(() => false)) {
          await mcOpt.click();
          await expect(verifyBtn).toBeEnabled();
          await verifyBtn.click();
          await page.locator('.fixed.inset-0.z-50 footer button').last().click();
          continue;
        }
      }

      // 9) Speaking: use no-mic practice button
      const noMicBtn = page.getByRole('button', { name: /Pratiquei em voz alta/i });
      if (await noMicBtn.isVisible().catch(() => false)) {
        await noMicBtn.click();
        await page.locator('.fixed.inset-0.z-50 footer button').last().click();
        continue;
      }

      // Fallback advance if footer continue is active
      const footerBtn = page.locator('.fixed.inset-0.z-50 footer button').last();
      if (await footerBtn.isEnabled().catch(() => false)) {
        await footerBtn.click();
      } else {
        break;
      }
    }

    expect(sawListening).toBe(true);
    expect(sawReading).toBe(true);
    expect(sawWritingDiff).toBe(true);
    await expect(page.getByText(/Ops! Algo saiu do esperado/i)).toBeHidden();
    expect(errors).toEqual([]);
  });

  test('Human Journey 2 (Polyglot + LGPD): Arabic RTL, Japanese script_phonics/Kana & LGPD JSON Export', async ({
    page,
  }) => {
    const errors = await attachErrorGuards(page);
    await loginAsHumanStudent(page);

    // Switch to Arabic (RTL)
    await page.getByTestId('language-switcher-trigger').click();
    await page.getByTestId('lang-option-ar').click();
    await expect(page.locator('main')).toHaveAttribute('dir', 'rtl');

    // Switch to Japanese and verify Kana toggle
    await page.getByTestId('language-switcher-trigger').click();
    await page.getByTestId('lang-option-ja').click();
    await expect(page.locator('main')).toHaveAttribute('dir', 'ltr');
    await page.getByRole('button', { name: /Trilha.*\(/i }).click();
    await page.getByRole('button', { name: /Começar|Continuar|Refazer/i }).first().click();
    await expect(page.getByTestId('ja-kana-toggle')).toBeVisible({ timeout: 8000 });
    await page.getByTestId('ja-kana-toggle').click();
    await expect(page.getByTestId('ja-kana-toggle')).toContainText(/Kana/i);
    await page.locator('.fixed.inset-0.z-50 button').filter({ has: page.locator('svg.lucide-x') }).first().click();

    // LGPD Privacy modal & JSON export (via SettingsModal)
    await page.getByTestId('open-settings-btn').click();
    await page.getByTestId('sidebar-privacy-lgpd-btn').click();
    await expect(page.getByTestId('privacy-lgpd-modal')).toBeVisible();
    await page.getByTestId('lgpd-export-btn').click();
    await expect(page.getByTestId('lgpd-export-success')).toBeVisible();
    await page.getByLabel('Fechar Privacidade e LGPD').click();

    await expect(page.getByText(/Ops! Algo saiu do esperado/i)).toBeHidden();
    expect(errors).toEqual([]);
  });

  test('Human Journey 3 (Mobile 390x844 & Admin Health Check): No horizontal overflow, Dark Mode contrast, Single CEFR filter & Live Health Check', async ({
    page,
  }) => {
    const errors = await attachErrorGuards(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsHumanStudent(page, true);

    // Navigate to Trilha on mobile bottom nav + verify Revisão is pinned in bottom bar
    await expect(page.getByTestId('mobile-nav-review')).toBeVisible();
    await page.getByTestId('mobile-nav-learn').click();

    // Verify single CEFR filter bar (U-02)
    await expect(page.getByTestId('cefr-filter-bar')).toHaveCount(1);

    // Check no horizontal overflow on mobile viewport
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(4);

    // Open mobile "Mais" sheet and verify no horizontal overflow
    await page.getByTestId('mobile-more-trigger').click();
    await expect(page.getByTestId('mobile-more-sheet')).toBeVisible();
    const sheetOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(sheetOverflow).toBeLessThanOrEqual(4);
    await page.getByTestId('mobile-more-sheet').locator('button').first().click();

    // Collapsible module card visible on mobile + LessonPlayer mobile settings gear (U-04)
    await expect(page.getByTestId('module-header-card').first()).toBeVisible();
    await page.getByRole('button', { name: /Começar|Continuar|Refazer/i }).first().click();
    await expect(page.getByTestId('lesson-mobile-settings-btn')).toBeVisible();
    await page.getByLabel('Sair da lição').click();

    // Verify Dark Mode contrast guard on main trail text + sticky CEFR header & current module card
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(250);
    const bodyBg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(bodyBg).not.toBe('rgb(255, 255, 255)');
    const darkSurfaceCheck = await page.evaluate(() => {
      const toRgb = (cssColor: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (!ctx) return [255, 255, 255];
        ctx.fillStyle = '#0B1120';
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillStyle = cssColor;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2]];
      };
      const stickyBar = document
        .querySelector('[data-testid="cefr-filter-bar"]')
        ?.closest('.sticky') as HTMLElement | null;
      const modCard = document.querySelector(
        '[data-testid="module-header-card"]',
      ) as HTMLElement | null;
      const stickyRgb = stickyBar
        ? toRgb(getComputedStyle(stickyBar).backgroundColor)
        : [0, 0, 0];
      const modRgb = modCard
        ? toRgb(getComputedStyle(modCard).backgroundColor)
        : [0, 0, 0];
      return { stickyRgb, modRgb };
    });
    expect(darkSurfaceCheck.stickyRgb[0]).toBeLessThan(40);
    expect(darkSurfaceCheck.stickyRgb[1]).toBeLessThan(50);
    expect(darkSurfaceCheck.stickyRgb[2]).toBeLessThan(80);
    expect(darkSurfaceCheck.modRgb[0]).toBeLessThan(40);
    expect(darkSurfaceCheck.modRgb[1]).toBeLessThan(50);
    expect(darkSurfaceCheck.modRgb[2]).toBeLessThan(80);
    await page.evaluate(() => document.documentElement.classList.remove('dark'));

    // Open Admin Panel via desktop/wide nav and run live Health Check + verify Quotas Panel
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole('button', { name: /Admin Mestre|Painel Admin/i }).click();
    await expect(page.getByTestId('admin-quotas-panel')).toBeVisible();
    await page.getByTestId('admin-run-healthcheck-btn').click();
    await expect(page.getByTestId('admin-healthcheck-results')).toBeVisible({ timeout: 15000 });

    await expect(page.getByText(/Ops! Algo saiu do esperado/i)).toBeHidden();
    expect(errors).toEqual([]);
  });

  test('Human Journey 4 (v8.4.0 Features & WCAG AA Contrast): Imersão, Hands-Free, Community, Teacher Display Name & Contrast', async ({
    page,
  }) => {
    const errors = await attachErrorGuards(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAsHumanStudent(page);
    await page.getByRole('button', { name: /Trilha de Aulas/i }).click();

    // 1. Dedicated Imersão view
    await page.getByRole('button', { name: /Imersão \(Áudio & Vídeo\)/i }).click();
    await expect(page.getByText(/Podcasts & Imersão|Episódio/i).first()).toBeVisible({ timeout: 8000 });

    // 2. Hands-Free mode in Revisão & Vocab
    await page.getByRole('button', { name: /Revisão & Vocab/i }).click();
    await page.getByTestId('open-hands-free-btn').click();
    await expect(page.getByTestId('hands-free-modal')).toBeVisible();
    await page.getByTestId('close-hands-free-btn').click();

    // 3. Community: Desafio do Mês + moderation + emoji reaction
    await page.getByRole('button', { name: /Comunidade & Ligas/i }).click();
    await expect(page.getByTestId('monthly-challenge-card')).toBeVisible();
    await page.getByTestId('community-tab-forum').click();
    await page.getByTestId('reaction-btn-🔥').first().click();
    await page.getByTestId('community-new-post-btn').click();
    await page.getByTestId('community-post-title').fill('Teste moderação');
    await page.getByTestId('community-post-body').fill('Veja https://spam.example.com');
    await page.getByTestId('community-publish-btn').click();
    await expect(page.getByTestId('community-moderation-error')).toBeVisible();

    // 4. Teacher Display Name propagation (TeacherStudio -> AdminPanel)
    await page.getByRole('button', { name: /Estúdio do Professor/i }).click();
    await page.getByRole('button', { name: /Nuvem, IA & Escola/i }).click();
    await page.getByTestId('teacher-display-name-input').fill('Silas Wagner');
    await page.getByTestId('save-teacher-settings-btn').click();
    await page.getByRole('button', { name: /Admin Mestre|Painel Admin/i }).click();
    await expect(page.locator('select').filter({ hasText: 'Sem professor' }).first()).toContainText(/Prof\. Silas Wagner/);

    // 5. WCAG AA Contrast Check in Light & Dark modes on main headings
    const checkContrast = async () =>
      page.evaluate(() => {
        const parseRgb = (str: string) => {
          const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 0];
        };
        const luminance = ([r, g, b]: number[]) => {
          const a = [r, g, b].map((v) => {
            const c = v / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
        };
        const h1 = document.querySelector('main h1') as HTMLElement | null;
        if (!h1) return 21;
        const fg = parseRgb(getComputedStyle(h1).color);
        const bg = parseRgb(getComputedStyle(document.body).backgroundColor);
        const l1 = luminance(fg);
        const l2 = luminance(bg);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      });

    expect(await checkContrast()).toBeGreaterThanOrEqual(4.5);
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(250);
    expect(await checkContrast()).toBeGreaterThanOrEqual(4.5);
    await page.evaluate(() => document.documentElement.classList.remove('dark'));

    await expect(page.getByText(/Ops! Algo saiu do esperado/i)).toBeHidden();
    expect(errors).toEqual([]);
  });

  test('Human Journey 5 (v9.2.0: 17 Languages, PT PLE 150 units, TR/HE RTL/NB/DA & YouTube + Translator)', async ({
    page,
  }) => {
    const errors = await attachErrorGuards(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAsHumanStudent(page);
    await page.getByRole('button', { name: /Trilha de Aulas/i }).click();

    // 1. Verify Turkish, Hebrew (RTL), Norwegian, Danish & Portuguese (PLE) with 150 units each
    for (const [code, expectRtl] of [
      ['tr', false],
      ['he', true],
      ['nb', false],
      ['da', false],
      ['pt', false],
    ] as const) {
      await page.getByTestId('language-switcher-trigger').click();
      await page.getByTestId(`lang-option-${code}`).click();
      await expect(page.locator('main')).toHaveAttribute('dir', expectRtl ? 'rtl' : 'ltr');
      await expect(page.getByText(/\(150 unidades\)/i)).toBeVisible({ timeout: 10000 });
    }
    await expect(page.getByTestId('pt-course-en-ui-banner')).toBeVisible();

    // 1b. Verify Bidirectional Course Translator (with Portuguese selected -> EN <-> PT)
    await page.getByRole('button', { name: /Tradutor/i }).click();
    await expect(page.getByTestId('course-translator-view')).toBeVisible();
    await page.getByTestId('translator-input').fill('Bom dia');
    await page.getByTestId('translator-submit-btn').click();
    await expect(page.getByTestId('translator-output')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('translator-swap-btn').click();

    // 2. YouTube Study Lab inside Imersão -> Vídeos
    await page.getByRole('button', { name: /Imersão \(Áudio & Vídeo\)/i }).click();
    await page.getByRole('button', { name: /Vídeos/i }).click();
    await page.getByTestId('tab-youtube-study').click();
    await expect(page.getByTestId('youtube-study-lab')).toBeVisible();
    await page.getByRole('button', { name: /^Carregar /i }).click();
    await page.getByTestId('yt-analyze-btn').click();
    await expect(page.getByTestId('yt-subtitle-word').first()).toBeVisible({ timeout: 15000 });
    await page.getByTestId('yt-subtitle-word').first().click();
    await expect(page.getByTestId('yt-word-popover')).toBeVisible();
    await page.getByTestId('yt-save-sm2-btn').click();
    await expect(page.getByTestId('yt-save-sm2-btn')).toContainText(/Salva no Deck SM-2/i);
    await page.getByTestId('yt-tab-grammar').click();
    await expect(page.getByTestId('yt-grammar-panel')).toBeVisible();

    await expect(page.getByText(/Ops! Algo saiu do esperado/i)).toBeHidden();
    expect(errors).toEqual([]);
  });
});
