import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// =========================================================
// ESQUEMA: la forma que tiene un producto en MongoDB.
// Mongoose usa este molde para guardar y leer los documentos
// de la colección "products".
// =========================================================
@Schema({
  // No guardamos el campo interno de versión (__v) de Mongoose
  versionKey: false,
  toJSON: {
    // Al enviar un producto al frontend, MongoDB lo llama "_id".
    // Lo renombramos a "id" para que el frontend no tenga que cambiar.
    // (Record<string, any> = "un objeto cualquiera", para poder añadir y quitar campos)
    transform: function (_document, product: Record<string, any>) {
      product.id = product._id.toString();
      delete product._id;
      return product;
    },
  },
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  // La fecha la pone MongoDB al crear el producto
  @Prop({ default: Date.now })
  createdAt: Date;
}

// Convierte la clase anterior en un esquema real de Mongoose
export const ProductSchema = SchemaFactory.createForClass(Product);

// Lo que envía el frontend al crear o editar un producto.
// No lleva id ni createdAt: esos los pone la base de datos.
export class ProductInput {
  name: string;
  category: string;
  price: number;
  description: string;
}
