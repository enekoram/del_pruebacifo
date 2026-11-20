import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';

// =========================================================
// MÓDULO PRINCIPAL: la raíz de la aplicación.
// Aquí se "enchufan" los demás módulos (de momento, solo productos).
// =========================================================
@Module({
  imports: [ProductsModule],
})
export class AppModule {}
