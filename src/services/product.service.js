import productRepository from '../repository/product.repository.js';

class ProductService {
    async createProduct(productData) {
        return await productRepository.createProduct(productData);
    }

    async getProductById(id) {
        const product = await productRepository.getProductById(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async getAllProducts(query = {}) {
        const { category, status, sort, page = 1, limit = 10 } = query;

        // Construir los filtros
        const filter = {};
        if (category) filter.category = category;
        if (status === 'true' || status === 'false') {
            filter.status = status === 'true';
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
        };

        return await productRepository.getAllProducts(filter, options);
    }

    async updateProduct(id, productData) {
        const product = await productRepository.updateProduct(id, productData);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async deleteProduct(id) {
        const product = await productRepository.deleteProduct(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async updateProductStock(id, quantity) {
        const result = await productRepository.updateProductStock(id, quantity);
        if (result === null) {
            throw new Error('Producto no encontrado');
        }
        if (result === false) {
            throw new Error('Stock insuficiente');
        }
        return result;
    }
}

export default new ProductService();
