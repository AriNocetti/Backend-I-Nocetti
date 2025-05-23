import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import { isUser, getTokenData } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware para verificar token en todas las rutas
router.use(getTokenData);

// Crear un nuevo carrito (requiere usuario autenticado)
router.post('/', isUser, cartController.createCart);

// Obtener productos de un carrito por ID (requiere ser dueño del carrito)
router.get('/:cid', isUser, cartController.getCartById);

// Agregar un producto a un carrito (requiere ser dueño del carrito)
router.post('/:cid/products/:pid', isUser, cartController.addProduct);

// Actualizar la cantidad de un producto en el carrito (requiere ser dueño del carrito)
router.put('/:cid/products/:pid', isUser, cartController.updateProductQuantity);

// Eliminar un producto del carrito (requiere ser dueño del carrito)
router.delete('/:cid/products/:pid', isUser, cartController.removeProduct);

// Eliminar todos los productos del carrito (requiere ser dueño del carrito)
router.delete('/:cid', isUser, cartController.clearCart);

// Finalizar la compra del carrito (requiere ser dueño del carrito)
router.post('/:cid/purchase', isUser, cartController.createTicket);

export default router;