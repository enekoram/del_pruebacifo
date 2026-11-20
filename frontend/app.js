// =========================================================
// DIRECCIÓN DE LA API (FASE 2)
// Los productos ya no viven aquí: los guarda el backend.
// Este fichero se los pide y le envía los cambios con fetch.
// =========================================================
const API_URL = "http://localhost:3000/products";

// id del producto que se está editando (null = estamos creando uno nuevo)
let editingId = null;

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
// CARGAR: pide la lista al backend (GET /products) y la dibuja
// =========================================================
async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    showConnectionError(error);
  }
}

// =========================================================
// LISTAR: dibuja la tabla a partir de la lista recibida
// =========================================================
function renderProducts(products) {
  // Vaciamos la tabla y la volvemos a llenar desde cero
  productList.innerHTML = "";

  for (const product of products) {
    const row = document.createElement("tr");

    // Una celda por cada dato del producto.
    // Usamos textContent para que el texto se muestre tal cual.
    addCell(row, product.name);
    addCell(row, product.category);
    addCell(row, formatPrice(product.price));
    addCell(row, product.description || "—");
    addCell(row, formatDate(product.createdAt));

    // Celda de acciones: botones Editar y Borrar
    const actionsCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.className = "button-edit";
    // Al pulsarlo, carga ESTE producto en el formulario
    editButton.addEventListener("click", function () {
      startEditing(product);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Borrar";
    deleteButton.className = "button-delete";
    // Al pulsarlo, borra ESTE producto (le pasamos su id)
    deleteButton.addEventListener("click", function () {
      deleteProduct(product.id);
    });

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);

    productList.appendChild(row);
  }
}

// Crea una celda <td> con un texto y la añade a la fila
function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
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
