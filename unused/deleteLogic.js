document.getElementById('productosLista').addEventListener('click', function (event) {
    console.log('adentrsdo')
    if (event.target.classList.contains('delete-product-btn')) {
        const productId = event.target.dataset.id;
        console.log('adentro', productId)

        if (!productId) return; // Prevención de errores

        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/products/${productId}`, {
                    method: "DELETE",
                })
                .then(response => {
                    if (!response.ok) throw new Error("No se pudo eliminar el producto");
                    return response.json();
                })
                .then(data => {
                    Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
                    // Remover el producto de la lista sin recargar
                    // event.target.closest(".product-card").remove();
                })
                .catch(error => {
                    console.error("Error:", error);
                    Swal.fire("Error", "No se pudo eliminar el producto.", "error");
                });
            }
        });
    }
});