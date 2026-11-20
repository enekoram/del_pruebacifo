import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module.js';

// =========================================================
// MÓDULO PRINCIPAL: la raíz de la aplicación.
// Aquí se "enchufan" los demás módulos.
// =========================================================
@Module({
  imports: [
    // Conexión a MongoDB en local, base de datos "catalog"
    MongooseModule.forRoot('mongodb://localhost:27017/catalog'),
    ProductsModule,
  ],
})
export class AppModule {}
