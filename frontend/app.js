// =========================================================
// DIRECCIÓN DE LA API
// Los productos no viven aquí: los guarda el backend (en MongoDB).
// Este fichero se los pide y le envía los cambios con fetch.
// API_BASE_URL viene de config.js (local o Render).
// =========================================================
const API_URL = API_BASE_URL + "/products";

// id del producto que se está editando (null = estamos creando uno nuevo)
let editingId = null;

// =========================================================
// CATEGORÍAS: nombre, clase CSS (para su color) e icono SVG
// El orden de esta lista es el orden de las barras del gráfico.
// =========================================================
const CATEGORIES = [
  {
    name: "Portátiles",
    cssClass: "category-laptops",
    icon: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>'
  },
  {
    name: "Móviles",
    cssClass: "category-phones",
    icon: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'
  },
  {
    name: "Periféricos",
    cssClass: "category-peripherals",
    icon: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v4"/>'
  },
  {
    name: "Audio",
    cssClass: "category-audio",
    icon: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>'
  },
  {
    name: "Otros",
    cssClass: "category-others",
    icon: '<path d="M21 8 12 3 3 8l9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>'
  }
];

// Otros iconos que usan las tarjetas de producto
const ICON_EDIT = '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>';
const ICON_DELETE = '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>';
const ICON_CALENDAR = '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>';

// Envuelve el dibujo de un icono en su etiqueta <svg>
function svgIcon(drawing) {
  return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + drawing + "</svg>";
}

// Busca los datos de una categoría por su nombre (si no existe, usa "Otros")
function findCategory(name) {
  const category = CATEGORIES.find(function (item) {
    return item.name === name;
  });
  return category || CATEGORIES[CATEGORIES.length - 1];
}

// =========================================================
// REFERENCIAS A ELEMENTOS DEL HTML (por su id)
// =========================================================
const form = document.getElementById("product-form");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");
const productList = document.getElementById("product-list");
const formTitle = document.getElementById("form-title");
const cancelButton = document.getElementById("cancel-button");
const formCard = document.getElementById("form-card");
const categoryChart = document.getElementById("category-chart");
const statCount = document.getElementById("stat-count");
const statTotal = document.getElementById("stat-total");
const statAverage = document.getElementById("stat-average");
const statCategories = document.getElementById("stat-categories");

// =========================================================
// FUNCIONES DE FORMATO (cómo se muestran los datos)
// =========================================================

// 1199.99 -> "1199,99 €"
function formatPrice(price) {
  return price.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

// "2026-11-10T10:00:00.000Z" -> "10/11/2026"
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("es-ES");
}

// Aviso común cuando el backend no responde
function showConnectionError(error) {
  console.error(error);
  alert("No se puede conectar con el backend. ¿Está arrancado en " + API_URL + "?");
}

// =========================================================
// CARGAR: pide la lista al backend (GET /products) y pinta
// las tres zonas que dependen de ella: resumen, gráfico y listado
// =========================================================
async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    renderStats(products);
    renderChart(products);
    renderProducts(products);
  } catch (error) {
    showConnectionError(error);
  }
}

// =========================================================
// RESUMEN: las 4 tarjetas de arriba
// =========================================================
function renderStats(products) {
  // Suma de todos los precios
  let total = 0;
  for (const product of products) {
    total = total + product.price;
  }

  // Precio medio (si no hay productos, 0 para no dividir entre 0)
  let average = 0;
  if (products.length > 0) {
    average = total / products.length;
  }

  // Categorías distintas que tienen al menos un producto
  const usedCategories = [];
  for (const product of products) {
    if (!usedCategories.includes(product.category)) {
      usedCategories.push(product.category);
    }
  }

  statCount.textContent = products.length;
  statTotal.textContent = formatPrice(total);
  statAverage.textContent = formatPrice(average);
  statCategories.textContent = usedCategories.length;
}

// =========================================================
// GRÁFICO: una barra por categoría. La barra más larga es la
// categoría con más productos; el resto, en proporción.
// =========================================================
function renderChart(products) {
  categoryChart.innerHTML = "";

  // 1. Contamos cuántos productos hay de cada categoría
  const counts = {};
  for (const category of CATEGORIES) {
    counts[category.name] = 0;
  }
  for (const product of products) {
    const category = findCategory(product.category);
    counts[category.name] = counts[category.name] + 1;
  }

  // 2. El máximo marca el 100 % del ancho (mínimo 1 para no dividir entre 0)
  let max = 1;
  for (const category of CATEGORIES) {
    if (counts[category.name] > max) {
      max = counts[category.name];
    }
  }

  // 3. Dibujamos una fila por categoría: etiqueta | barra | número
  for (const category of CATEGORIES) {
    const count = counts[category.name];

    const row = document.createElement("div");
    row.className = "chart-row " + category.cssClass;

    const label = document.createElement("span");
    label.className = "chart-label";
    label.innerHTML = svgIcon(category.icon);
    label.append(category.name);

    const track = document.createElement("div");
    track.className = "chart-track";
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.width = (count / max) * 100 + "%";
    track.appendChild(bar);

    const value = document.createElement("span");
    value.className = "chart-value";
    value.textContent = count;

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(value);
    categoryChart.appendChild(row);
  }
}

