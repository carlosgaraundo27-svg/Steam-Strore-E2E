import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E - Tienda Steam', () => {

  test.beforeEach(async ({ page }) => {
    // Navegación principal antes de cada caso
    await page.goto('https://store.steampowered.com/');
  });

 test('TC-01: Búsqueda exitosa de un título específico', async ({ page }) => {
    
 await page.getByRole('combobox', { name: 'Search the store' }).click();
 await page.getByRole('combobox', { name: 'Search the store' }).fill('EA SPORTS FC™ 26');
 await page.getByRole('button', { name: 'Search', exact: true }).press('Enter');
 await expect(page.locator('.title').first()).toContainText('EA SPORTS FC™ 26');
  });

test('TC-02: Búsqueda sin resultados muestra mensaje adecuado', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Search the store' }).click();
    await page.getByRole('combobox', { name: 'Search the store' }).fill('juegoquenoexiste12345');
    await page.getByRole('button', { name: 'Search', exact: true }).press('Enter');
    
    // Verificamos el texto en inglés
    await expect(page.getByText('0 results match your search')).toBeVisible();
  });

  test('TC-03: Despliegue del resultados de la búsqueda', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Search the store' }).click();
    // Escribimos lentamente simulando un humano para detonar el menú AJAX
    await page.getByRole('combobox', { name: 'Search the store' }).pressSequentially('left 4 dead', { delay: 100 });
    await page.getByRole('button', { name: 'Search', exact: true }).press('Enter');
    
    await expect(page.locator('.search_result_row').first()).toBeVisible();
  });

  test('TC-04: Navegación por menú de Categorías hacia Acción', async ({ page }) => {
      await page.getByRole('button', { name: 'Categories' }).click();
      await page.getByRole('link', { name: 'View all tags' }).click();
      await page.getByRole('button', { name: 'Action', exact: true }).click();
      await page.getByRole('link', { name: 'Browse all' }).click();
      await expect(page).toHaveURL(/.*category\/action/);
  });

  test('TC-05: Filtrar catálogo por soporte para mandos', async ({ page }) => {
    await page.goto('https://store.steampowered.com/search/');
    await page.getByText('Controller-Friendly').click();
    await page.locator('[data-loc="PlayStation Controllers"]').click();
    
    await expect(page.locator('.active_tag').first()).toBeVisible();
  });

  test('TC-06: Filtrar catálogo por Sistema Operativo (Windows)', async ({ page }) => {
    await page.goto('https://store.steampowered.com/search/?term=estrategia');
    await page.locator('[data-loc="Windows"]').first().click();
    
    await expect(page.locator('.tab_item_details').first()).toBeVisible();
  });

  test('TC-07: Cambio de idioma a Español', async ({ page }) => {
    await page.locator('#language_pulldown').click();
    await page.getByRole('link', { name: 'Español (España)' }).click();
    
    // Aquí sí esperamos el texto en español porque acabamos de cambiar el idioma
    await expect(page.getByText('iniciar sesión', { exact: false })).toBeVisible();
  });


});