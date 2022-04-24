import {RoleDocument, RoleModel} from "../Models/role.model";

export class RoleService {

    private static instance: RoleService;

    private constructor() {
    }

    public static getInstance(): RoleService {
        if (RoleService.instance === undefined) {
            RoleService.instance = new RoleService();
        }
        return RoleService.instance;
    }

    public getByName(name: string): Promise<RoleDocument | null> {
        return RoleModel.findOne({
            name
        }).exec();
    }

    public async createRole(name: string, accessList: string[], parentName?: string): Promise<RoleDocument | null> {
        let parent: RoleDocument | undefined;
        if(parentName) {
            parent = await this.getByName(parentName);
        }
        const role = new RoleModel({
            name,
            accessList,
            parent
        });
        await role.save();
        return role;
    }
}
