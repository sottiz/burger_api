import * as mongoose from 'mongoose';
import {Schema, Document} from 'mongoose'

export interface OrderProps{
    id: string;
    menu: string;
    product: number;
    price: Number;
    available: Boolean;
    status: String;
}

export type OrderDocument = OrderProps & Document;

const orderSchema = new Schema({
    menu: {
        type: String
    },
    product: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        required: true,
        default: "PENDING"
    },
}, {
    timestamps: true,
    versionKey: false
});


export const OrderModel = mongoose.models.Order || mongoose.model<OrderDocument>('Order', orderSchema);