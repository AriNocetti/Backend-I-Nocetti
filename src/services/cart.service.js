import cartRepository from '../repository/cart.repository.js';
import productService from './product.service.js';

class CartService {
    async createCart() {
        try {
            console.log('CartService - createCart - Creating new cart');
            const cart = await cartRepository.createCart();
            console.log('CartService - createCart - Cart created:', cart);
            return cart;
        } catch (error) {
            console.error('CartService - createCart - Error:', error);
            throw error;
        }
    }

    async updateCart(cartId, updateData) {
        const cart = await cartRepository.updateCart(cartId, updateData);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    async getCartById(id) {
        console.log('CartService - getCartById - ID recibido:', id);
        const cart = await cartRepository.getCartById(id);
        console.log('CartService - getCartById - Carrito encontrado:', cart ? 'Sí' : 'No');
        if (!cart) {
            console.log('CartService - getCartById - Error: Carrito no encontrado');
            throw new Error('Carrito no encontrado');
        }
        console.log('CartService - getCartById - Contenido del carrito:', cart);
        return cart;
    }

    async addProduct(cartId, productId, quantity = 1) {
        console.log('CartService - addProduct - Adding product:', { cartId, productId, quantity });
        
        // Verificar que el producto exista
        await productService.getProductById(productId);
        
        const cart = await cartRepository.addProduct(cartId, productId, quantity);
        if (!cart) {
            console.log('CartService - addProduct - Cart not found');
            throw new Error('Carrito no encontrado');
        }
        console.log('CartService - addProduct - Product added successfully');
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        // Verificar que el producto exista
        await productService.getProductById(productId);
        
        const cart = await cartRepository.updateProductQuantity(cartId, productId, quantity);
        if (!cart) {
            throw new Error('Carrito o producto no encontrado');
        }
        return cart;
    }

    async removeProduct(cartId, productId) {
        const cart = await cartRepository.removeProduct(cartId, productId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    async clearCart(cartId) {
        const cart = await cartRepository.clearCart(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }
}

export default new CartService();
