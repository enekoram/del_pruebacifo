# Bitácora del proyecto

Diario del proyecto: dónde estamos, qué se ha decidido y qué se ha hecho.
Se lee al empezar cada sesión y se actualiza al terminar cada paso o al tomar una decisión.

---

## 1. Estado actual

- **Fase 1** (frontend solo): **TERMINADA y comprobada** el 20/11/2026.
- **Fase 2** (backend NestJS): **TERMINADA y comprobada** el 20/11/2026. La hizo Claude durante el descanso del usuario; las decisiones están marcadas con *(fase 2, Claude)*. El usuario la probó en el navegador y dio el visto bueno.
- **Fase 3** (MongoDB + Mongoose): **TERMINADA y comprobada** el 20/11/2026. Los datos sobreviven a reiniciar el backend; el usuario lo comprobó en el navegador y dio el visto bueno.
- **🎉 Proyecto completo:** las 3 fases están terminadas. Flujo final: navegador → fetch → API REST (NestJS) → Mongoose → MongoDB.
- **Siguiente:** nada pendiente del alcance del CLAUDE.md. Cualquier mejora nueva hay que proponerla y aprobarla antes.
- **Git:** commits `fase1`, `fase1 completa`, `bitácora: subida a GitHub…`, `fase2`, `fase3` y `tests`, en `origin/main`.
- **⚠️ Seguridad pendiente:** el token se pegó en el chat, así que hay que **revocarlo y crear otro** (ver Pendientes).

### Cómo arrancar y ver la aplicación (fase 3)
Hacen falta **tres programas**, cada uno en su propia ventana de la app Terminal y **en este orden**:
1. **Base de datos (MongoDB):** `~/mongodb/bin/mongod --dbpath ~/mongodb/data --bind_ip 127.0.0.1` → escucha en `localhost:27017`.
2. **Backend (API):** `cd backend` y `npm run start:dev` → http://localhost:3000/products (se reinicia solo al guardar cambios).
3. **Frontend:** desde la raíz del proyecto, `npx serve frontend -l 8080` → abrir **http://localhost:8080**.
- Para pararlos: `Ctrl + C` en cada ventana.
- Si MongoDB no está arrancado, el backend se queda reintentando la conexión y la API no responde.
- Si el backend no está arrancado, la web muestra el aviso "No se puede conectar con el backend…".
- Los productos **ya no se pierden** al recargar la web ni al reiniciar el backend: están en MongoDB (`~/mongodb/data`).
- **Ver los datos directamente en la base de datos:** `~/mongodb/bin/mongosh catalog` y dentro `db.products.find()` (salir con `exit`).

### Cómo ejecutar los tests
Requisito: **MongoDB arrancado**.
1. **Tests de la API (backend + MongoDB):** `cd backend` y `npm run test:e2e`. Son 9 tests. Usan la BD **`catalog_test`**, que vacían al empezar, así que **no tocan** `catalog`.
2. **Tests en el navegador (web + API + MongoDB):** `cd e2e` y `npm test`. Son 2 tests y abren Google Chrome en modo invisible. Si el backend o la web no están arrancados, Playwright los arranca solo. Trabajan sobre la BD real `catalog`, pero solo con productos llamados `Producto E2E …`, que borran siempre al terminar.
   - Para **ver el navegador** mientras hace las pruebas: `npx playwright test --headed`.

