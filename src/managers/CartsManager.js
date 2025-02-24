import fs from 'fs';

class CartsManager {
    constructor() {
        this.filePath = './carrito.json';
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    async saveCarts(carts) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: carts.length + 1, products: [] };
        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async getCartById(cid) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id == cid)
        if(cart){
            return cart
        } else {
            throw new Error("Carrito no encontrado");
        }
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id == cid);
        if (cartIndex === -1) throw new Error("Carrito no encontrado");

        const productIndex = carts[cartIndex].products.findIndex(p => p.product === pid);
        if (productIndex !== -1) {
            carts[cartIndex].products[productIndex].quantity += 1;
        } else {
            carts[cartIndex].products.push({ product: pid, quantity: 1 });
        }

        await this.saveCarts(carts);
        return carts[cartIndex];
    }

    async updateProductQuantity(cid, pid, quantity) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id == cid);
        if (cartIndex === -1) throw new Error("Carrito no encontrado");

        const productIndex = carts[cartIndex].products.findIndex(p => p.product == pid);
        if (productIndex === -1) throw new Error("Producto no encontrado en el carrito");

        carts[cartIndex].products[productIndex].quantity = quantity;
        await this.saveCarts(carts);
        return carts[cartIndex];
    }

    async removeProductFromCart(cid, pid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id == cid);
        if (cartIndex === -1) throw new Error("Carrito no encontrado");

        carts[cartIndex].products = carts[cartIndex].products.filter(p => p.product !== pid);
        await this.saveCarts(carts);
        return carts[cartIndex];
    }

    async resetCart(cartId) {
        try {
            let carts = await this.getCarts();
            let cartIndex = carts.findIndex(cart => cart.id == cartId);

            if (cartIndex === -1) {
                throw new Error(`No se encontró un carrito con ID ${cartId}`);
            }

            carts[cartIndex].products = []; // Vaciar el carrito

            await this.saveCarts(carts);
            console.log(`Carrito con ID ${cartId} ha sido reseteado.`);
            
            return carts[cartIndex];
        } catch (error) {
            console.error("Error al resetear el carrito:", error);
        }
    }
}

export default CartsManager;
