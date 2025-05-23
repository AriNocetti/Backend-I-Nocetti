import { Router } from 'express';
import productController from '../controllers/product.controller.js';
import { isAdmin, getTokenData } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware para verificar token en todas las rutas
router.use(getTokenData);

// Obtener todos los productos con filtros, paginación y ordenamiento
router.get('/', productController.getAllProducts);

// Obtener un producto por ID
router.get('/:pid', productController.getProductById);

// Agregar un nuevo producto (solo admin)
router.post('/', isAdmin, productController.createProduct);

// Actualizar un producto por ID (solo admin)
router.put('/:pid', isAdmin, productController.updateProduct);

// Eliminar un producto por ID (solo admin)
router.delete('/:pid', isAdmin, productController.deleteProduct);

export default router;
