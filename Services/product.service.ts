import { ProductDocument, ProductModel } from "../models";
import { Types, FilterQuery } from 'mongoose';
import { ApiErrorCode } from "../api-error-code.enum";
import { create } from "ts-node";

export class ProductService {

    private static instance: ProductService;
    private constructor() { }

    public static getInstance() {
        if (ProductService.instance === undefined) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    async getProductById(id: string): Promise<ProductDocument | ApiErrorCode> {
        if (!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const alcohol = await ProductModel.findById(id);
        if (alcohol === null) {
            return ApiErrorCode.notFound;
        }
        return alcohol;
    }

    async searchProduct(search): Promise<ProductDocument[] | ApiErrorCode> {
        const filter: FilterQuery<ProductDocument> = {};
        if (search.type !== undefined) {
            filter.type = search.type;
        }
        if (search.name !== undefined) {
            filter.name = {
                $regex: search.name,
                $option: 'i'
            }
        }
        
        if (search.proof !== undefined) {
            filter.proof = {
                $gte: search.proof 
            } 
        }
        const query = ProductModel.find(filter);
        if (search.limit !== undefined) {
            query.limit(search.limit);
        }
        if (search.offset !== undefined) {
            query.skip(search.offset);
        }

        return query.exec();
    }

    async createProduct(create: ProductCreate): Promise<ProductDocument | ApiErrorCode> {
        try {
            const model = new ProductModel(create);
            const alcohol = await model.save();
            return alcohol;
        } catch(err) {
            return ApiErrorCode.invalidParameters;
        }
    }


    async deleteProduct(id: string): Promise<ApiErrorCode> {
        if (!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const alcohol = await ProductModel.findByIdAndDelete(id);
        if(alcohol === null) {
            return ApiErrorCode.notFound
        }
        return ApiErrorCode.success;
    }

    async updateProduct(id: string, update: ProductUptdate): Promise<ProductDocument | ApiErrorCode> {
        if (!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }

        const alcohol = await ProductModel.findByIdAndUpdate(id, update, {
            returnDocument: "after"
        });

        if(alcohol == null) {
            return ApiErrorCode.notFound;
        }
        return alcohol;
    }


}


export interface ProductSearch {
    readonly name?: string;
    readonly category?: string;
    readonly price?: number;
    readonly promo?: boolean;
    readonly featured_product?: boolean;
}

export interface ProductCreate {
    readonly name?: string;
    readonly category?: string;
    readonly price?: number;
    readonly promo?: boolean;
    readonly featured_product?: boolean;
}

export interface ProductUptdate {
    readonly name?: string;
    readonly category?: string;
    readonly price?: number;
    readonly promo?: boolean;
    readonly featured_product?: boolean;
}