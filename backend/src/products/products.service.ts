import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductInput } from './product.js';

// =========================================================
// SERVICIO: guarda los productos y sabe trabajar con ellos.
// En la fase 2 los datos viven en un array EN MEMORIA del backend:
// se pierden al reiniciar el servidor.
// =========================================================
@Injectable()
export class ProductsService {
  // Los mismos 2 productos de ejemplo que tenía el frontend en la fase 1
  private products: Product[] = [
    {
      id: 1,
      name: 'MacBook Air 13',
      category: 'Portátiles',
      price: 1199.99,
      description: 'Portátil ligero con chip M3 y 16 GB de RAM.',
      createdAt: '2026-11-10T10:00:00.000Z',
    },
    {
      id: 2,
      name: 'Auriculares inalámbricos',
      category: 'Audio',
      price: 89.9,
      description: 'Con cancelación de ruido y 30 horas de batería.',
      createdAt: '2026-11-15T17:30:00.000Z',
    },
  ];

  // Siguiente id que se asignará a un producto nuevo
  private nextId = 3;

  // LISTAR: devuelve todos los productos
  findAll(): Product[] {
    return this.products;
  }

  // OBTENER UNO: busca por id; si no existe, responde 404 (Not Found)
  findOne(id: number): Product {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw new NotFoundException('No existe el producto con id ' + id);
    }
    return product;
  }

  // CREAR: el backend pone el id y la fecha de creación
  create(input: ProductInput): Product {
    const newProduct: Product = {
      id: this.nextId,
      name: input.name,
      category: input.category,
      price: input.price,
      description: input.description,
      createdAt: new Date().toISOString(),
    };
    this.nextId = this.nextId + 1;
    this.products.push(newProduct);
    return newProduct;
  }

  // EDITAR: cambia los datos; el id y la fecha de creación no cambian
  update(id: number, input: ProductInput): Product {
    const product = this.findOne(id);
    product.name = input.name;
    product.category = input.category;
    product.price = input.price;
    product.description = input.description;
    return product;
  }

  // BORRAR: comprueba que existe y lo quita del array
  remove(id: number): void {
    this.findOne(id);
    this.products = this.products.filter((item) => item.id !== id);
  }
}
