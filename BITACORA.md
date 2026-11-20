# Bitácora del proyecto

Diario del proyecto: dónde estamos, qué se ha decidido y qué se ha hecho.
Se lee al empezar cada sesión y se actualiza al terminar cada paso o al tomar una decisión.

---

## 1. Estado actual

- **Fase 1** (frontend solo): **TERMINADA y comprobada** el 20/11/2026.
- **Fase 2** (backend NestJS): **TERMINADA y comprobada** el 20/11/2026. La hizo Claude durante el descanso del usuario; las decisiones están marcadas con *(fase 2, Claude)*. El usuario la probó en el navegador y dio el visto bueno.
- **Siguiente:** **fase 3 (MongoDB)**. El usuario la ha pedido; primero hay que decidir cómo instalar MongoDB en local.
- **Git:** commits `fase1`, `fase1 completa`, `bitácora: subida a GitHub…` y `fase2`, en `origin/main`.
- **⚠️ Seguridad pendiente:** el token se pegó en el chat, así que hay que **revocarlo y crear otro** (ver Pendientes).

### Cómo arrancar y ver la aplicación (fase 2)
Hacen falta **dos servidores**, cada uno en su propia ventana de la app Terminal:
1. **Backend (API):** `cd backend` y `npm run start:dev` → http://localhost:3000/products (se reinicia solo al guardar cambios).
2. **Frontend:** desde la raíz del proyecto, `npx serve frontend -l 8080` → abrir **http://localhost:8080**.
- Para pararlos: `Ctrl + C` en cada ventana.
- Si el backend no está arrancado, la web muestra el aviso "No se puede conectar con el backend…".
- Al reiniciar el backend se pierden los productos añadidos y vuelven los 2 de ejemplo (viven en memoria del backend). Recargar la web **ya no** los borra.

### Ficheros actuales
| Fichero | Qué es | Estado |
|---|---|---|
| `CLAUDE.md` | Instrucciones del proyecto (objetivo, stack, fases, forma de trabajar) | — |
| `BITACORA.md` | Este diario | — |
| `.gitignore` | Ficheros que git ignora: `.DS_Store`, `node_modules/`, `dist/`, `*.tsbuildinfo` | — |
| `frontend/index.html` | Estructura: formulario y tabla | Terminado |
| `frontend/styles.css` | Apariencia: tarjetas blancas, acento índigo, adaptado a móvil | Terminado |
| `frontend/app.js` | Comportamiento: pide y envía los productos a la API con `fetch` (fase 2) | Hecho, falta prueba del usuario |
| `backend/src/main.ts` | Punto de entrada: arranca la API en el puerto 3000 con CORS activado | Hecho |
| `backend/src/app.module.ts` | Módulo raíz: "enchufa" el módulo de productos | Hecho |
| `backend/src/products/product.ts` | Forma de los datos: clases `Product` y `ProductInput` | Hecho |
| `backend/src/products/products.controller.ts` | Rutas HTTP: GET/POST `/products`, GET/PUT/DELETE `/products/:id` | Hecho |
| `backend/src/products/products.service.ts` | Lógica y datos: array en memoria del backend con los 2 de ejemplo | Hecho |
| `backend/src/products/products.module.ts` | Agrupa el controlador y el servicio de productos | Hecho |
| `backend/package.json`, `tsconfig*.json`, `nest-cli.json`… | Configuración generada por el CLI de Nest | Generado |

### Entorno (comprobado el 19/11/2026)
| Herramienta | Estado |
|---|---|
| Sistema | macOS 15.5 |
| Navegadores | Google Chrome y Safari |
| Node / npm / npx | v26.13.1 / 11.20.0 / 11.20.0 (para la fase 2) |
| MongoDB (`mongod`, `mongosh`) | No instalado (para la fase 3) |
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
16. El usuario pidió commit, push y empezar la fase 3. Se hizo el commit **`fase2`** (el nombre lo eligió Claude) y el push.

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
- [ ] Fase 3: decidir cómo instalar MongoDB, instalarlo y conectar el backend con Mongoose.
- [ ] **Revocar el token** que se pegó en el chat (GitHub → Settings → Developer settings → Fine-grained tokens), crear uno nuevo y, en el próximo push, introducirlo desde la app Terminal (o pedírselo a Claude para que actualice el llavero sin pegarlo en el chat).
- Para la fase 3 habrá que decidir cómo instalar MongoDB en local, porque ahora no está instalado.
