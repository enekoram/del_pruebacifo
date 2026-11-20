import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema.js';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

// =========================================================
// MÓDULO: agrupa todas las piezas de "productos"
// (controlador + servicio + modelo de MongoDB) para que Nest las conozca.
// =========================================================
@Module({
  // Registra el modelo "Product" (colección "products" en MongoDB)
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
