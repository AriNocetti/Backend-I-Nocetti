document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();  // Evita el envío de formularios
            event.stopPropagation(); // Evita propagación de eventos

            const productId = event.target.dataset.id;
            const userCartIdElement = document.getElementById("userCartId");
            if (!userCartIdElement) {
                Swal.fire("Error", "No se pudo encontrar el ID del carrito.", "error");
                return;
            }

            const cartId = userCartIdElement.value;
            if (!cartId) {
                Swal.fire("Error", "No se pudo encontrar el ID del carrito.", "error");
                return;
            }

            console.log('Adding product to cart:', { productId, cartId });

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    Swal.fire("Agregado", "Producto agregado correctamente.", "success");
                } else {
                    const error = await response.json();
                    Swal.fire("Error", error.message || "No se pudo agregar el producto al carrito.", "error");
                }
            } catch (error) {
                console.error("Error al agregar al carrito:", error);
                Swal.fire("Error", "El producto no se ha agregado al carrito.", "error");
            }
        });
    });
});