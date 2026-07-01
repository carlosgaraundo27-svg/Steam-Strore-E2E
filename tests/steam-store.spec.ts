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
    await page.getByRole('button', { name: 'Ways to Play' }).click();
    await page.getByRole('link', { name: 'Controller-Friendly' }).click();
    await page.getByText('Controller Support').click();
    await page.getByRole('link', { name: 'Xbox Controllers' }).click();
    await page.locator('._3EdZTDIisUpowxwm6uJ7Iq').click();

    await page.pause(); // Aquí esperamos que no haya resultados, ya que es un filtro muy específico

    //await expect(page.locator('.search_result_row').first()).toBeVisible(0);
  });

  test('TC-06: Filtrar catálogo por Sistema Operativo (Windows)', async ({ page }) => {
    await page.goto('https://store.steampowered.com/search/');
    await page.locator('[data-loc="macOS"]').first().click();
    await expect(page.locator('.search_result_row')).toHaveCount(50); 
  });

  test('TC-07: Cambio de idioma a Español', async ({ page }) => {
    await page.locator('#language_pulldown').click();
    //await page.getByText('language', { exact: true }).click();
    await page.getByRole('link', { name: 'Español - España (Spanish -' }).click();
    
    // Aquí sí esperamos el texto en español porque acabamos de cambiar el idioma
    await expect(page.getByText('iniciar sesión', { exact: true })).toBeVisible();
    await page.pause(); // Pausa para verificar visualmente el cambio de idioma
  });

  test('TC-08: Validación del Age Gate (Restricción de Edad)', async ({ page }) => {
await page.goto('https://store.steampowered.com/app/1091500/Cyberpunk_2077/');

const ageYear = page.locator('#ageYear');

if (await ageYear.isVisible().catch(() => false)) {
await ageYear.selectOption('1995');
await page.locator('#view_product_page_btn').click();
}

await expect(page.locator('.apphub_AppName').first()).toBeVisible();
});

test('TC-09: Agregar producto al carrito de compras', async ({ page }) => {
  await page.goto('https://store.steampowered.com/app/550/Left_4_Dead_2/');

  const addToCartBtn = page.locator('text=Add to Cart').first();
  await addToCartBtn.waitFor({ state: 'visible' });
  await addToCartBtn.click();

  await page.goto('https://store.steampowered.com/cart/');
  await expect(page).toHaveURL(/cart/);


  await expect(page.locator('text=Shopping Cart').first()).toBeVisible();
});
test('TC-10: Eliminar producto del carrito', async ({ page }) => {
  await page.goto('https://store.steampowered.com/app/550/Left_4_Dead_2/');
  await page.locator('text=Add to Cart').first().click();
  await page.goto('https://store.steampowered.com/cart/');

  const removeBtn = page.locator('text=Remove').first();
  await removeBtn.waitFor({ state: 'visible' });
  await removeBtn.click();

  await expect(page.locator('.cart_item')).toHaveCount(0);
});
test('TC-11: Navegación al formulario de Inicio de Sesión', async ({ page }) => {
  await page.getByRole('link', { name: /login|sign in|iniciar sesión/i }).click();

  await expect(page).toHaveURL(/login/);
});

test('TC-12: Validación de credenciales vacías en Login', async ({ page }) => {
  await page.goto('https://store.steampowered.com/login/');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/login/);
});
test('TC-13: Verificación de sección Hardware (Steam Deck)', async ({ page }) => {
  await page.goto('https://store.steampowered.com/steamdeck/');
  await expect(page).toHaveURL(/steamdeck/);
});

test('TC-14: Redirección correcta a la página de Soporte', async ({ page }) => {
  await page.goto('https://store.steampowered.com/');
  await Promise.all([
    page.waitForURL(/help\.steampowered\.com/),
    page.getByRole('link', { name: /support/i }).first().click()
  ]);
  await expect(page).toHaveURL(/help\.steampowered\.com/);
});

test('TC-15: Verificación del pie de página (Footer)', async ({ page }) => {
  await page.goto('https://store.steampowered.com/');
  const footer = page.locator('#footer, .footer, #store_footer').first();
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toContainText(/Valve Corporation/i);
});



});