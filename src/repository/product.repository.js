import { PersistenceFactory } from '../DAO/factory.js';
import { CreateProductDTO, UpdateProductDTO } from '../dto/product.dto.js';

class ProductRepository {
    constructor() {
        const { ProductDAO } = PersistenceFactory.getPersistence();
        this.dao = new ProductDAO();
    }

    async createProduct(productData) {
        const productDTO = new CreateProductDTO(productData);
        return await this.dao.create(productDTO);
    }

    async getProductById(id) {
        return await this.dao.findById(id);
    }

    async getAllProducts(filter = {}, options = {}) {
        return await this.dao.findAll(filter, options);
    }

    async updateProduct(id, productData) {
        const updateDTO = new UpdateProductDTO(productData);
        return await this.dao.update(id, updateDTO);
    }

    async deleteProduct(id) {
        return await this.dao.delete(id);
    }

    async updateProductStock(id, quantity) {
        return await this.dao.updateStock(id, quantity);
    }
}

export default new ProductRepository();
