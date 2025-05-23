import productService from '../services/product.service.js';

class ProductController {
    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json({
                status: 'success',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.json({
                status: 'success',
                data: product
            });
        } catch (error) {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts(req.query);
            res.json({
                status: 'success',
                data: products
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            res.json({
                status: 'success',
                data: product
            });
        } catch (error) {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async deleteProduct(req, res) {
        try {
            await productService.deleteProduct(req.params.id);
            res.json({
                status: 'success',
                message: 'Producto eliminado correctamente'
            });
        } catch (error) {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

export default new ProductController();
