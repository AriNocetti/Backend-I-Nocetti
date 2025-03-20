import { Schema, model }  from 'mongoose';

//Seteamos el nombre de la colección
const cartCollection = 'cart';

const cartSchema = new Schema({
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
});

const CartModel = model(cartCollection, cartSchema);

export default CartModel;