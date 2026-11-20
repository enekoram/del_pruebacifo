import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductInput } from './product.schema.js';
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
  findAll() {
    return this.productsService.findAll();
  }

  // GET /products/:id → uno concreto
  // En MongoDB los ids son texto (p. ej. "674a1f..."), así que se pasan tal cual
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // POST /products → crea uno con los datos del cuerpo (body) de la petición
  @Post()
  create(@Body() input: ProductInput) {
    return this.productsService.create(input);
  }

  // PUT /products/:id → edita uno
  @Put(':id')
  update(@Param('id') id: string, @Body() input: ProductInput) {
    return this.productsService.update(id, input);
  }

  // DELETE /products/:id → borra uno
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
