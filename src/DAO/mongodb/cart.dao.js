import cartModel from '../../models/Cart.js';
import { CartDTO } from '../../dto/cart.dto.js';

export default class CartDAO {
    async create() {
        const cart = await cartModel.create({ products: [] });
        return new CartDTO(cart);
    }

    async findById(id) {
        const cart = await cartModel.findById(id).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }

    async addProduct(cartId, productData) {
        const cart = await cartModel.findById(cartId);
        if (!cart) return null;

        const existingProduct = cart.products.find(p => 
            p.product.toString() === productData.product.toString()
        );

        if (existingProduct) {
            existingProduct.quantity += productData.quantity;
        } else {
            cart.products.push(productData);
        }

        await cart.save();
        return new CartDTO(cart);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartModel.findOneAndUpdate(
            { _id: cartId, 'products.product': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        ).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }

    async removeProduct(cartId, productId) {
        const cart = await cartModel.findByIdAndUpdate(
            cartId,
            { $pull: { products: { product: productId } } },
            { new: true }
        ).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }

    async clearCart(cartId) {
        const cart = await cartModel.findByIdAndUpdate(
            cartId,
            { $set: { products: [] } },
            { new: true }
        ).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }

    async update(cartId, updateData) {
        const cart = await cartModel.findByIdAndUpdate(
            cartId,
            updateData,
            { new: true }
        ).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }
}
