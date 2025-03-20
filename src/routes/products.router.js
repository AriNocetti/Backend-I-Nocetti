import { Router } from 'express';
import mongoose from 'mongoose';
import ProductModel from '../models/Product.js';

const router = Router();

// Obtener todos los productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { category, status, sort, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status === 'true';
        
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };
        
        const products = await ProductModel.paginate(filter, options);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = new ProductModel(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado o error al actualizar' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
