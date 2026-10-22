import { expect, test } from '@playwright/test';

test('homepage loads the 3D model and renders without runtime errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  const modelResponsePromise = page.waitForResponse(response =>
    new URL(response.url()).pathname === '/snowboard.glb'
  );

  await page.goto('/');
  await expect(page.locator('.canvas-container canvas')).toBeVisible();
  expect((await modelResponsePromise).ok()).toBeTruthy();

  await page.waitForFunction(() => {
    const canvas = document.querySelector('.canvas-container canvas');
    return canvas && (canvas.getContext('webgl2') || canvas.getContext('webgl'));
  });
  expect(pageErrors).toEqual([]);
});

test('both CV languages point to available PDF files', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'CV', exact: true }).click();

  const cvFrame = page.locator('iframe[title="Damian Filipiak CV"]');
  await expect(cvFrame).toHaveAttribute('src', '/ITEng_Damian_Filipiak.pdf#view=FitH');
  const englishCv = await request.get('/ITEng_Damian_Filipiak.pdf');
  expect(englishCv.ok()).toBeTruthy();
  expect(englishCv.headers()['content-type']).toContain('application/pdf');

  await page.getByRole('button', { name: '[ PL ]' }).click();
  await expect(cvFrame).toHaveAttribute('src', '/InzIT_Damian_Filipiak.pdf#view=FitH');
  const polishCv = await request.get('/InzIT_Damian_Filipiak.pdf');
  expect(polishCv.ok()).toBeTruthy();
  expect(polishCv.headers()['content-type']).toContain('application/pdf');
});
