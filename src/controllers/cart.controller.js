import cartService from '../services/cart.service.js';
import ticketService from '../services/ticket.service.js';

class CartController {
    constructor() {
        // Vinculamos los métodos al contexto
        this.createCart = this.createCart.bind(this);
        this.getCartById = this.getCartById.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.updateProductQuantity = this.updateProductQuantity.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.clearCart = this.clearCart.bind(this);
        this.createTicket = this.createTicket.bind(this);
        this.verifyCartOwnership = this.verifyCartOwnership.bind(this);
    }
    // Verifica si el usuario es dueño del carrito
    async verifyCartOwnership(cartId, user) {
        // Si no hay usuario, permitimos el acceso (carrito anónimo)
        if (!user) {
            const cart = await cartService.getCartById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        }

        // Los administradores no deberían tener acceso a carritos
        if (user.role === 'admin') {
            throw new Error('Los administradores no pueden acceder a carritos');
        }

        const cart = await cartService.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        
        // Si el carrito tiene un usuario asignado y no coincide
        if (cart.user && cart.user.toString() !== user._id.toString()) {
            throw new Error('No tienes permiso para acceder a este carrito');
        }
        
        return cart;
    }
    async createCart(req, res) {
        try {
            const userId = req.user ? req.user._id : null;
            console.log('Creating cart for user:', userId || 'anonymous');
            const cart = await cartService.createCart(userId);
            res.status(201).json({
                status: 'success',
                data: cart
            });
        } catch (error) {
            console.error('Error creating cart:', error);
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getCartById(req, res) {
        try {
            console.log('Getting cart by id:', req.params.cid);
            // Verificar propiedad del carrito
            await this.verifyCartOwnership(req.params.cid, req.user);
            const cart = await cartService.getCartById(req.params.cid);
            res.json({
                status: 'success',
                data: cart
            });
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async addProduct(req, res) {
        try {
            console.log('Adding product to cart:', { cartId: req.params.cid, productId: req.params.pid });
            // Verificar propiedad del carrito
            await this.verifyCartOwnership(req.params.cid, req.user);
            const cart = await cartService.addProduct(req.params.cid, req.params.pid, req.body.quantity || 1);
            res.json({
                status: 'success',
                data: cart
            });
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            // Verificar propiedad del carrito
            await this.verifyCartOwnership(req.params.cid, res.locals.user || req.user);
            const cart = await cartService.updateProductQuantity(
                req.params.cid,
                req.params.pid,
                req.body.quantity
            );
            res.json({
                status: 'success',
                data: cart
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async removeProduct(req, res) {
        try {
            // Verificar propiedad del carrito
            await this.verifyCartOwnership(req.params.cid, res.locals.user || req.user);
            const cart = await cartService.removeProduct(req.params.cid, req.params.pid);
            res.json({
                status: 'success',
                data: cart
            });
        } catch (error) {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async clearCart(req, res) {
        try {
            // Verificar propiedad del carrito
            await this.verifyCartOwnership(req.params.cid, res.locals.user || req.user);
            const cart = await cartService.clearCart(req.params.cid);
            res.json({
                status: 'success',
                data: cart,
                message: 'Todos los productos han sido eliminados del carrito'
            });
        } catch (error) {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async createTicket(req, res) {
        try {
            console.log('1. Iniciando createTicket');
            console.log('1.1. Request params:', req.params);
            console.log('1.2. Request cookies:', req.cookies);
            
            let cartId = req.params.cid || req.cookies.cartId;
            console.log('2. CartId obtenido:', cartId);
            
            if (!cartId) {
                console.log('3. Error: No se encontró cartId');
                return res.status(400).json({
                    status: 'error',
                    message: 'No se encontró un ID de carrito'
                });
            }

            // Verificar propiedad del carrito
            await this.verifyCartOwnership(cartId, res.locals.user || req.user);

            console.log('4. Buscando carrito con ID:', cartId);
            const cart = await cartService.getCartById(cartId);
            console.log('5. Carrito encontrado:', cart ? 'Sí' : 'No');
            
            if (!cart) {
                console.log('6. Error: Carrito no encontrado');
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            console.log('7. Productos en el carrito:', cart.products);
            if (!cart.products || cart.products.length === 0) {
                console.log('8. Error: Carrito vacío');
                return res.status(400).json({
                    status: 'error',
                    message: 'El carrito está vacío'
                });
            }

            console.log('9. Información del usuario:', req.user);
            if (!req.user || !req.user.email) {
                console.log('10. Error: Usuario no autenticado');
                return res.status(400).json({
                    status: 'error',
                    message: 'Usuario no autenticado'
                });
            }

            console.log('11. Creando ticket para usuario:', req.user.email);
            const result = await ticketService.createTicket(req.user.email, cart);
            console.log('12. Resultado de crear ticket:', result);

            if (result.ticket) {
                console.log('13. Ticket creado exitosamente');
                // Limpiar el carrito después de una compra exitosa
                
                res.status(201).json({
                    status: 'success',
                    message: 'Compra realizada con éxito',
                    ticket: result.ticket,
                    failedProducts: result.failedProducts
                });
            } else {
                console.log('14. Error: No se pudo procesar ningún producto');
                res.status(400).json({
                    status: 'error',
                    message: 'No se pudo procesar ningún producto',
                    failedProducts: result.failedProducts
                });
            }
        } catch (error) {
            console.error('15. Error en createTicket:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

export default new CartController();
