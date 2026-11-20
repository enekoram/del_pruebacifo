# Bitácora del proyecto

Diario del proyecto: dónde estamos, qué se ha decidido y qué se ha hecho.
Se lee al empezar cada sesión y se actualiza al terminar cada paso o al tomar una decisión.

---

## 1. Estado actual

- **Fase:** 1 · Frontend solo. **TERMINADA y comprobada** el 20/11/2026 (los 5 pasos, CRUD completo en memoria).
- **Siguiente:** esperar el visto bueno del usuario para empezar la **fase 2 (backend NestJS)**. No se empieza hasta que lo dé.
- **Git:** commits `fase1` (pasos 1-4) y `fase1 completa` (paso 5 + CLAUDE.md + bitácora). Remoto `origin` en GitHub. Pendiente: el primer push, que hace el usuario desde la app Terminal con su token.
- **Cómo ver la web:** doble clic en `frontend/index.html`, o escribir `! open frontend/index.html` en el prompt.

### Ficheros actuales
| Fichero | Qué es | Estado |
|---|---|---|
| `CLAUDE.md` | Instrucciones del proyecto (objetivo, stack, fases, forma de trabajar) | — |
| `BITACORA.md` | Este diario | — |
| `.gitignore` | Ficheros que git ignora (de momento `.DS_Store`) | — |
| `frontend/index.html` | Estructura: formulario y tabla | Terminado |
| `frontend/styles.css` | Apariencia: tarjetas blancas, acento índigo, adaptado a móvil | Terminado |
| `frontend/app.js` | Comportamiento: array en memoria y CRUD completo (listar, crear, editar, borrar) | Terminado |

### Entorno (comprobado el 19/11/2026)
| Herramienta | Estado |
|---|---|
| Sistema | macOS 15.5 |
| Navegadores | Google Chrome y Safari |
| Node / npm / npx | v26.13.1 / 11.20.0 / 11.20.0 (para la fase 2) |
| MongoDB (`mongod`, `mongosh`) | No instalado (para la fase 3) |
| Git | 2.39.5 (Apple Git-154), instalado el 20/11/2026 con las Command Line Tools de Xcode |
| Python | Debería estar disponible desde el 20/11/2026 (viene con las Command Line Tools); no comprobado |

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

### 20/11/2026 · Sesión 2
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

---

## 4. Pendientes y dudas abiertas
- [x] Paso 4: borrar (comprobado).
- [x] Paso 5: editar (comprobado).
- [x] Fase 1 completa y comprobada.
- [ ] Visto bueno del usuario para empezar la fase 2.
- [x] Commit `fase1 completa`.
- [ ] Primer push a GitHub (lo hace el usuario con su token).
- Para la fase 2 habrá que hablar de cómo crear el proyecto NestJS (CLI, dependencias) antes de instalar nada.
- Para la fase 3 habrá que decidir cómo instalar MongoDB en local, porque ahora no está instalado.
