# Proyecto: catálogo mínimo de productos tecnológicos (fullstack de aprendizaje)

## Objetivo
Proyecto didáctico para entender las PIEZAS de una aplicación fullstack
(frontend, backend, base de datos y cómo se comunican), no para aprender a programar.
Prima la claridad sobre la sofisticación. Menos código y más simple es mejor.

## Stack (no cambiar sin preguntar)
- Frontend: HTML, CSS3 y JavaScript puro (sin frameworks, sin bundlers).
- Backend: NestJS (TypeScript).
- Base de datos: MongoDB en local, con Mongoose (@nestjs/mongoose).
- Todo en local. Sin autenticación, sin Docker, sin despliegue.
- Git para guardar puntos de control. Commits y push únicamente cuando el
  usuario los pida. Remoto: https://github.com/enekoram/del_pruebacifo.git
  (público; autenticación HTTPS con token guardado en el llavero de macOS).

## Alcance
- Entidad única: Producto con los campos nombre, categoría, precio,
  descripción y fecha de creación.
- Funciones: crear, listar, editar y borrar (CRUD completo).
- Fuera de alcance: login, roles, tests complejos, paginación, subida de
  imágenes, despliegue. Si algo parece necesario, preguntar antes.

## Fases (en este orden; no adelantar la siguiente sin mi aprobación)
1. FASE 1 · Frontend solo. Una web HTML + CSS + JS con el formulario y el
   listado de productos. Los datos viven en memoria, en un array de JS (se
   pierden al recargar). Se abre directamente en el navegador. El objetivo
   es ver la pieza "interfaz" aislada.
2. FASE 2 · Backend. Se añade una API NestJS (puerto 3000, CORS activado)
   con CRUD de productos. Los datos viven en memoria dentro del backend
   (se pierden al reiniciar). El frontend deja de usar su array y pasa a
   llamar a la API con fetch. El objetivo es entender la comunicación
   frontend ↔ backend.
3. FASE 3 · Base de datos. Se añade MongoDB local con Mongoose y el backend
   guarda ahí los productos. El frontend no debería necesitar cambios. El
   objetivo es entender la persistencia.
Al terminar cada fase, parar, comprobar que funciona y esperar mi visto bueno
antes de pasar a la siguiente.

## Estructura (crece con las fases)
- Fase 1: /frontend  → index.html, styles.css, app.js
- Fase 2: se añade /backend (NestJS). El frontend se sirve con un servidor
  estático simple (p. ej. `npx serve`).
- Fase 3: se añade la conexión a MongoDB dentro de /backend.
- Flujo final: navegador → fetch → API REST (NestJS) → Mongoose → MongoDB.

## Forma de trabajar (obligatoria)
1. Antes de hacer cualquier cosa, mostrar qué vamos a hacer (pasos, ficheros
   que se tocarán, comandos que se ejecutarán) y ESPERAR mi aprobación explícita.
   Nunca avanzar sin mi "ok".
2. Trabajar en pasos pequeños. Un paso = una pieza comprensible. Al terminar
   cada paso, comprobar que funciona y mostrar cómo verlo.
3. Preguntar siempre que haya una duda o varias opciones razonables.
   Es preferible preguntar de más que suponer.
4. Tomarse el tiempo necesario. No hay prisa ni hace falta ser rápido.
5. Explicar de forma BREVE cada pieza antes de crearla: qué es, para qué
   sirve y con qué otras piezas se conecta (2-4 líneas, lenguaje sencillo).
6. No instalar dependencias ni ejecutar comandos fuera de lo aprobado.
7. No añadir funcionalidades, librerías ni abstracciones que no se hayan pedido.

## Bitácora (contexto entre sesiones)
- Al empezar cada sesión, leer BITACORA.md (estado actual, decisiones e histórico).
- Actualizarla al terminar cada paso y cada vez que se tome una decisión.

## Idioma
Español para explicaciones, comentarios y mensajes. Identificadores del
código (variables, clases, rutas) en inglés.

## Estilo de código
- Simple y legible, con comentarios breves donde ayuden a entender la pieza.
- Rutas REST estándar (a partir de la fase 2): GET/POST /products, GET/PUT/DELETE /products/:id.
- Sin código "inteligente" o compacto: que se pueda leer de arriba abajo.
