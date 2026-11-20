import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module.js';

// =========================================================
// MÓDULO PRINCIPAL: la raíz de la aplicación.
// Aquí se "enchufan" los demás módulos.
// =========================================================
@Module({
  imports: [
    // Conexión a MongoDB en local, base de datos "catalog".
    // Los tests la cambian por "catalog_test" con la variable MONGODB_URI,
    // para no tocar los datos reales.
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/catalog',
    ),
    ProductsModule,
  ],
})
export class AppModule {}
