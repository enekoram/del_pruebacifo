# Guía de despliegue: Render + MongoDB Atlas + GitHub Actions

Cómo publicar en internet el catálogo (frontend + backend + base de datos)
usando solo planes **gratuitos**.

## ✅ Estado actual (desplegado el 20/11/2026)

| Pieza | Dirección / identificador |
|---|---|
| **Web** (Render Static Site `catalogo-web`) | https://catalogo-web-apu4.onrender.com · `srv-dc042v3rjlhs7387qgsg` |
| **API** (Render Web Service `catalogo-api`, free, Frankfurt) | https://catalogo-api-gqrj.onrender.com/products · `srv-dc042rlg1s2s73e3p26g` |
| **Base de datos** | MongoDB Atlas, "Project 0" → `Cluster0` (M0, AWS París), BD `catalog`, usuario `catalogo_app` (solo `readWrite@catalog`) |
| **CI/CD** | GitHub Actions `.github/workflows/ci-cd.yml` → si los tests pasan, llama a la API de Render (secreto `RENDER_API_KEY`) |

Cómo se montó: Claude lo hizo por línea de comandos (Atlas CLI, GitHub CLI y la API de Render) en lugar de usar el Blueprint, con los mismos ajustes que `render.yaml`. Los secretos están en `~/.catalogo-secrets/` (en el Mac del usuario), en Render y en GitHub Secrets; nunca en el repositorio. Los pasos 1-4 de abajo explican cómo hacerlo **a mano** desde cero.

---

## 0. La idea general

```
                       ┌──────────────── GitHub ────────────────┐
  git push ──────────▶ │  repositorio  ──▶  GitHub Actions       │
                       │                   1. tests (API + web)  │
                       │                   2. si pasan → avisa   │
                       └────────────────────────┬───────────────┘
                                                │ API de Render
                         ┌──────────────────────┴──────────────────────┐
                         ▼                                             ▼
  navegador ──▶  catalogo-web (Render, Static Site)  ──fetch──▶  catalogo-api (Render, Web Service)
                 index.html, styles.css, app.js,                 NestJS
                 config.js (dirección de la API)                    │ Mongoose
                                                                    ▼
                                                        MongoDB Atlas (cluster M0 gratis)
```

| Pieza | En local | En internet | Plan |
|---|---|---|---|
| Frontend | `npx serve` (puerto 8080) | Render **Static Site** `catalogo-web` | Gratis |
| Backend | `npm run start:dev` (puerto 3000) | Render **Web Service** `catalogo-api` | Free |
| Base de datos | `mongod` en `~/mongodb` | **MongoDB Atlas** (Render no ofrece MongoDB) | M0 gratis |
| Tests + despliegue | `npm run test:e2e`, `npm test` | **GitHub Actions** (`.github/workflows/ci-cd.yml`) | Gratis (repo público) |

### Ficheros que intervienen
- **`render.yaml`**: el *Blueprint*, que describe los 2 servicios de Render.
- **`.github/workflows/ci-cd.yml`**: el flujo de GitHub Actions. Primero pasa los tests y, si pasan, despliega.
- **`frontend/config.js`**: la dirección de la API. En local vale `http://localhost:3000`, y Render lo reescribe al construir la web.
- **`backend/src/main.ts`**: escucha en el puerto que indique la variable `PORT`, que la asigna Render.
- **`backend/src/app.module.ts`**: se conecta a la base de datos que indique la variable `MONGODB_URI`, que en Render apunta a Atlas.

### Limitaciones del plan gratuito (normal, no es un fallo)
- **El backend se "duerme"** tras unos 15 minutos sin visitas. La primera petición después tarda entre **30 y 60 segundos** en despertarlo, y mientras tanto la web aparece vacía. Si te sale el aviso "No se puede conectar…", espera un poco y recarga.
- **Atlas M0** da 512 MB de almacenamiento, más que suficiente para este proyecto.

---

