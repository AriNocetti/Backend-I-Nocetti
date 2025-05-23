export class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
        this.thumbnails = product.thumbnails;
        this.status = product.status;
    }
}

export class CreateProductDTO {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.code = data.code;
        this.price = data.price;
        this.stock = data.stock;
        this.category = data.category;
        this.thumbnails = data.thumbnails || [];
        this.status = data.status ?? true;
    }
}

export class UpdateProductDTO {
    constructor(data) {
        if (data.title !== undefined) this.title = data.title;
        if (data.description !== undefined) this.description = data.description;
        if (data.code !== undefined) this.code = data.code;
        if (data.price !== undefined) this.price = data.price;
        if (data.stock !== undefined) this.stock = data.stock;
        if (data.category !== undefined) this.category = data.category;
        if (data.thumbnails !== undefined) this.thumbnails = data.thumbnails;
        if (data.status !== undefined) this.status = data.status;
    }
}
