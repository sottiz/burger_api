import { OrderDocument, OrderModel } from '../Models/order.model';
import { Types, FilterQuery } from 'mongoose';
import { ApiErrorCode } from "../api-error-code.enum";
import { create } from "ts-node";

export class OrderService {

    private static instance: OrderService;
    private constructor() { }

    public static getInstance() {
        if (OrderService.instance === undefined) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    async getOrderById(id: string): Promise<OrderDocument | ApiErrorCode> {
        if (!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const order = await OrderModel.findById(id);
        if (order === null) {
            return ApiErrorCode.notFound;
        }
        return order;
    }

    async searchOrder(search): Promise<OrderDocument[] | ApiErrorCode> {
        const filter: FilterQuery<OrderDocument> = {};
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
        const query = OrderModel.find(filter);
        if (search.limit !== undefined) {
            query.limit(search.limit);
        }
        if (search.offset !== undefined) {
            query.skip(search.offset);
        }

        return query.exec();
    }

    async createOrder(create: OrderCreate): Promise<OrderDocument | ApiErrorCode> {
        try {
            const model = new OrderModel(create);
            const order = await model.save();
            return order;
        } catch(err) {
            return ApiErrorCode.invalidParameters;
        }
    }


    async deleteOrder(id: string): Promise<ApiErrorCode> {
        if (!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const order = await OrderModel.findByIdAndDelete(id);
        if(order === null) {
            return ApiErrorCode.notFound
        }
        return ApiErrorCode.success;
    }

    async updateOrder(id: string, update: OrderUptdate): Promise<OrderDocument | ApiErrorCode> {
        if (!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }

        const order = await OrderModel.findByIdAndUpdate(id, update, {
            returnDocument: "after"
        });

        if(order == null) {
            return ApiErrorCode.notFound;
        }
        return order;
    }


}


export interface OrderSearch {
    readonly menu?: string;
    readonly product?: string;
    readonly price?: number;
    readonly available?: boolean;
    readonly status?: string;
}

export interface OrderCreate {
    readonly menu?: string;
    readonly product?: string;
    readonly price?: number;
    readonly available?: boolean;
    readonly status?: string;
}

export interface OrderUptdate {
    readonly menu?: string;
    readonly product?: string;
    readonly price?: number;
    readonly available?: boolean;
    readonly status?: string;
}