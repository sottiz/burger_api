import * as express from 'express'
import { Types, FilterQuery } from 'mongoose';
import { isThisTypeNode, parseJsonConfigFileContent, resolveProjectReferencePath } from 'typescript';
import { ApiErrorCode } from '../api-error-code.enum';
import { checkUserConnected } from '../middlewares/auth.middleware';
import { checkUserAccess } from '../middlewares/role.middleware';
import { MenuDocument, MenuModel } from '../Models/menu.model';
import { MenuService } from '../Services/menu.service';

export class MenuController {

    private static instance;

    public static getInstance() {
        // --DESIGN PATTERN SINGLETON
        // Permet d'avoir une seule instance de classe
        if (MenuController.instance === undefined) {
            MenuController.instance = new MenuController();
        }
        return MenuController.instance
    }

    private constructor() { }

    async searchMenu(req, res) {
        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 20; //Number
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : 0; //Number
        const proof = req.query.proof ? Number.parseInt(req.query.proof as string): undefined;
        const menu = await MenuService.getInstance().searchMenu({
            type: req.query.type as string,
            name: req.query.name as string,
            proof: proof,
            limit: limit,
            offset: offset
        });
        res.json(menu);
    }

    async getMenuById(req, res) {
        const id = req.params.id;
        const result = await MenuService.getInstance().getMenuById(id);
        if (result === ApiErrorCode.notFound) {
            return res.status(404).end();
        }else if(result === ApiErrorCode.invalidParameters) {
            return res.status(400).end();
        }
        res.json(result);
    }

    async createMenu(req, res) {
        const data = req.body;
        try {
            const model = new MenuModel(data);
            const menu = await model.save();
            res.json(menu);
        } catch(err) {
            res.status(400).end()
        }
    }

    async deleteMenu(req: express.Request, res: express.Response){
        const id = req.params.id;
        const result = await MenuService.getInstance().deleteMenu(id);
        if (result === ApiErrorCode.notFound) {
            return res.status(404).end();
        }else if(result === ApiErrorCode.invalidParameters) {
            return res.status(400).end();
        }
        res.status(204).end();
    }

    async updateMenu(req, res) {
        const id = req.params.id;
        const data = req.body;
        const result = await MenuService.getInstance().updateMenu(id, data);
        if (result === ApiErrorCode.notFound) {
            return res.status(404).end();
        }else if(result === ApiErrorCode.invalidParameters) {
            return res.status(400).end();
        }
        res.json(result);
    }

    //Chaque controlleur aura son router à construire
    buildRouter() {
        const router = express.Router(); //Création d'un nouveau router
        router.get('/', this.searchMenu.bind(this));//.bind conserve le this courrant
        router.get('/:id', checkUserConnected(), checkUserAccess(["product-read"]), this.getMenuById.bind(this));
        router.post("/", checkUserConnected(), checkUserAccess(["product-create"]), this.createMenu.bind(this));
        router.patch("/:id", checkUserConnected(), checkUserAccess(["product-edit"]), this.updateMenu.bind(this));
        router.delete("/:id", checkUserConnected(), checkUserAccess(["product-delete"]), this.deleteMenu.bind(this));
        return router;
    }

}