### Ficheros actuales
| Fichero | Qué es | Estado |
|---|---|---|
| `CLAUDE.md` | Instrucciones del proyecto (objetivo, stack, fases, forma de trabajar) | — |
| `BITACORA.md` | Este diario | — |
| `.gitignore` | Ficheros que git ignora: `.DS_Store`, `node_modules/`, `dist/`, `*.tsbuildinfo` | — |
| `frontend/index.html` | Estructura: formulario y tabla | Terminado |
| `frontend/styles.css` | Apariencia: tarjetas blancas, acento índigo, adaptado a móvil | Terminado |
| `frontend/app.js` | Comportamiento: pide y envía los productos a la API con `fetch` (desde la fase 2; sin cambios en la fase 3) | Terminado |
| `backend/src/main.ts` | Punto de entrada: arranca la API en el puerto 3000 con CORS activado | Terminado |
| `backend/src/app.module.ts` | Módulo raíz: conexión a MongoDB (`mongodb://localhost:27017/catalog`) y módulo de productos | Hecho (fase 3) |
| `backend/src/products/product.schema.ts` | Esquema de Mongoose (`Product`), traducción de `_id` a `id` al enviar JSON y la clase `ProductInput`. Sustituye a `product.ts` | Hecho (fase 3) |
| `backend/src/products/products.controller.ts` | Rutas HTTP: GET/POST `/products`, GET/PUT/DELETE `/products/:id`. El id es texto | Hecho (fase 3) |
| `backend/src/products/products.service.ts` | Lógica: usa el modelo de Mongoose (`find`, `findById`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`) | Hecho (fase 3) |
| `backend/src/products/products.module.ts` | Agrupa el controlador, el servicio y el modelo `Product` (`MongooseModule.forFeature`) | Hecho (fase 3) |
| `backend/test/products.e2e-spec.ts` | Tests de la API: 9 tests (crear, obtener, listar, editar, borrar, 404 y que el dato está en MongoDB) | Hecho, pasan |
| `backend/vitest.config.e2e.ts` | Config de esos tests: `MONGODB_URI` → `catalog_test` | Modificado |
| `e2e/package.json` | Proyecto aparte solo para Playwright (`@playwright/test` 1.65.1) | Hecho |
| `e2e/playwright.config.js` | Config: web en 8080, Chrome del Mac y arranque automático de los servidores si no están | Hecho |
| `e2e/tests/crud.spec.js` | Tests en el navegador: 2 tests (crear → editar → recargar → borrar, y Cancelar) | Hecho, pasan |
| `~/mongodb/` (fuera del proyecto) | MongoDB instalado: `bin/` (`mongod`, `mongosh`) y `data/` (los datos) | Instalado (fase 3) |
| `backend/package.json`, `tsconfig*.json`, `nest-cli.json`… | Configuración generada por el CLI de Nest | Generado |

### Entorno (comprobado el 19/11/2026)
| Herramienta | Estado |
|---|---|
| Sistema | macOS 15.5 |
| Navegadores | Google Chrome y Safari |
| Node / npm / npx | v26.13.1 / 11.20.0 / 11.20.0 (para la fase 2) |
| MongoDB (`mongod`) | 9.0.8, descarga oficial para arm64, instalado el 20/11/2026 en `~/mongodb/bin` (sin Homebrew ni permisos de administrador) |
| mongosh | 2.14.3, en `~/mongodb/bin` |
| Usuario de macOS | **No es administrador** (no puede instalar Homebrew sin la contraseña de un administrador) |
| Procesador | Apple Silicon (arm64) |
| Git | 2.39.5 (Apple Git-154), instalado el 20/11/2026 con las Command Line Tools de Xcode |
| Python | Debería estar disponible desde el 20/11/2026 (viene con las Command Line Tools); no comprobado |
| NestJS | 12 (CLI `@nestjs/cli@12.0.14`, ejecutado con `npx`, sin instalar global) |
| serve | 14.2.8, ejecutado con `npx` (sin instalar global) |

---

## 2. Decisiones tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| 19/11/2026 | La fase 1 se hace en 5 pasos: HTML → CSS → crear y listar → borrar → editar | Pasos pequeños, una pieza cada vez |
| 19/11/2026 | La categoría es un desplegable fijo: Portátiles, Móviles, Periféricos, Audio, Otros | Evita que la misma categoría aparezca escrita de formas distintas |
| 19/11/2026 | El precio va en euros con 2 decimales y se muestra como `499,99 €` | Formato habitual en España |
| 19/11/2026 | Nombre, categoría y precio son obligatorios (`required`), el precio debe ser ≥ 0 y la descripción es opcional | Es la validación más simple: la hace el propio navegador |
| 19/11/2026 | Borrar pide confirmación con `confirm("¿Seguro que quieres borrarlo?")` | Evita borrados accidentales sin añadir complejidad |
| 19/11/2026 | Editar reutiliza el mismo formulario, que pasa a modo "Editando…" y muestra un botón "Cancelar" | Es más simple que editar dentro de la fila |
| 19/11/2026 | El array empieza con 2 productos de ejemplo | Se ve la tabla nada más abrir y se comprueba que lo añadido se pierde al recargar |
| 19/11/2026 | La fecha se muestra sin hora, como `19/11/2026` | Basta para el listado |
| 19/11/2026 | "Ver la web" significa abrir el fichero en el navegador local, sin desplegar nada | El CLAUDE.md dice "todo en local, sin despliegue" |
| 19/11/2026 | Diseño de tarjetas blancas sobre fondo gris claro, con acento índigo y colores en variables CSS | El usuario pidió una web más bonita. Solo CSS, sin librerías ni fuentes externas |
| 19/11/2026 | Los identificadores del código van en inglés (`products`, `renderProducts`…) y los comentarios en español | Lo indica el CLAUDE.md |
| 20/11/2026 | Se crea `BITACORA.md` en la raíz y el CLAUDE.md obliga a leerla y actualizarla | Para no perder el contexto entre sesiones |
| 20/11/2026 | La bitácora se actualiza al terminar cada paso y con cada decisión | Mantener el contexto siempre al día |
| 20/11/2026 | Para borrar se usa `products.filter(...)` y el `id` se pasa a cada botón al crearlo en `renderProducts()` | Es lo más legible: el array se queda con todos los productos menos el borrado |
| 20/11/2026 | **Se usa git** (cambia la regla "sin git" del CLAUDE.md): solo en local, commits solo cuando el usuario los pida y sin remoto | Lo pidió el usuario para tener puntos de control |
| 20/11/2026 | **Se conecta un remoto en GitHub**: `https://github.com/enekoram/del_pruebacifo.git` (público). Cambia la regla "sin remoto" del CLAUDE.md. Push solo cuando lo pida el usuario | Lo pidió el usuario |
| 20/11/2026 | Autenticación por **HTTPS con token** (fine-grained, solo para ese repo, Contents read/write), guardado en el llavero de macOS. El primer push lo hace el usuario desde la app Terminal | Lo eligió el usuario (opción B). El token nunca se pega en el chat |
| 20/11/2026 | **Email oculto:** git usa el email privado de GitHub (`359064267+enekoram@users.noreply.github.com`) y se reescribió el commit `fase1` con ese email antes de subirlo | El repo es público y el usuario no quiere mostrar su email |
| 20/11/2026 | El primer commit se llama `fase1` aunque el paso 5 (editar) aún no está hecho | Lo eligió el usuario (opción "a") |
| 20/11/2026 | `.gitignore` mínimo con `.DS_Store` (`node_modules/` se añadirá en la fase 2) | No guardar ficheros basura de macOS |
| 20/11/2026 | Para editar se usa la variable `editingId` (`null` = crear; un id = editar) y el mismo `submit` sirve para crear y actualizar | Un solo formulario y una sola función de guardado, fácil de seguir |
| 20/11/2026 | Al editar no cambian ni el `id` ni la fecha de creación (`createdAt`) | La fecha es la de creación, no la de la última modificación |
| 20/11/2026 | El título del formulario pasa a "Editando: <nombre>" y aparece "Cancelar"; si se borra el producto que se está editando, el formulario vuelve a "Nuevo producto" | Evita quedarse editando un producto que ya no existe |
| 20/11/2026 | El usuario autoriza a hacer la fase 2 sin él, durante el descanso ("acaba la fase 1 y sigue con la fase 2 mientras hago el break") | Aprovechar el descanso. Por eso las decisiones siguientes no tienen el "ok" previo |
| 20/11/2026 | *(fase 2, Claude)* Proyecto creado con el CLI oficial: `npx @nestjs/cli@12.0.14 new backend --package-manager npm --skip-git` | Es la forma estándar y la que aparece en los tutoriales |
| 20/11/2026 | *(fase 2, Claude)* Se borraron del proyecto generado: las "agent skills" (`.agents/`, `.claude/`) y `AGENTS.md` que añadió el CLI, el ejemplo "Hello World" (`app.controller`, `app.service`, su test) y la carpeta `test/` | No forman parte del proyecto, nadie las pidió y el test e2e fallaría sin el "Hello World". Menos ficheros = más claro |
| 20/11/2026 | *(fase 2, Claude)* Se dejan sin tocar el resto de ficheros generados (Vitest, oxlint, Prettier, `README.md`) | No estorban y quitarlos sería tocar la configuración estándar |
| 20/11/2026 | *(fase 2, Claude)* Estructura en módulo de productos: `product.ts` + controlador + servicio + módulo | Es la estructura estándar de Nest y en la fase 3 Mongoose se conecta en ese mismo módulo |
| 20/11/2026 | *(fase 2, Claude)* Los tipos de datos son clases (`Product`, `ProductInput`) en un solo fichero, sin `class-validator` | Sin librerías extra. Clases y no interfaces porque Nest las usa en los decoradores |
| 20/11/2026 | *(fase 2, Claude)* El backend pone el `id` (numérico, empezando en 3) y el `createdAt`. El frontend solo envía nombre, categoría, precio y descripción | Los datos "oficiales" los decide el servidor |
| 20/11/2026 | *(fase 2, Claude)* Los 2 productos de ejemplo se mueven del frontend al backend | Se ve la tabla nada más arrancar, como en la fase 1 |
| 20/11/2026 | *(fase 2, Claude)* Si no existe un id, la API responde **404** con `NotFoundException`. Sin más validación en el backend | Mínimo razonable; la validación del formulario sigue en el HTML |
| 20/11/2026 | *(fase 2, Claude)* El `id` de la URL se convierte con `Number(id)` en el controlador | Más fácil de explicar que `ParseIntPipe`. En la fase 3 cambiará, porque MongoDB usa ids de texto |
| 20/11/2026 | *(fase 2, Claude)* CORS con `app.enableCors()` (permite cualquier origen) | Es local y de aprendizaje. También funciona abriendo el HTML con doble clic |
| 20/11/2026 | *(fase 2, Claude)* El frontend se sirve con `npx serve frontend -l 8080`, en el **puerto 8080** | `serve` usa el 3000 por defecto, y ese es el de la API |
| 20/11/2026 | *(fase 2, Claude)* En `app.js`, tras cada crear/editar/borrar se vuelve a pedir la lista con `loadProducts()` | Una sola fuente de verdad (el backend) y código más simple |
| 20/11/2026 | *(fase 2, Claude)* Si el backend no responde, se muestra un `alert` ("No se puede conectar con el backend…") y el error en la consola | Sin eso, la web fallaría en silencio |
| 20/11/2026 | *(fase 2, Claude)* Se ignoran en git `node_modules/`, `dist/` y `*.tsbuildinfo` | Se regeneran con `npm install` y `npm run build` |
| 20/11/2026 | El commit de la fase 2 se llama `fase2` | El usuario no dio nombre; lo eligió Claude |
| 20/11/2026 | Instalar MongoDB con la **descarga oficial en `~/mongodb/`** (opción A). El usuario eligió primero Homebrew (B), pero su usuario no es administrador y cambió a A | Sin permisos de administrador; no instala nada en el sistema. Se desinstala borrando la carpeta |
| 20/11/2026 | MongoDB 9.0.8 + mongosh 2.14.3. Se comprobó el checksum SHA-256 de MongoDB y la firma de Apple de ambos (TeamIdentifier `4XWMY46275`). Se borraron `mongos` e `install_compass`, que no se usan | Versiones estables actuales; verificar lo descargado |
| 20/11/2026 | MongoDB escucha solo en `127.0.0.1:27017` y guarda los datos en `~/mongodb/data` (fuera del proyecto y de git) | Solo local; los datos no se suben a GitHub |
| 20/11/2026 | *(fase 3, Claude)* `mongoose` 9.12.2 y `@nestjs/mongoose` 12.0.1 | Últimas versiones, compatibles con Nest 12 |
| 20/11/2026 | *(fase 3, Claude)* Base de datos `catalog`, colección `products` | Nombre corto y en inglés, como el resto de identificadores |
| 20/11/2026 | *(fase 3, Claude)* La BD **empieza vacía**, sin productos de ejemplo | Era la recomendación de Claude; el usuario no respondió a esa pregunta |
| 20/11/2026 | *(fase 3, Claude)* La API devuelve `id` en lugar de `_id` (con `toJSON.transform` en el esquema) y no envía `__v` (`versionKey: false`) | Así **el frontend no cambia**, como pide el CLAUDE.md. Recomendación de Claude, sin respuesta del usuario |
| 20/11/2026 | *(fase 3, Claude)* `createdAt` es un `@Prop({ default: Date.now })` explícito (no la opción `timestamps` de Mongoose) | Se ve en el esquema de dónde sale la fecha y no añade `updatedAt` |
| 20/11/2026 | *(fase 3, Claude)* `product.ts` se sustituye por `product.schema.ts`, que contiene el esquema y `ProductInput` | Un único fichero con la forma de los datos |
| 20/11/2026 | **Tests** (los pidió el usuario después de la fase 3; el CLAUDE.md deja fuera los "tests complejos", así que se preguntó y el usuario respondió "lo que quieras"). Claude eligió **A + B**: tests de la API y tests en el navegador | A muestra que el servidor y la BD funcionan; B, que todo encaja de punta a punta |
| 20/11/2026 | *(tests, Claude)* Los tests de la API usan **Vitest + supertest**, que ya instaló el CLI de Nest | Sin dependencias nuevas |
| 20/11/2026 | *(tests, Claude)* `app.module.ts` lee la dirección de MongoDB de `MONGODB_URI`, con `catalog` por defecto. Los tests de la API usan `catalog_test` | No mezclar los datos de los tests con los reales |
| 20/11/2026 | *(tests, Claude)* Los tests de la API cuentan una "historia" en orden (crear → obtener → listar → editar → borrar) y comparten el `id` | Se leen de arriba abajo; más didáctico que tests independientes |
| 20/11/2026 | *(tests, Claude)* Los tests en el navegador usan **Playwright** en una carpeta aparte `/e2e`, con el **Chrome instalado** (`channel: "chrome"`) | No mezclar dependencias con el backend ni descargar otro navegador (150-300 MB) |
| 20/11/2026 | *(tests, Claude)* Los tests en el navegador usan la app real (8080 → 3000 → `catalog`) con productos `Producto E2E <número>` que se borran en `afterEach` | La URL de la API está fija en el frontend; levantar otra copia en otro puerto obligaría a cambiarlo |
| 20/11/2026 | *(tests, Claude)* Se ignoran en git `test-results/` y `playwright-report/` | Son resultados que se regeneran |
| 20/11/2026 | *(fase 3, Claude)* Limitación conocida: si se pide un id con formato no válido (p. ej. `/products/abc`), la API responde 500 en lugar de 404 | El frontend siempre usa ids reales; manejarlo añadiría código. Se puede mejorar si se pide |

> Las decisiones del 19/11 sobre categoría, precio, validación, borrar, editar, datos de ejemplo, fecha y pasos las tomó Claude porque el usuario se las delegó ("toma tú las decisiones").

---

## 3. Histórico

### 19/11/2026 · Sesión 1: arranque y fase 1 (pasos 1-3)
1. **Arranque:** Claude leyó el CLAUDE.md, resumió el proyecto y comprobó el entorno sin instalar nada (ver la tabla de entorno).
2. **Plan de la fase 1:** se propusieron los 3 ficheros (`index.html`, `styles.css`, `app.js`), los 5 pasos y 8 preguntas. El usuario delegó las respuestas en Claude (ver "Decisiones").
3. **Paso 1, `frontend/index.html`:** el formulario (nombre, categoría, precio, descripción, botones Guardar y Cancelar, este último oculto) y la tabla con el `<tbody id="product-list">` vacío. Ya enlaza `styles.css` y `app.js`.
   - El usuario pidió "deployar" el HTML para verlo. Se abrió en local con `open`, sin publicarlo.
4. **Paso 2, `frontend/styles.css`:** la primera versión sin estilo le pareció "feísima" al usuario, que pidió una web bonita. Se creó un CSS con variables de color, tarjetas, foco resaltado en los campos, botones y tabla, y un ajuste para móvil. También incluye ya los estilos de los botones Editar y Borrar de cada fila.
5. **"No se me guardan los productos":** el usuario lo detectó antes del paso 3. Era lo esperado: sin `app.js`, el formulario recarga la página.
6. **Paso 3, `frontend/app.js` (crear y listar):**
   - El array `products` con 2 ejemplos (MacBook Air 13 y unos auriculares inalámbricos) y `nextId = 3`.
   - `renderProducts()` vacía y redibuja la tabla. `addCell()` crea las celdas usando `textContent`.
   - `formatPrice()` y `formatDate()` dan el formato español.
   - Al hacer `submit`, `preventDefault()` evita la recarga. Después se crea el producto con su `id` y su `createdAt`, se hace `push`, se redibuja la tabla y se limpia el formulario con `reset`.
   - Los botones Editar y Borrar se crean, pero aún no hacen nada.
   - **El usuario lo comprobó y funciona.**
7. La sesión terminó cuando Claude pedía el "ok" para el paso 4.

### 20/11/2026 · Sesión 2: bitácora, fin de la fase 1, git/GitHub y fase 2
1. Claude reconstruyó el histórico a partir del registro de la sesión anterior y de los ficheros.
2. Se creó esta `BITACORA.md` y se añadió al `CLAUDE.md` la regla de leerla y actualizarla.
3. **Paso 4, borrar (`frontend/app.js`):**
   - En `renderProducts()`, cada botón "Borrar" tiene un `addEventListener("click", ...)` que llama a `deleteProduct(product.id)`.
   - `deleteProduct(id)` pide `confirm(...)`, filtra el array para quitar ese producto y redibuja la tabla.
   - Pendiente de que el usuario lo compruebe.
4. Se volvió a abrir la web en el navegador (en local, con `open`).
5. **Git:** el usuario pidió poner git. No estaba instalado, así que se lanzó `xcode-select --install` y el usuario aceptó el instalador. Se cambió la regla de git en el `CLAUDE.md`, se creó `.gitignore` y se ejecutó `git init`.
6. Se configuró la identidad global de git (nombre y email del usuario) y se hizo el **primer commit, `fase1`**, con los pasos 1-4 de la fase 1 (falta el paso 5, editar).
7. El usuario comprobó el **paso 4 (borrar)**: funciona.
8. **Paso 5, editar (`frontend/app.js`):**
   - `editingId` guarda el id del producto en edición, o `null`.
   - `startEditing(product)` rellena el formulario, cambia el título y muestra "Cancelar".
   - El `submit` crea un producto si `editingId` es `null` y, si no, lo busca con `find` y actualiza sus campos.
   - `resetForm()` vacía el formulario y lo devuelve a modo "Nuevo producto". La usan el `submit`, "Cancelar" y `deleteProduct` (cuando se borra el producto en edición).
   - Estos cambios aún no están en ningún commit.
9. El usuario comprobó el **paso 5 (editar)**: funciona. **La fase 1 queda terminada.**
10. **GitHub:** el usuario pidió conectar `https://github.com/enekoram/del_pruebacifo.git`, que es público y estaba vacío. No había `gh`, Homebrew ni claves SSH, y el usuario eligió HTTPS con token. Se cambió el email de git por el privado de GitHub, se reescribió el commit `fase1`, se añadió el remoto `origin` y la rama pasó a llamarse `main`.
11. Se hizo el commit **`fase1 completa`** (paso 5, cambios del CLAUDE.md y bitácora) para que el primer push suba la fase 1 entera.
12. El usuario estaba en clase y pegó el token en el chat. Claude lo guardó en el llavero de macOS (`git credential approve`) e hizo `git push -u origin main`: se subieron `fase1` y `fase1 completa`. El token no está en ningún fichero del proyecto ni en la URL del remoto, pero sí en el historial de la conversación, así que debe revocarse.
13. El usuario pidió commit y push de la bitácora: commit `bitácora: subida a GitHub y aviso del token`, subido.
14. **Descanso del usuario:** pidió asegurar que la fase 1 está cerrada y seguir con la fase 2 sin él.
    - **Cierre de la fase 1:** se comprobó la sintaxis de `app.js`, que no había nada sin commit y que todo estaba subido. Se corrigieron dos comentarios desactualizados de `index.html` ("se crean en el paso 2/3").
    - **Backend:** se generó con el CLI de Nest 12 y se limpió (ver Decisiones). Se escribieron `product.ts`, `products.service.ts`, `products.controller.ts`, `products.module.ts`, `app.module.ts` y `main.ts`. Compila con `npm run build`.
    - **Prueba de la API con `curl`:** GET lista (2 ejemplos) ✅, POST crea id 3 (201) ✅, GET /3 ✅, PUT /3 cambia los datos y mantiene la fecha ✅, DELETE /3 (200) ✅, GET /3 da 404 ✅, cabeceras CORS ✅ (también la petición previa del PUT).
    - **Frontend:** `app.js` pasa de usar el array a usar `fetch` (GET, POST, PUT, DELETE). No se cambiaron `index.html` (salvo los comentarios) ni `styles.css`. Se sirve con `serve` en el 8080 y se comprobó que entrega los 3 ficheros.
    - **No probado en un navegador real:** falta que el usuario lo compruebe.
    - Los dos servidores quedaron arrancados en segundo plano desde la sesión de Claude.
15. Claude abrió http://localhost:8080 en el navegador. El usuario lo probó: **"Lo veo todo bien"**. **La fase 2 queda terminada.**
16. El usuario pidió commit, push y empezar la fase 3. Se hizo el commit **`fase2`** (el nombre lo eligió Claude) y el push. El push funcionó con el token guardado, así que **ese token aún no se ha revocado**.
17. **Plan de la fase 3:** el Mac es arm64, MongoDB no estaba instalado y el puerto 27017 estaba libre. Se propusieron A (descarga oficial) o B (Homebrew) y 3 preguntas más. El usuario eligió B, pero **no es administrador**, así que pasó a A. A las preguntas sobre datos de ejemplo e `id` no respondió, y se aplicaron las recomendaciones de Claude.
18. **Fase 3, paso 1 (instalar MongoDB):** se descargaron MongoDB 9.0.8 y mongosh 2.14.3 (checksum y firmas verificados), se instalaron en `~/mongodb/bin` y se arrancó `mongod`. `mongosh` responde.
19. **Fase 3, paso 2:** `npm install mongoose@9.12.2 @nestjs/mongoose@12.0.1`. Hubo un aviso sobre `fsevents`, una dependencia opcional de macOS, que no afecta.
20. **Fase 3, pasos 3-5:** conexión en `app.module.ts`, esquema `product.schema.ts` (se borró `product.ts`), servicio con el modelo de Mongoose y controlador con ids de texto. Hubo un error de TypeScript en el `transform` del esquema, que se resolvió tipando el parámetro como `Record<string, any>`.
21. **Fase 3, comprobación:**
    - **Con `curl`:** la BD empieza vacía ✅, POST devuelve `id` de texto y `createdAt` ✅, GET /:id ✅, PUT ✅, DELETE ✅, 404 tras borrar ✅.
    - **Con `mongosh`:** se ve el documento guardado con su `_id` y `ISODate` ✅.
    - **Persistencia:** se paró el backend del todo y se volvió a arrancar, y el producto seguía ahí ✅.
    - **Frontend:** `git diff` sin cambios ✅.
    - **Quedó un producto de prueba, "Monitor 27"**, en la BD.
    - Falta la prueba del usuario en el navegador.
22. Claude abrió la web. El usuario creó "Prueba fase 3" y pidió reiniciar el backend. Claude lo paró del todo y lo arrancó de nuevo, y los 2 productos seguían ahí. El usuario dio el **visto bueno de la fase 3**: **proyecto completo**.
23. Commit **`fase3`** (el nombre lo eligió Claude) y push.
24. **Tests:** el usuario pidió tests del CRUD "full stack". Claude propuso A (API), B (navegador) o A + B y una BD de test aparte, y el usuario respondió "lo que quieras".
    - **A (API):** `MONGODB_URI` configurable, `vitest.config.e2e.ts` con `catalog_test` y `backend/test/products.e2e-spec.ts`. **9/9 tests pasan.** Sin errores de tipos (`tsc`). `catalog` sin tocar (seguía con 2 productos).
    - **B (navegador):** carpeta `/e2e` con Playwright 1.65.1 y el Chrome del Mac, `playwright.config.js` y `tests/crud.spec.js`. **2/2 tests pasan**, y tras ellos `catalog` seguía con sus 2 productos.
    - Se corrigió una comprobación del test B que podía darse por buena antes de que cargara la tabla: ahora espera a la respuesta de la API.
    - **Prueba de que los tests detectan fallos:** se estropeó a propósito el `update` del servicio (`returnDocument: 'before'`) y falló justo el test de editar (1 failed / 8 passed). Después se restauró y volvieron a pasar 9/9.
    - Commit **`tests`** (el nombre lo eligió Claude) y push.

---

## 4. Pendientes y dudas abiertas
- [x] Paso 4: borrar (comprobado).
- [x] Paso 5: editar (comprobado).
- [x] Fase 1 completa y comprobada.
- [x] Visto bueno para empezar la fase 2 (dado al irse al descanso).
- [x] Commit `fase1 completa`.
- [x] Primer push a GitHub.
- [x] Fase 2 hecha y API probada con `curl`.
- [x] El usuario prueba la fase 2 en el navegador: funciona.
- [x] Commit y push de la fase 2 (`fase2`).
- [x] Visto bueno para empezar la fase 3.
- [x] Fase 3: MongoDB instalado y backend conectado con Mongoose; probado con `curl`, `mongosh` y reiniciando el backend.
- [x] El usuario prueba la fase 3 en el navegador y da el visto bueno.
- [x] Commit y push de la fase 3 (`fase3`).
- [x] Tests del CRUD full stack: 9 de la API + 2 en el navegador, todos pasan.
- [x] Commit y push de los tests (`tests`).
- [ ] (Opcional) Borrar el producto de prueba "Monitor 27".
- [ ] **Revocar el token** que se pegó en el chat (GitHub → Settings → Developer settings → Fine-grained tokens), crear uno nuevo y, en el próximo push, introducirlo desde la app Terminal (o pedírselo a Claude para que actualice el llavero sin pegarlo en el chat).
