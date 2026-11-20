import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

// =========================================================
// MÓDULO: agrupa todas las piezas de "productos"
// (controlador + servicio) para que Nest las conozca.
// =========================================================
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
