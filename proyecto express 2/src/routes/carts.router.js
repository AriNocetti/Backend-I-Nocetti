import { Router } from 'express';
import CartsManager from '../managers/CartsManager.js';

const router = Router();
const cartsManager = new CartsManager();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener productos de un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartsManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartsManager.addProductToCart(cid, pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Editar la cantidad de un producto en un carrito
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if(quantity > 0){
            const updatedCart = await cartsManager.updateProductQuantity(cid, pid, quantity);
            res.json(updatedCart);
        } else{
            throw new Error('La cantidad no puede ser menor a 1')
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto de un carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartsManager.removeProductFromCart(cid, pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
