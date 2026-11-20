import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// =========================================================
// PUNTO DE ENTRADA: arranca el servidor de la API.
// =========================================================
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite que una web servida desde otro origen
  // (el frontend en http://localhost:8080 o en Render) llame a esta API
  app.enableCors();

  // Puerto: en local, 3000. En Render, el que nos dé en la variable PORT.
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log('API escuchando en el puerto ' + port + ' (ruta /products)');
}
await bootstrap();
