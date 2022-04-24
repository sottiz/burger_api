import {Request, Response, Router} from "express";
import {AuthService} from "../Services/auth.service";
import {ApiErrorCode} from "../api-error-code.enum";
import {SessionProps} from "../Models/session.model";

export class AuthController {

    private static instance: AuthController;

    private constructor() { }

    public static getInstance(): AuthController {
        if(AuthController.instance === undefined) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    async subscribe(req: Request, res: Response): Promise<void> {
        const data = req.body;
        const result = await AuthService.getInstance().subscribeUser({
            login: data.login,
            password: data.password,
            roleName: 'admin'
        });
        if(result === ApiErrorCode.alreadyExists) {
            res.status(409).end(); // CONFLICT
            return;
        }
        res.json(result);
    }

    async logIn(req: Request, res: Response): Promise<void> {
        const data = req.body;
        const session = await AuthService.getInstance().logIn({
           login: data.login,
           password: data.password,
           platform: req.headers["user-agent"]
        });
        if(session === ApiErrorCode.notFound) {
            res.status(404).end();
            return;
        }
        res.json({
            token: (session as SessionProps)._id
        });
    }

    buildRouter(): Router {
        const router = Router();
        router.post("/subscribe", this.subscribe.bind(this));
        router.post("/login", this.logIn.bind(this));
        return router;
    }
}
