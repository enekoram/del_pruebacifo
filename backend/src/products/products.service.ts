import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductInput } from './product.schema.js';

// =========================================================
// SERVICIO: sabe trabajar con los productos.
// En la fase 3 ya no hay array: los datos se guardan en MongoDB,
// y el "modelo" de Mongoose es quien habla con la base de datos.
// Las operaciones con la base de datos tardan, por eso usamos async/await.
// =========================================================
@Injectable()
export class ProductsService {
  // Nest nos inyecta el modelo de Mongoose para la colección "products"
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  // LISTAR: todos los documentos de la colección
  async findAll() {
    return this.productModel.find();
  }

  // OBTENER UNO: busca por id; si no existe, responde 404 (Not Found)
  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('No existe el producto con id ' + id);
    }
    return product;
  }

  // CREAR: MongoDB pone el id y Mongoose la fecha de creación
  async create(input: ProductInput) {
    return this.productModel.create(input);
  }

  // EDITAR: cambia los datos y devuelve el producto ya actualizado
  async update(id: string, input: ProductInput) {
    const product = await this.productModel.findByIdAndUpdate(id, input, {
      returnDocument: 'after',
    });
    if (!product) {
      throw new NotFoundException('No existe el producto con id ' + id);
    }
    return product;
  }

  // BORRAR: lo elimina de la base de datos
  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('No existe el producto con id ' + id);
    }
  }
}