// =========================================================
// LISTADO: una tarjeta por producto dentro del grid
// =========================================================
function renderProducts(products) {
  // Vaciamos el listado y lo volvemos a llenar desde cero
  productList.innerHTML = "";

  if (products.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "Todavía no hay productos. ¡Crea el primero con el formulario!";
    productList.appendChild(empty);
    return;
  }

  for (const product of products) {
    const category = findCategory(product.category);

    const card = document.createElement("article");
    card.className = "product-card " + category.cssClass;

    // --- Cabecera: etiqueta de categoría + fecha ---
    const header = document.createElement("div");
    header.className = "product-card-header";

    const badge = document.createElement("span");
    badge.className = "category-badge";
    badge.innerHTML = svgIcon(category.icon);
    badge.append(product.category);

    const date = document.createElement("span");
    date.className = "product-date";
    date.innerHTML = svgIcon(ICON_CALENDAR);
    date.append(formatDate(product.createdAt));

    header.appendChild(badge);
    header.appendChild(date);

    // --- Nombre y descripción ---
    // Usamos textContent / append para que el texto se muestre tal cual
    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description || "Sin descripción";

    // --- Pie: precio + botones ---
    const footer = document.createElement("div");
    footer.className = "product-card-footer";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const editButton = document.createElement("button");
    editButton.className = "button-edit";
    editButton.innerHTML = svgIcon(ICON_EDIT);
    editButton.append("Editar");
    // Al pulsarlo, carga ESTE producto en el formulario
    editButton.addEventListener("click", function () {
      startEditing(product);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "button-delete";
    deleteButton.innerHTML = svgIcon(ICON_DELETE);
    deleteButton.append("Borrar");
    // Al pulsarlo, borra ESTE producto (le pasamos su id)
    deleteButton.addEventListener("click", function () {
      deleteProduct(product.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    footer.appendChild(price);
    footer.appendChild(actions);

    // --- Montamos la tarjeta ---
    card.appendChild(header);
    card.appendChild(name);
    card.appendChild(description);
    card.appendChild(footer);
    productList.appendChild(card);
  }
}

// =========================================================
// GUARDAR: se ejecuta al enviar el formulario.
// Si no estamos editando, CREA (POST); si sí, ACTUALIZA (PUT).
// =========================================================
form.addEventListener("submit", async function (event) {
  // Evita que el navegador recargue la página (su comportamiento por defecto)
  event.preventDefault();

  // Datos del formulario. El id y la fecha los pone el backend.
  const productData = {
    name: nameInput.value.trim(),
    category: categoryInput.value,
    price: Number(priceInput.value),
    description: descriptionInput.value.trim()
  };

  try {
    if (editingId === null) {
      // CREAR: POST /products
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
    } else {
      // EDITAR: PUT /products/:id
      await fetch(API_URL + "/" + editingId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
    }
  } catch (error) {
    showConnectionError(error);
    return;
  }

  // Dejamos el formulario limpio y volvemos a pedir la lista al backend
  resetForm();
  await loadProducts();
});

// =========================================================
// EDITAR: rellena el formulario con los datos de un producto
// =========================================================
function startEditing(product) {
  editingId = product.id;

  nameInput.value = product.name;
  categoryInput.value = product.category;
  priceInput.value = product.price;
  descriptionInput.value = product.description;

  // El formulario cambia a modo edición
  formTitle.textContent = "Editando: " + product.name;
  cancelButton.hidden = false;

  // Subimos hasta el formulario, que puede estar fuera de la pantalla
  formCard.scrollIntoView({ behavior: "smooth" });
}

// Deja el formulario vacío y en modo "Nuevo producto"
function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = "Nuevo producto";
  cancelButton.hidden = true;
}

// El botón Cancelar abandona la edición sin guardar
cancelButton.addEventListener("click", function () {
  resetForm();
});

// =========================================================
// BORRAR: DELETE /products/:id
// =========================================================
async function deleteProduct(id) {
  // Pedimos confirmación; si el usuario cancela, no hacemos nada
  const confirmed = confirm("¿Seguro que quieres borrarlo?");
  if (!confirmed) {
    return;
  }

  try {
    await fetch(API_URL + "/" + id, { method: "DELETE" });
  } catch (error) {
    showConnectionError(error);
    return;
  }

  // Si borramos el producto que se estaba editando, salimos del modo edición
  if (id === editingId) {
    resetForm();
  }

  await loadProducts();
}

// =========================================================
// INICIO: al cargar la página, pedimos los productos al backend
// =========================================================
loadProducts();