## 1. MongoDB Atlas (la base de datos en la nube)

1. Entra en https://www.mongodb.com/cloud/atlas/register y crea una cuenta (o entra con Google).
2. **Create a cluster** y elige **M0 (Free)**. Como proveedor, AWS; como región, una de Europa (por ejemplo, Frankfurt `eu-central-1`, la misma que Render). Ponle de nombre `catalogo`.
3. **Usuario de la base de datos:** en *Database Access* → *Add New Database User*:
   - Usuario: `catalogo_app`.
   - Contraseña: pulsa **Autogenerate** y **guárdala**. Mejor si solo tiene letras y números, para no tener que codificarla en la URL.
   - Rol: *Read and write to any database*.
4. **Acceso de red:** en *Network Access* → *Add IP Address* → **Allow access from anywhere** (`0.0.0.0/0`).
   - ⚠️ Hace falta porque las IPs del plan gratuito de Render cambian. La protección queda en el usuario y la contraseña.
5. **Cadena de conexión:** *Database* → *Connect* → *Drivers*. Copia algo como:
   ```
   mongodb+srv://catalogo_app:<password>@catalogo.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=catalogo
   ```
   Cambia `<password>` por la contraseña y **añade el nombre de la base de datos `catalog`** justo después de `.net/`:
   ```
   mongodb+srv://catalogo_app:TU_PASSWORD@catalogo.xxxxx.mongodb.net/catalog?retryWrites=true&w=majority&appName=catalogo
   ```
   Esa es tu **`MONGODB_URI`**. Es un secreto: no la subas a git ni la pegues en el chat.

---

## 2. GitHub: un token nuevo con permiso para workflows

El token antiguo **se pegó en el chat**, así que hay que revocarlo. Además, para subir ficheros de `.github/workflows/` GitHub exige un permiso extra.

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**.
2. **Borra** el token antiguo (`actividad01` o el nombre que tenga).
3. **Generate new token**:
   - Repository access: *Only select repositories* → `del_pruebacifo`.
   - Permissions → **Contents: Read and write** y **Workflows: Read and write**.
4. Actualiza el llavero de macOS. En la app **Terminal** (no en el chat):
   ```
   cd ~/Documents/proyectos/actividad01
   printf "protocol=https\nhost=github.com\n\n" | git credential reject
   git push
   ```
   Te pedirá **Username** (`enekoram`) y **Password**: ahí pegas el **token nuevo**.

Con esto el código, incluido el workflow, queda subido. Ese primer push lanza GitHub Actions: el job de tests debería pasar, y el de despliegue **fallará** porque aún no existen los servicios ni el secreto `RENDER_API_KEY`. Es normal; se arregla en el paso 4.

---

## 3. Render: crear los dos servicios con el Blueprint

1. Entra en https://dashboard.render.com con tu cuenta (free tier).
2. **New** → **Blueprint**. Conecta tu cuenta de GitHub si te lo pide y elige el repositorio **`enekoram/del_pruebacifo`**.
3. Render lee `render.yaml` y muestra los 2 servicios: `catalogo-api` y `catalogo-web`. Te pedirá los valores secretos (`sync: false`):
   - **`MONGODB_URI`**: la cadena de Atlas del paso 1.5.
   - **`API_BASE_URL`**: escribe `https://catalogo-api.onrender.com`. Si ese nombre ya estuviera ocupado, Render añadirá un sufijo; en ese caso lo corriges en el paso 3.5.
4. **Apply**. Render construye y arranca los dos servicios; mira los **Logs** de cada uno.
   - En `catalogo-api` tiene que aparecer `API escuchando en el puerto …`.
5. **Comprueba la dirección real de la API:** abre `catalogo-api` y copia su URL de arriba (por ejemplo, `https://catalogo-api-abcd.onrender.com`).
   - Abre `https://…onrender.com/products` en el navegador: debe salir `[]` o la lista de productos.
   - Si la URL **no** coincide con lo que pusiste en `API_BASE_URL`: ve a `catalogo-web` → **Environment** → corrige `API_BASE_URL` (sin `/products` ni barra final) → **Manual Deploy** → *Deploy latest commit*.
