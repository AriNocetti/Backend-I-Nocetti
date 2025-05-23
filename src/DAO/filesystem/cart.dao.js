import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para generar IDs compatibles con MongoDB
function generateMongoId() {
    return randomBytes(12).toString('hex');
}

class CartDAO {
    constructor() {
        this.path = path.join(__dirname, '../../../data/carts.json');
        this.createFileIfNotExists();
    }

    async createFileIfNotExists() {
        try {
            // Asegurar que el directorio data existe
            const dataDir = path.dirname(this.path);
            try {
                await fs.access(dataDir);
            } catch {
                await fs.mkdir(dataDir, { recursive: true });
            }
            
            // Verificar si el archivo existe
            await fs.access(this.path);
        } catch {
            await fs.writeFile(this.path, '[]');
        }
    }

    async getAll() {
        const data = await fs.readFile(this.path, 'utf8');
        return JSON.parse(data);
    }

    async findById(id) {
        const carts = await this.getAll();
        return carts.find(cart => cart._id === id);
    }

    async create() {
        const carts = await this.getAll();
        const newCart = {
            _id: generateMongoId(),
            products: []
        };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async update(id, data) {
        let carts = await this.getAll();
        const index = carts.findIndex(cart => cart._id === id);
        if (index === -1) return null;
        carts[index] = { ...carts[index], ...data };
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return carts[index];
    }

    async delete(id) {
        let carts = await this.getAll();
        const filteredCarts = carts.filter(cart => cart._id !== id);
        await fs.writeFile(this.path, JSON.stringify(filteredCarts, null, 2));
    }

    async addProduct(cartId, productData) {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cartId);
        if (cartIndex === -1) return null;

        const cart = carts[cartIndex];
        const existingProductIndex = cart.products.findIndex(p => 
            p.product.toString() === productData.product.toString()
        );

        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += productData.quantity;
        } else {
            cart.products.push(productData);
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cartId);
        if (cartIndex === -1) return null;

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => 
            p.product.toString() === productId.toString()
        );

        if (productIndex === -1) return null;

        cart.products[productIndex].quantity = quantity;
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }

    async removeProduct(cartId, productId) {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cartId);
        if (cartIndex === -1) return null;

        const cart = carts[cartIndex];
        cart.products = cart.products.filter(p => 
            p.product.toString() !== productId.toString()
        );

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }

    async clearCart(cartId) {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cartId);
        if (cartIndex === -1) return null;

        carts[cartIndex].products = [];
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return carts[cartIndex];
    }
}

export default CartDAO;
