// =========================================================
// FORMA DE LOS DATOS
// Describe qué campos tiene un producto. Es solo "un molde":
// no guarda datos ni tiene lógica.
// =========================================================

// Un producto completo, tal y como lo guarda y lo devuelve la API
export class Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  createdAt: string; // fecha en formato ISO, p. ej. "2026-11-20T10:00:00.000Z"
}

// Lo que envía el frontend al crear o editar un producto.
// No lleva id ni createdAt: esos los pone el backend.
export class ProductInput {
  name: string;
  category: string;
  price: number;
  description: string;
}
