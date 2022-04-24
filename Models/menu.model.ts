import * as mongoose from 'mongoose';
import {Schema, Document} from 'mongoose'

export interface MenuProps{
    id: string;
    name: string;
    size: String;
    price: Number;
    promo: Boolean;
    featured_product: Boolean;
}

export type MenuDocument = MenuProps & Document;

const menuSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    size: {
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


export const MenuModel = mongoose.models.Menu || mongoose.model<MenuDocument>('Menu', menuSchema);