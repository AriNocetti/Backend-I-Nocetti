import ProductsManager from '../src/managers/ProductsManager.js';
import CartsManager from '../src/managers/CartsManager.js';

const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

async function main() {
    try {
        //Crear un nuevo carrito
        const newCart = await cartsManager.createCart();
        console.log("Carrito creado:", newCart);

        //Obtener todos los carritos
        let carritos = await cartsManager.getCarts();
        console.log("Carritos:", carritos);

        //Obtener un carrito por ID
        let carrito = await cartsManager.getCartById(newCart.id);
        console.log("Carrito obtenido por ID sin products", carrito,  JSON.stringify(carrito.products));

        //Agregar un producto al carrito
        let updatedCart2 = await cartsManager.addProductToCart(carrito.id, 1);
        let carrito2 = await cartsManager.getCartById(carrito.id);
        console.log("Carrito obtenido por ID con product", carrito2,  JSON.stringify(carrito2.products));
        await cartsManager.resetCart(carrito2.id)
        let carrito3 = await cartsManager.getCartById(carrito.id);
        console.log("Carrito obtenido por ID reseteado", carrito3,  JSON.stringify(carrito3.products));
    } catch (error) {
        console.error("Error en la aplicación", error);
    }

    try {
        // Crear un producto
        const newProduct = await productsManager.addProduct({
            title: "Laptop",
            description: "Laptop de alta gama",
            code: "LPT123",
            price: 1200,
            stock: 10,
            category: "Electrónica",
            thumbnails: ["img1.jpg", "img2.jpg"]
        });
        console.log("Producto creado:", newProduct);

        // Consultar productos
        let productos = await productsManager.getProducts();
        console.log("Productos:", productos);

        // Obtener un producto por ID
        let producto = await productsManager.getProductById(newProduct.id);
        console.log("Producto obtenido por ID:", producto);

        // Actualizar un producto
        let updatedProduct = await productsManager.updateProduct(newProduct.id, { price: 1100, stock: 8 });
        console.log("Producto actualizado:", updatedProduct);

        // Eliminar un producto
        let deleted = await productsManager.deleteProduct(newProduct.id);
        console.log("Producto eliminado:", deleted);
    } catch (error) {
        console.error("Error en la aplicación", error);
    }
}

async function main() {

}