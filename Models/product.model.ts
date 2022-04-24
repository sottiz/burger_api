import * as mongoose from 'mongoose';
import {Schema, Document} from 'mongoose'

export interface ProductProps{
    name: string;
    category: number;
    price: Number;
    promo: Boolean;
    featured_product: Boolean;
}

export type ProductDocument = ProductProps & Document;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    promo: {
        type: Boolean,
        required: true,
        default: false
    },
    featured_product: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true,
    versionKey: false
});


export const ProductModel = mongoose.models.Product || mongoose.model<ProductDocument>('Product', productSchema);