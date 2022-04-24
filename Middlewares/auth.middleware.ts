import {NextFunction, Request, RequestHandler, Response} from "express";
import {AuthService} from "../services/auth.service";
import {ApiErrorCode} from "../api-error-code.enum";
import {UserProps} from "../Models/user.model";

export function checkUserConnected(): RequestHandler {
    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authorization = req.headers["authorization"];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        // La syntaxe pour les tokens est la suivante :
        // Authorization: Bearer XXX
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if(parts[0] !== "Bearer") {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        const result = await AuthService.getInstance().getUserByToken(token);
        if(result === ApiErrorCode.notFound || result === ApiErrorCode.invalidParameters) {
            res.status(401).end();
            return;
        }
        req.user = result as UserProps;
        next();
    }
}

declare module 'express' {
    export interface Request {
        user: UserProps;
    }
}
