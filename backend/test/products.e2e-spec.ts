import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

// =========================================================
// TESTS DE LA API (backend + MongoDB)
// Arrancan la API de verdad, le hacen peticiones HTTP reales
// y comprueban las respuestas y lo guardado en MongoDB.
// Usan la base de datos "catalog_test" (ver vitest.config.e2e.ts),
// así que NO tocan los datos reales de "catalog".
//
// Los tests cuentan una historia y van en orden:
// crear → obtener → listar → editar → borrar.
// Necesitan MongoDB arrancado.
// =========================================================
describe('CRUD de /products', () => {
  let app: INestApplication;
  let database: Connection;
  let productId: string; // id del producto que crea el primer test

  // Antes de todo: arrancamos la API y vaciamos la base de datos de test
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    database = app.get<Connection>(getConnectionToken());
    await database.dropDatabase();
  });

  // Al terminar: cerramos la API (y con ella la conexión a MongoDB)
  afterAll(async () => {
    await app.close();
  });

  it('GET /products devuelve una lista vacía al empezar', async () => {
    const response = await request(app.getHttpServer()).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('POST /products crea un producto con id y fecha de creación', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Ratón de test',
        category: 'Periféricos',
        price: 25.5,
        description: 'Creado por un test',
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Ratón de test');
    expect(response.body.price).toBe(25.5);
    expect(typeof response.body.id).toBe('string'); // "id", no "_id"
    expect(response.body._id).toBeUndefined();
    expect(response.body.createdAt).toBeDefined();

    productId = response.body.id;
  });

  it('el producto queda guardado de verdad en MongoDB', async () => {
    const documents = await database.collection('products').find().toArray();

    expect(documents.length).toBe(1);
    expect(documents[0].name).toBe('Ratón de test');
  });

  it('GET /products/:id devuelve ese producto', async () => {
    const response = await request(app.getHttpServer()).get(
      '/products/' + productId,
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe('Ratón de test');
  });

  it('GET /products lo incluye en la lista', async () => {
    const response = await request(app.getHttpServer()).get('/products');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(productId);
  });

  it('PUT /products/:id cambia los datos pero no la fecha de creación', async () => {
    const before = await request(app.getHttpServer()).get(
      '/products/' + productId,
    );

    const response = await request(app.getHttpServer())
      .put('/products/' + productId)
      .send({
        name: 'Ratón de test editado',
        category: 'Periféricos',
        price: 19.99,
        description: 'Editado por un test',
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Ratón de test editado');
    expect(response.body.price).toBe(19.99);
    expect(response.body.createdAt).toBe(before.body.createdAt);
  });

  it('DELETE /products/:id lo borra', async () => {
    const response = await request(app.getHttpServer()).delete(
      '/products/' + productId,
    );

    expect(response.status).toBe(200);
  });

  it('después de borrarlo, GET /products/:id responde 404', async () => {
    const response = await request(app.getHttpServer()).get(
      '/products/' + productId,
    );

    expect(response.status).toBe(404);
  });

  it('editar o borrar un producto que no existe responde 404', async () => {
    const putResponse = await request(app.getHttpServer())
      .put('/products/' + productId)
      .send({ name: 'x', category: 'Otros', price: 1, description: '' });
    const deleteResponse = await request(app.getHttpServer()).delete(
      '/products/' + productId,
    );

    expect(putResponse.status).toBe(404);
    expect(deleteResponse.status).toBe(404);
  });
});
