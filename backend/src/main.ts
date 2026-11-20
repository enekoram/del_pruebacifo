import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// =========================================================
// PUNTO DE ENTRADA: arranca el servidor de la API.
// =========================================================
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite que una web servida desde otro origen
  // (el frontend en http://localhost:8080) llame a esta API
  app.enableCors();

  await app.listen(3000);
  console.log('API escuchando en http://localhost:3000/products');
}
await bootstrap();
