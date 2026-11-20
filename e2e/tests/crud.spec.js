import { test, expect } from "@playwright/test";

// =========================================================
// TEST FULL STACK: usa la web como lo haría una persona.
// Cada acción en el formulario viaja por fetch a la API,
// que la guarda en MongoDB. Recargar la página demuestra
// que los datos vienen de la base de datos y no del navegador.
// =========================================================

// Nombre único, para no confundirlo con tus productos reales
const productName = "Producto E2E " + Date.now();

// Al terminar (aunque el test falle), borramos por la API
// cualquier producto que haya creado este test
test.afterEach(async ({ request }) => {
  const response = await request.get("http://localhost:3000/products");
  const products = await response.json();
  for (const product of products) {
    if (product.name.startsWith("Producto E2E")) {
      await request.delete("http://localhost:3000/products/" + product.id);
    }
  }
});

test("crear, editar, recargar y borrar un producto desde la web", async ({ page }) => {
  // El botón Borrar pide confirmación: la aceptamos automáticamente
  page.on("dialog", function (dialog) {
    dialog.accept();
  });

  // La tarjeta del listado que contiene nuestro producto
  const row = page.locator("#product-list .product-card", { hasText: productName });

  // --- CREAR ---
  await page.goto("/");
  await page.fill("#name", productName);
  await page.selectOption("#category", "Audio");
  await page.fill("#price", "10.5");
  await page.fill("#description", "Creado por Playwright");
  await page.click("#submit-button");

  await expect(row).toBeVisible();
  await expect(row).toContainText("Audio");
  await expect(row).toContainText("10,50");
  await expect(row).toContainText("Creado por Playwright");

  // El gráfico cuenta el producto en su categoría (la barra de Audio no está a 0)
  await expect(page.locator("#category-chart .category-audio .chart-value")).not.toHaveText("0");

  // --- EDITAR ---
  await row.getByRole("button", { name: "Editar" }).click();
  await expect(page.locator("#form-title")).toHaveText("Editando: " + productName);
  await expect(page.locator("#price")).toHaveValue("10.5");

  await page.fill("#price", "20");
  await page.click("#submit-button");

  await expect(row).toContainText("20,00");
  await expect(page.locator("#form-title")).toHaveText("Nuevo producto");

  // --- RECARGAR: el cambio sigue ahí porque está en MongoDB ---
  await page.reload();
  await expect(row).toContainText("20,00");

  // --- BORRAR ---
  await row.getByRole("button", { name: "Borrar" }).click();
  await expect(row).toHaveCount(0);

  // --- RECARGAR: sigue borrado ---
  // Esperamos a que llegue la lista desde la API antes de comprobar
  const listResponse = page.waitForResponse("http://localhost:3000/products");
  await page.reload();
  await listResponse;
  await expect(row).toHaveCount(0);
});

test("Cancelar la edición no cambia el producto", async ({ page }) => {
  const row = page.locator("#product-list .product-card", { hasText: productName });

  // Creamos el producto
  await page.goto("/");
  await page.fill("#name", productName);
  await page.selectOption("#category", "Móviles");
  await page.fill("#price", "300");
  await page.click("#submit-button");
  await expect(row).toContainText("300,00");

  // Empezamos a editar, cambiamos el precio y cancelamos
  await row.getByRole("button", { name: "Editar" }).click();
  await page.fill("#price", "1");
  await page.click("#cancel-button");

  // El formulario vuelve a "Nuevo producto" y el precio no ha cambiado
  await expect(page.locator("#form-title")).toHaveText("Nuevo producto");
  await expect(page.locator("#cancel-button")).toBeHidden();
  await page.reload();
  await expect(row).toContainText("300,00");
});
