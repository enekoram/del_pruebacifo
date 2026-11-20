import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Los tests usan una base de datos aparte, que se vacía al empezar
    env: { MONGODB_URI: 'mongodb://localhost:27017/catalog_test' },
  },
});
