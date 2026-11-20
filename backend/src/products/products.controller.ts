import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Product, ProductInput } from './product.js';
import { ProductsService } from './products.service.js';

// =========================================================
// CONTROLADOR: es la "puerta" HTTP de la API.
// Recibe cada petición (método + ruta), se la pasa al servicio
// y devuelve la respuesta en JSON.
// Todas las rutas empiezan por /products
// =========================================================
@Controller('products')
export class ProductsController {
  // Nest nos "inyecta" el servicio: no hace falta crearlo con new
  constructor(private readonly productsService: ProductsService) {}

  // GET /products → lista todos
  @Get()
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  // GET /products/:id → uno concreto
  // Lo que llega en la URL es texto ("3"), por eso lo pasamos a número
  @Get(':id')
  findOne(@Param('id') id: string): Product {
    return this.productsService.findOne(Number(id));
  }

  // POST /products → crea uno con los datos del cuerpo (body) de la petición
  @Post()
  create(@Body() input: ProductInput): Product {
    return this.productsService.create(input);
  }

  // PUT /products/:id → edita uno
  @Put(':id')
  update(@Param('id') id: string, @Body() input: ProductInput): Product {
    return this.productsService.update(Number(id), input);
  }

  // DELETE /products/:id → borra uno
  @Delete(':id')
  remove(@Param('id') id: string): void {
    this.productsService.remove(Number(id));
  }
}
