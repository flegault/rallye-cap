const { test, expect } = require('@playwright/test');

test('charge l’accueil en UTF-8 sans erreur et conserve les données', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#accueil');
  await expect(page.getByRole('heading', { name: /alignement facile et clair/ })).toBeVisible();
  await expect(page.locator('a[href="#a-propos"]')).toHaveText('À propos');

  await page.getByRole('button', { name: 'Créer une équipe exemple' }).click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await expect(page.locator('#teamHomeTitle')).toHaveValue('Expos de Montréal');
  await expect(page.locator('#teamPlayerCount')).toContainText('10 joueurs');
  await page.reload();
  await expect(page.locator('#teamHomeTitle')).toHaveValue('Expos de Montréal');
  expect(errors).toEqual([]);
});

test('crée réellement une équipe et ajoute ses joueurs', async ({ page }) => {
  await page.goto('/#accueil');
  await page.getByRole('button', { name: 'Créer une équipe', exact: true }).click();
  await page.locator('#newTeamNameInput').fill('Étoiles de Québec');
  await page.getByRole('button', { name: 'Créer', exact: true }).click();
  await page.getByRole('button', { name: 'Ajouter des joueurs' }).click();
  await page.locator('#addPlayersModalNames').fill('Émile, Léa, Noah, Zoé, Félix, Anaïs');
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.locator('#teamPlayerCount')).toContainText('6 joueurs');
  await expect(page.locator('[data-team-rename]')).toHaveCount(6);
});

test('prépare, démarre et fait progresser un match', async ({ page }) => {
  await page.goto('/#accueil');
  await page.getByRole('button', { name: 'Créer une équipe exemple' }).click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await page.getByRole('button', { name: 'Préparer un match' }).click();
  await page.locator('#opp').fill('Aigles de Québec');
  await page.locator('#date').fill('2026-07-04');
  await page.locator('#place').fill('Parc central');
  await page.locator('[data-step="joueurs"]').click();
  await expect(page.locator('#activeCountTag')).toContainText('10 présents');
  await page.locator('#toAlign').click();
  await expect(page.locator('#readyToPlayBtn')).toBeEnabled();
  await page.locator('#readyToPlayBtn').click();
  const warning = page.getByRole('button', { name: 'Confirmer' });
  if (await warning.isVisible()) await warning.click();
  await expect(page).toHaveURL(/#jouer$/);
  await page.locator('#startMatchBtn').click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await expect(page.locator('#topMatchStatus')).toContainText('En cours');
  await page.locator('#advanceHalfBtn').click();
  await expect(page.locator('#advanceHalfBtn')).toContainText('Terminer fin de 1re');
  await page.goto('/#alignement');
  await expect(page.locator('#validations')).toContainText('lecture seule');
  await expect(page.locator('#regenBtn')).toBeHidden();
  await page.reload();
  await expect(page.locator('#topMatchStatus')).toContainText('En cours');
});

test('la navigation mobile garde le workflow utilisable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  await page.goto('/#accueil');
  await page.getByRole('button', { name: 'Créer une équipe exemple' }).click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await page.getByRole('button', { name: 'Préparer un match' }).click();
  await expect(page.locator('#view-match')).toBeVisible();
  await expect(page.locator('.steps')).toBeVisible();
  await page.locator('[data-step="joueurs"]').click();
  await expect(page).toHaveURL(/#joueurs$/);
});
