export class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));
    }
}

export class CreateCartDTO {
    constructor() {
        this.products = [];
    }
}

export class AddProductDTO {
    constructor(productId, quantity = 1) {
        this.product = productId;
        this.quantity = quantity;
    }
}

export class UpdateProductQuantityDTO {
    constructor(quantity) {
        this.quantity = quantity;
    }
}
