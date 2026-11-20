import { defineConfig } from "@playwright/test";

// =========================================================
// CONFIGURACIÓN DE LOS TESTS EN EL NAVEGADOR (Playwright)
// Prueban la aplicación COMPLETA: web → API → MongoDB.
// Requisito: MongoDB arrancado (ver BITACORA.md).
// =========================================================
export default defineConfig({
  testDir: "./tests",

  use: {
    // Dirección de la web (así en los tests basta con page.goto("/"))
    baseURL: "http://localhost:8080",
    // Usa el Google Chrome instalado en el Mac (no descarga otro navegador)
    channel: "chrome"
  },

  // Servidores que necesitan los tests. Si ya están arrancados
  // se reutilizan; si no, Playwright los arranca y los para al terminar.
  webServer: [
    {
      command: "npm run start",
      cwd: "../backend",
      url: "http://localhost:3000/products",
      reuseExistingServer: true
    },
    {
      command: "npx serve ../frontend -l 8080",
      url: "http://localhost:8080",
      reuseExistingServer: true
    }
  ]
});
