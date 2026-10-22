import { expect, test } from '@playwright/test';

test('homepage loads the 3D model and renders without runtime errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  const modelResponsePromise = page.waitForResponse(response =>
    new URL(response.url()).pathname === '/snowboard.glb'
  );

  await page.goto('/');
  await expect(page.locator('h1.title')).toContainText('DAMIAN');
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

test('education details are consistent in the terminal and internal logs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.description')).toHaveText('IT ENGINEER | CYBERSECURITY & NETWORKS');

  await page.getByRole('button', { name: '[ TECH_SPEC ]' }).click();
  const internalLogs = page.locator('.bio-terminal').first();
  await expect(internalLogs).toContainText('MASTER’S STUDIES, FIELD OF STUDY: COMPUTER SCIENCE');
  await expect(internalLogs).toContainText('CLOUD SOLUTIONS OUTSOURCING');
  await expect(internalLogs).toContainText('ENGINEERING STUDIES (BACHELOR’S), FIELD OF STUDY: COMPUTER SCIENCE');
  await expect(internalLogs).toContainText('CYBERSECURITY AND COMPUTER NETWORKS');

  await page.getByRole('button', { name: '[ CLOSE ]' }).click();
  await page.getByRole('button', { name: '[ CONSOLE ]' }).click();
  await page.getByRole('textbox', { name: 'Terminal input' }).fill('education');
  await page.getByRole('textbox', { name: 'Terminal input' }).press('Enter');
  const terminalOutput = page.locator('.term-output');
  await expect(terminalOutput).toContainText('Master’s Studies · Computer Science');
  await expect(terminalOutput).toContainText('Cloud Solutions Outsourcing');
  await expect(terminalOutput).toContainText('Bachelor of Engineering · Computer Science');
  await expect(terminalOutput).toContainText('Cybersecurity & Computer Networks');
});
