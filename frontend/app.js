// =========================================================
// DATOS EN MEMORIA
// Los productos viven en este array. Al recargar la página
// se pierde todo lo añadido y vuelven los 2 de ejemplo.
// =========================================================
let products = [
  {
    id: 1,
    name: "MacBook Air 13",
    category: "Portátiles",
    price: 1199.99,
    description: "Portátil ligero con chip M3 y 16 GB de RAM.",
    createdAt: "2026-11-10T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Auriculares inalámbricos",
    category: "Audio",
    price: 89.9,
    description: "Con cancelación de ruido y 30 horas de batería.",
    createdAt: "2026-11-15T17:30:00.000Z"
  }
];

// Siguiente id que se asignará a un producto nuevo
let nextId = 3;

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

// =========================================================
// LISTAR: dibuja la tabla a partir del array
// =========================================================
function renderProducts() {
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
// Si no estamos editando, CREA un producto; si sí, lo ACTUALIZA.
// =========================================================
form.addEventListener("submit", function (event) {
  // Evita que el navegador recargue la página (su comportamiento por defecto)
  event.preventDefault();

  if (editingId === null) {
    // CREAR: construimos el producto con los valores del formulario
    const newProduct = {
      id: nextId,
      name: nameInput.value.trim(),
      category: categoryInput.value,
      price: Number(priceInput.value),
      description: descriptionInput.value.trim(),
      createdAt: new Date().toISOString()
    };
    nextId = nextId + 1;
    products.push(newProduct);
  } else {
    // EDITAR: buscamos el producto y cambiamos sus datos.
    // El id y la fecha de creación no cambian.
    const product = products.find(function (item) {
      return item.id === editingId;
    });
    product.name = nameInput.value.trim();
    product.category = categoryInput.value;
    product.price = Number(priceInput.value);
    product.description = descriptionInput.value.trim();
  }

  renderProducts();

  // Dejamos el formulario limpio y en modo "Nuevo producto"
  resetForm();
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
// BORRAR: quita un producto del array a partir de su id
// =========================================================
function deleteProduct(id) {
  // Pedimos confirmación; si el usuario cancela, no hacemos nada
  const confirmed = confirm("¿Seguro que quieres borrarlo?");
  if (!confirmed) {
    return;
  }

  // filter crea un array nuevo con todos los productos MENOS el del id indicado
  products = products.filter(function (product) {
    return product.id !== id;
  });

  // Si borramos el producto que se estaba editando, salimos del modo edición
  if (id === editingId) {
    resetForm();
  }

  renderProducts();
}

// =========================================================
// INICIO: al cargar la página, pintamos los productos de ejemplo
// =========================================================
renderProducts();
