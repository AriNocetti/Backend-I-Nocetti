document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    addToCartButtons.forEach(button => {

        button.addEventListener("click", async (event) => {
            event.preventDefault();  // Evita el envío de formularios
            event.stopPropagation(); // Evita propagación de eventos

            const productId = event.target.dataset.id;
            const cartTitleElement = document.getElementById("cart-title");
            if (!cartTitleElement) return;

            const cartId = cartTitleElement.getAttribute("cart-id");
            // console.log('un foreach', productId, cartId)

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                if (response.ok) {
                    Swal.fire("Agregado", "Producto agregado correctamente.", "success");
                }
            } catch (error) {
                Swal.fire("Error", "El producto no se ha agregado al carrito.", "error");
            }
        }, { once: true }); // Se asegura de que el evento se agregue solo una vez
    });
});