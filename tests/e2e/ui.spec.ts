import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return route.continue();
    }
    return route.abort();
  });
  await page.goto('/');
});

for (const width of [320, 360, 768, 1280]) {
  test(`estados e grid sem overflow em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    const selector = page.getByRole('combobox', { name: 'Estado de demonstração' });
    for (const state of ['idle', 'loading', 'empty', 'error', 'success']) {
      await selector.selectOption(state);
      if (state === 'success') {
        await expect(page.getByRole('article')).toHaveCount(5);
        const grid = page.getByRole('list');
        const columns = await grid.evaluate(
          (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
        );
        expect(columns).toBe(width >= 1024 ? 5 : width >= 640 ? 3 : 2);
        await page.getByRole('button', { name: 'Fahrenheit' }).click();
        await expect(page.getByRole('region', { name: 'Clima atual em São Paulo' })).toContainText(
          '77 °F',
        );
      }
      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth > root.clientWidth;
      });
      expect(overflow, `overflow em ${width}px/${state}`).toBe(false);
    }
    const lastCard = page.getByRole('article').last();
    await lastCard.scrollIntoViewIfNeeded();
    await expect(lastCard).toBeInViewport();
  });
}

test('teclado alcança busca, controles e resultado após retry', async ({ page }) => {
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const input = page.getByRole('searchbox', { name: 'Nome da cidade' });
  await input.focus();
  await page.keyboard.type('São Paulo');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const celsius = page.getByRole('button', { name: 'Celsius' });
  await celsius.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Fahrenheit' })).toBeFocused();
  const outline = await page.getByRole('button', { name: 'Fahrenheit' }).evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: style.outlineWidth, style: style.outlineStyle };
  });
  expect(outline.style).not.toBe('none');
  expect(Number.parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('combobox').selectOption('error');
  await page.getByRole('button', { name: 'Tentar novamente' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('botões de ação têm contraste de texto AA normal e hover e alvo de 44px', async ({ page }) => {
  await page.getByRole('searchbox').fill('São Paulo');
  const button = page.getByRole('button', { name: 'Buscar' });
  for (const hover of [false, true]) {
    if (hover) await button.hover();
    const ratio = await button.evaluate((element) => {
      function luminance(color: string) {
        const rgb = color.match(/[\d.]+/g);
        if (!rgb || rgb.length < 3) throw new Error(`Cor não reconhecida: ${color}`);
        const linear = rgb.slice(0, 3).map((value) => {
          const channel = Number(value) / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
      }
      const style = getComputedStyle(element);
      const foreground = luminance(style.color);
      const background = luminance(style.backgroundColor);
      return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
  for (const control of await page.getByRole('button').all()) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  }
});
