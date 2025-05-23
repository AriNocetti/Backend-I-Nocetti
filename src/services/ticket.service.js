import ticketRepository from '../repository/ticket.repository.js';
import productService from './product.service.js';
import cartService from './cart.service.js';

class TicketService {
    async createTicket(purchaser, cart) {
        console.log('TicketService - createTicket - Iniciando con carrito:', cart);
        
        if (!purchaser) {
            throw new Error('Se requiere un email de comprador');
        }

        if (!cart || !cart.products) {
            throw new Error('Carrito inválido o vacío');
        }

        const processedProducts = [];
        const failedProducts = [];
        let totalAmount = 0;

        // Process each product in the cart
        for (const item of cart.products) {
            try {
                console.log('TicketService - Procesando producto:', item);
                const productId = item.product.id || item.product._id;
                const updatedProduct = await productService.updateProductStock(productId, item.quantity);
                
                // Add to processed products
                processedProducts.push({
                    product: productId,
                    quantity: item.quantity
                });
                
                totalAmount += updatedProduct.price * item.quantity;
            } catch (error) {
                console.error('TicketService - Error procesando producto:', error);
                const productId = item.product.id || item.product._id;
                // Asegurarnos de guardar el ID como string
                failedProducts.push(productId.toString());
            }
        }

        // Create ticket if there are processed products
        if (processedProducts.length > 0) {
            const ticketData = {
                purchaser,
                amount: totalAmount,
                products: processedProducts
            };

            console.log('TicketService - Creando ticket con datos:', ticketData);
            const ticket = await ticketRepository.createTicket(ticketData);

            // Update cart to keep only failed products
            const cartId = cart.id || cart._id;
            
            // Crear un nuevo array con solo los productos fallidos
            const failedItems = cart.products.filter(item => {
                const productId = (item.product.id || item.product._id).toString();
                console.log('Comparando producto:', productId, 'con fallidos:', failedProducts);
                return failedProducts.includes(productId);
            });

            console.log('TicketService - Productos fallidos encontrados:', failedItems);

            // Actualizar el carrito con solo los productos fallidos
            if (failedItems.length > 0) {
                await cartService.updateCart(cartId, { products: failedItems });
                console.log('TicketService - Carrito actualizado con productos fallidos');
            } else {
                // Si no hay productos fallidos, limpiar el carrito
                await cartService.clearCart(cartId);
                console.log('TicketService - Carrito limpiado (no hay productos fallidos)');
            }

            return {
                ticket,
                failedProducts
            };
        }

        return {
            ticket: null,
            failedProducts
        };
    }

    async getTicketById(id) {
        const ticket = await ticketRepository.getTicketById(id);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }
        return ticket;
    }

    async getTicketByCode(code) {
        const ticket = await ticketRepository.getTicketByCode(code);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }
        return ticket;
    }

    async getTicketsByPurchaser(email) {
        return await ticketRepository.getTicketsByPurchaser(email);
    }
}

export default new TicketService();