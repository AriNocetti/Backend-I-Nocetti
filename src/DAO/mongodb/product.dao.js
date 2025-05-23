import productModel from '../../models/Product.js';
import { ProductDTO } from '../../dto/product.dto.js';

export default class ProductDAO {
    async findAll(filter = {}, options = {}) {
        const result = await productModel.paginate(filter, options);
        return {
            ...result,
            docs: result.docs.map(product => new ProductDTO(product))
        };
    }

    async findById(id) {
        const product = await productModel.findById(id);
        return product ? new ProductDTO(product) : null;
    }

    async create(productData) {
        const product = await productModel.create(productData);
        return new ProductDTO(product);
    }

    async update(id, productData) {
        const product = await productModel.findByIdAndUpdate(id, productData, { new: true });
        return product ? new ProductDTO(product) : null;
    }

    async delete(id) {
        const product = await productModel.findByIdAndDelete(id);
        return product ? new ProductDTO(product) : null;
    }

    async updateStock(id, quantity) {
        const product = await productModel.findById(id);
        if (!product) return null;
        if (product.stock < quantity) return false;

        product.stock -= quantity;
        await product.save();
        return new ProductDTO(product);
    }
}
