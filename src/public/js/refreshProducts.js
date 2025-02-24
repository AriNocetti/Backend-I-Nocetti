const socket = io();

socket.on('productCreated', (productos) => {
    console.log('Producto creado', productos)
    renderProducts(productos)
    document.getElementById("productForm").reset();
})

socket.on('productDeleted', (productos) => {
    console.log('Producto borrado')
    renderProducts(productos)
})

function renderProducts(productos) {
const productosLista = document.getElementById("productosLista");
productosLista.innerHTML = ""; // Limpiar lista antes de actualizar

productos.forEach(producto => {
    const li = document.createElement("li");
    li.classList.add("product-card");
    li.setAttribute("data-id", producto.id);

    // Estructura HTML de la card, similar a tu template
    li.innerHTML = `
        <div class="image-container">
            ${producto.thumbnails.length ? 
                `<img class="product-image" src="${producto.thumbnails[0]}" alt="Imagen de ${producto.title}">` : 
                `<p class="no-image">Sin imagen disponible</p>`
            }
        </div>
        <div class="card-body">
            <h3 class="product-title">${producto.title}</h3>
            <p><strong>Descripción:</strong> ${producto.description}</p>
            <p><strong>Código:</strong> ${producto.code}</p>
            <p><strong>Precio:</strong> $${producto.price}</p>
            <p><strong>Stock:</strong> ${producto.stock} unidades</p>
            <p><strong>Categoría:</strong> ${producto.category}</p>
            <p class="product-status ${producto.status ? 'available' : 'out-of-stock'}">
                ${producto.status ? 'Disponible' : 'Agotado'}
            </p>
            <button class="delete-product-btn" data-id="${producto.id}">Eliminar</button> <!-- Botón de eliminar -->
        </div>
    `;

    productosLista.appendChild(li);
});
}