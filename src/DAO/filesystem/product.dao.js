import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductDAO {
    constructor() {
        this.path = path.join(__dirname, '../../../data/products.json');
        this.createFileIfNotExists();
    }

    async createFileIfNotExists() {
        try {
            await fs.access(this.path);
        } catch {
            await fs.writeFile(this.path, '[]');
        }
    }

    async findAll(filter = {}, options = {}) {
        const data = await fs.readFile(this.path, 'utf8');
        let products = JSON.parse(data);

        // Aplicar filtros
        if (filter.category) {
            products = products.filter(p => p.category === filter.category);
        }
        if (filter.status !== undefined) {
            products = products.filter(p => p.status === filter.status);
        }

        // Aplicar ordenamiento
        if (options.sort?.price) {
            products.sort((a, b) => {
                return options.sort.price === 1 ? a.price - b.price : b.price - a.price;
            });
        }

        // Aplicar paginación
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        const paginatedProducts = products.slice(skip, skip + limit);

        return {
            docs: paginatedProducts,
            totalDocs: products.length,
            limit,
            page,
            totalPages: Math.ceil(products.length / limit),
            hasNextPage: skip + limit < products.length,
            hasPrevPage: page > 1,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: skip + limit < products.length ? page + 1 : null
        };
    }

    async findById(id) {
        const products = await fs.readFile(this.path, 'utf8');
        const productList = JSON.parse(products);
        return productList.find(product => product._id === id);
    }

    async create(data) {
        const products = await fs.readFile(this.path, 'utf8').then(JSON.parse);
        const newProduct = {
            _id: Date.now().toString(),
            ...data
        };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async update(id, data) {
        let products = await this.getAll();
        const index = products.findIndex(product => product._id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...data };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async delete(id) {
        let products = await this.getAll();
        const filteredProducts = products.filter(product => product._id !== id);
        await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
    }
}

export default ProductDAO;
