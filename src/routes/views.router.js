import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { routeGuard, loginGuard, getTokenData } from '../middlewares/auth.middleware.js';
import viewController from '../controllers/view.controller.js';

const router = Router();
router.use(cookieParser());
router.use(getTokenData);

// Página principal con productos
router.get('/', routeGuard('user'), viewController.renderProducts);
router.get('/products', routeGuard('user'), viewController.renderProducts);

// Productos en tiempo real
router.get('/realtimeproducts', routeGuard(), viewController.renderRealTimeProducts);

// Rutas de carrito
router.get('/cart', routeGuard('user'), viewController.handleCartRedirect);
router.get('/cart/:cid?', routeGuard('user'), viewController.renderCart);

// Página de nuevo producto (admin)
router.get('/newProduct', routeGuard('admin'), viewController.renderNewProduct);

// Rutas de autenticación
router.get('/login', loginGuard(), viewController.renderLogin);
router.get('/profile', routeGuard(), viewController.renderProfile);

// Historial de compras
router.get('/tickets', routeGuard('user'), viewController.renderTickets);

export default router;