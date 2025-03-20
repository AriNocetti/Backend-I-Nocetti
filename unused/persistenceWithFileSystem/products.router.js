import { Router } from 'express';
import ProductsManager from '../managers/ProductsManager.js';

const router = Router();
const productsManager = new ProductsManager();

//se usa export default con una función en lugar de exportar directamente el router, porque necesitamos recibir io como parámetro.
export default (io) => {
    // Obtener todos los productos con opción de límite
    router.get('/', async (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : null;
            const products = await productsManager.getProducts(limit);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Obtener un producto por ID
    router.get('/:pid', async (req, res) => {
        try {
            const product = await productsManager.getProductById(parseInt(req.params.pid));
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
            const thumbnails = req.body.thumbnails.split(',').map(url => url.trim());
    
            const newProductWithFormatedThumbnails= {
                ...req.body,
                thumbnails
            };
            const newProduct = await productsManager.addProduct(newProductWithFormatedThumbnails);
            if (!newProduct) {
                return res.status(400).json({ error: 'Error al agregar el producto' });
            }
            const products = await productsManager.getProducts()
            console.log("productCreated", products);
            io.emit("productCreated", products);
            // res.redirect('/realtimeproducts')
            res.status(204).json({ message: "Producto agregado correctamente", products });
            // res.redirect('/realtimeproducts')
    
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    });
    
    // Actualizar un producto por ID
    router.put('/:pid', async (req, res) => {
        try {
            const updatedProduct = await productsManager.updateProduct(parseInt(req.params.pid), req.body);
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
            const success = await productsManager.deleteProduct(parseInt(req.params.pid));
            if (!success) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            const products = await productsManager.getProducts()
            io.emit("productDeleted", products);
            res.status(200).json({ message: "Producto eliminado correctamente", products });
            // res.redirect('/realtimeproducts')
            // res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
  };