
import fs from 'fs';

class ProductsManager {
    constructor() {
        this.filePath = './productos.json';
    }
    // Obtener todos los productos, con opción de limitar la cantidad
    async getProducts(limit = null) {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            const products = JSON.parse(data) || [];
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            console.error("Error al leer productos:", error);
            return [];
        }
    }

    // Obtener un producto por ID
    async getProductById(pid) {
        try {
            const products = await this.getProducts();
            return products.find(p => p.id === pid) || null;
        } catch (error) {
            console.error("Error al obtener producto:", error);
            return null;
        }
    }

    // Agregar un nuevo producto
    async addProduct({ title, description, code, price, stock, category, thumbnails = [], status = true }) {
        try {
            if (!title || !description || !code || !price || stock === undefined || !category) {
                throw new Error("Todos los campos son obligatorios, excepto thumbnails");
            }

            const products = await this.getProducts();
            const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

            const newProduct = { id: newId, title, description, code, price, stock, category, thumbnails, status };
            products.push(newProduct);
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            console.error("Error al agregar producto:", error);
            return null;
        }
    }

    // Actualizar un producto por ID
    async updateProduct(pid, updatedFields) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === pid);
            if (index === -1) throw new Error("Producto no encontrado");
            
            if (updatedFields.id) delete updatedFields.id; // Evitar actualización del ID

            products[index] = { ...products[index], ...updatedFields };
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return products[index];
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return null;
        }
    }

    // Eliminar un producto por ID
    async deleteProduct(pid) {
        try {
            let products = await this.getProducts();
            const newProducts = products.filter(p => p.id !== pid);
            if (products.length === newProducts.length) throw new Error("Producto no encontrado");

            await fs.promises.writeFile(this.filePath, JSON.stringify(newProducts, null, 2));
            return true;
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            return false;
        }
    }
}

export default ProductsManager;