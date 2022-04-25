import { MenuDocument, MenuModel } from '../Models/menu.model';
import { Types, FilterQuery } from 'mongoose';
import { ApiErrorCode } from "../api-error-code.enum";
import { create } from "ts-node";

export class MenuService {

    private static instance: MenuService;
    private constructor() { }

    public static getInstance() {
        if (MenuService.instance === undefined) {
            MenuService.instance = new MenuService();
        }
        return MenuService.instance;
    }

    async getMenuById(id: string): Promise<MenuDocument | ApiErrorCode> {
        if (!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const menu = await MenuModel.findById(id);
        if (menu === null) {
            return ApiErrorCode.notFound;
        }
        return menu;
    }

    

    async searchMenu(search): Promise<MenuDocument[] | ApiErrorCode> {
        const filter: FilterQuery<MenuDocument> = {};
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
        const query = MenuModel.find(filter);
        if (search.limit !== undefined) {
            query.limit(search.limit);
        }
        if (search.offset !== undefined) {
            query.skip(search.offset);
        }

        return query.exec();
    }

    async createMenu(create: MenuCreate): Promise<MenuDocument | ApiErrorCode> {
        try {
            const model = new MenuModel(create);
            const menu = await model.save();
            return menu;
        } catch(err) {
            return ApiErrorCode.invalidParameters;
        }
    }


    async deleteMenu(id: string): Promise<ApiErrorCode> {
        if (!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }
        const menu = await MenuModel.findByIdAndDelete(id);
        if(menu === null) {
            return ApiErrorCode.notFound
        }
        return ApiErrorCode.success;
    }

    async updateMenu(id: string, update: MenuUptdate): Promise<MenuDocument | ApiErrorCode> {
        if (!Types.ObjectId.isValid(id)) {
            return ApiErrorCode.invalidParameters;
        }

        const menu = await MenuModel.findByIdAndUpdate(id, update, {
            returnDocument: "after"
        });

        if(menu == null) {
            return ApiErrorCode.notFound;
        }
        return menu;
    }


}


export interface MenuSearch {
    readonly name?: string;
    readonly size?: string;
    readonly price?: number;
    readonly promo?: boolean;
    readonly featured_product?: boolean;
}

export interface MenuCreate {
    readonly name?: string;
    readonly size?: string;
    readonly price?: number;
    readonly promo?: boolean;
    readonly featured_product?: boolean;
}

export interface MenuUptdate {
    readonly name?: string;
    readonly size?: string;
    readonly price?: number;
    readonly promo?: boolean;
    readonly featured_product?: boolean;
}