import {NextFunction, Request, RequestHandler, Response} from "express";
import {RoleProps} from "../Models/role.model";

export function checkUserAccess(accessList: string[]): RequestHandler {
    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
        if(!req.user) {
            res.status(401).end();
        }
        const userAccessList: string[] = [];
        let role = req.user.role as RoleProps;
        while(role) {
            userAccessList.push(...role.accessList);
            role = role.parent as RoleProps;
        }
        for(let access of accessList) {
            if(userAccessList.indexOf(access) === -1) { // si pas trouvé
                res.status(403).end();
                return;
            }
        }
        next()
    }
}
