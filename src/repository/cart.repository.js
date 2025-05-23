import { PersistenceFactory } from '../DAO/factory.js';
import { CreateCartDTO, AddProductDTO, UpdateProductQuantityDTO } from '../dto/cart.dto.js';

class CartRepository {
    constructor() {
        const { CartDAO } = PersistenceFactory.getPersistence();
        this.dao = new CartDAO();
    }

    async createCart() {
        try {
            const cart = await this.dao.create();
            return cart;
        } catch (error) {
            console.error('CartRepository - createCart - Error:', error);
            throw error;
        }
    }

    async updateCart(cartId, updateData) {
        return await this.dao.update(cartId, updateData);
    }

    async getCartById(id) {
        console.log('CartRepository - getCartById - ID recibido:', id);
        const cart = await this.dao.findById(id);
        console.log('CartRepository - getCartById - Resultado:', cart);
        return cart;
    }

    async addProduct(cartId, productId, quantity = 1) {
        const productDTO = new AddProductDTO(productId, quantity);
        return await this.dao.addProduct(cartId, productDTO);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const quantityDTO = new UpdateProductQuantityDTO(quantity);
        return await this.dao.updateProductQuantity(cartId, productId, quantityDTO.quantity);
    }

    async removeProduct(cartId, productId) {
        return await this.dao.removeProduct(cartId, productId);
    }

    async clearCart(cartId) {
        return await this.dao.clearCart(cartId);
    }
}

export default new CartRepository();