6. Abre la URL de **`catalogo-web`**: debe salir el catálogo y poder crear, editar y borrar.

> Si al aplicar el Blueprint Render se queja del campo `autoDeployTrigger`, bórralo de `render.yaml` y, en cada servicio, pon **Settings → Auto-Deploy → Off** a mano.

---

## 4. Conectar GitHub Actions con Render (API key)

GitHub Actions, cuando los tests pasan, hace un `POST /v1/services/<id>/deploys` a la **API de Render** por cada servicio. Para eso necesita una API key de Render.

1. En Render: **Account Settings** → **API Keys** → **Create API Key** → cópiala.
2. En GitHub, el repositorio → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - Name: **`RENDER_API_KEY`**. Value: la API key.
3. En `.github/workflows/ci-cd.yml`, `BACKEND_SERVICE_ID` y `FRONTEND_SERVICE_ID` deben ser los ids (`srv-…`) de tus servicios. Salen en la URL del panel de cada servicio.
4. Prueba el flujo completo: en GitHub → pestaña **Actions** → el último *CI/CD* → **Re-run all jobs**. También puedes hacer cualquier commit y push.
   - ✅ `Tests (API + navegador)` en verde → ✅ `Desplegar en Render` en verde → en Render aparece un deploy nuevo en cada servicio.

> Alternativa con menos permisos: los **deploy hooks** (*Settings → Deploy Hook* de cada servicio) solo permiten desplegar ese servicio, mientras que una API key da acceso a toda la cuenta. No se usaron porque la API de Render no permite leerlos, así que habría que copiarlos a mano.

---

## 5. El día a día a partir de ahora

1. Trabajas en local como siempre (MongoDB, backend y web; ver BITACORA.md).
2. `git commit` + `git push` a `main`.
3. GitHub Actions pasa los tests. **Si fallan, no se despliega nada** y la web en internet sigue con la versión anterior.
4. Si pasan, Render despliega la API y la web.

Dónde mirar si algo va mal:

| Síntoma | Dónde mirar | Causa habitual |
|---|---|---|
| El push se rechaza con *"refusing to allow a Personal Access Token to create or update workflow"* | Terminal | Al token le falta el permiso **Workflows** (paso 2) |
| Falla el job de tests | GitHub → Actions → el job → el paso en rojo | Un test roto: reprodúcelo en local con `npm run test:e2e` / `npm test` |
| Falla el job de despliegue (401 o 404) | GitHub → Actions | Falta el secreto `RENDER_API_KEY`, la key se revocó o un `*_SERVICE_ID` es incorrecto |
| La API no arranca en Render (`MongoServerSelectionError`, `bad auth`) | Render → `catalogo-api` → Logs | `MONGODB_URI` mal escrita, contraseña incorrecta o falta `0.0.0.0/0` en Atlas |
| La web carga pero sale "No se puede conectar con el backend…" | Consola del navegador (`Cmd + Option + J`) | Backend dormido (espera 1 minuto) o `API_BASE_URL` incorrecta en `catalogo-web` |
| La web sale sin datos y sin errores | Abre `https://catalogo-api…/products` | Es correcto: la base de datos de Atlas empieza vacía |

---

## 6. Seguridad (léelo)
- La API **no tiene login**: cualquiera que conozca la URL puede crear o borrar productos. Para un proyecto de aprendizaje vale, pero no metas datos reales.
- Los secretos (`MONGODB_URI`, la API key de Render y los tokens) viven **solo** en Render, en GitHub Secrets y en el llavero. Nunca en el código ni en el chat.
- Para dejarlo todo apagado: en Render, *Suspend* en cada servicio. En Atlas, puedes borrar el cluster.
