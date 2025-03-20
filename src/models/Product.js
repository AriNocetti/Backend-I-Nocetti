import { Schema, model }  from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

//Seteamos el nombre de la colección
const productCollection = 'product';

//Definimos el esquema producto
const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: Number, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Pantalones', 'Lenceria', 'abrigo', 'Generico']
    },
    thumbnails: { type: [String] },
    status: { type: Boolean, required: true },
});

productSchema.plugin(mongoosePaginate);

const ProductModel = model(productCollection, productSchema);

export default ProductModel;