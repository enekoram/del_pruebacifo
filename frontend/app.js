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

// =========================================================
// REFERENCIAS A ELEMENTOS DEL HTML (por su id)
// =========================================================
const form = document.getElementById("product-form");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");
const productList = document.getElementById("product-list");

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

    // Celda de acciones (el botón Editar se activará en el paso 5)
    const actionsCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.className = "button-edit";

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
// CREAR: se ejecuta al enviar el formulario
// =========================================================
form.addEventListener("submit", function (event) {
  // Evita que el navegador recargue la página (su comportamiento por defecto)
  event.preventDefault();

  // Construimos el producto con los valores del formulario
  const newProduct = {
    id: nextId,
    name: nameInput.value.trim(),
    category: categoryInput.value,
    price: Number(priceInput.value),
    description: descriptionInput.value.trim(),
    createdAt: new Date().toISOString()
  };
  nextId = nextId + 1;

  // Lo guardamos en el array y redibujamos la tabla
  products.push(newProduct);
  renderProducts();

  // Dejamos el formulario limpio para el siguiente producto
  form.reset();
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

  renderProducts();
}

// =========================================================
// INICIO: al cargar la página, pintamos los productos de ejemplo
// =========================================================
renderProducts();
