import * as express from 'express'
import { Types, FilterQuery } from 'mongoose';
import { parseJsonConfigFileContent, resolveProjectReferencePath } from 'typescript';
import { ApiErrorCode } from '../api-error-code.enum';
import { checkUserConnected } from '../middlewares/auth.middleware';
import { checkUserAccess } from '../middlewares/role.middleware';
import { OrderDocument, OrderModel } from '../Models/order.model';
import { OrderService } from '../Services/order.service';

export class OrderController {

    private static instance;

    public static getInstance() {
        // --DESIGN PATTERN SINGLETON
        // Permet d'avoir une seule instance de classe
        if (OrderController.instance === undefined) {
            OrderController.instance = new OrderController();
        }
        return OrderController.instance
    }

    private constructor() { }

    async searchOrder(req, res) {
        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 20; //Number
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : 0; //Number
        const proof = req.query.proof ? Number.parseInt(req.query.proof as string): undefined;
        const alcohols = await OrderService.getInstance().searchOrder({
            type: req.query.type as string,
            name: req.query.name as string,
            proof: proof,
            limit: limit,
            offset: offset
        });
        res.json(alcohols);
    }

    async getOrderById(req, res) {
        const id = req.params.id;
        const result = await OrderService.getInstance().getOrderById(id);
        if (result === ApiErrorCode.notFound) {
            return res.status(404).end();
        }else if(result === ApiErrorCode.invalidParameters) {
            return res.status(400).end();
        }
        res.json(result);
    }

    async createOrder(req, res) {
        const data = req.body;
        try {
            const model = new OrderModel(data);
            const alcohol = await model.save();
            res.json(alcohol);
        } catch(err) {
            res.status(400).end()
        }
    }

    async deleteOrder(req: express.Request, res: express.Response){
        const id = req.params.id;
        const result = await OrderService.getInstance().deleteOrder(id);
        if (result === ApiErrorCode.notFound) {
            return res.status(404).end();
        }else if(result === ApiErrorCode.invalidParameters) {
            return res.status(400).end();
        }
        res.status(204).end();
    }

    async updateOrder(req, res) {
        const id = req.params.id;
        const data = req.body;
        const result = await OrderService.getInstance().updateOrder(id, data);
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
        router.get('/', this.searchOrder.bind(this));//.bind conserve le this courrant
        router.get('/:id', checkUserConnected(), checkUserAccess(["product-read"]), this.getOrderById.bind(this));
        router.post("/", this.createOrder.bind(this));
        router.delete("/:id", checkUserConnected(), checkUserAccess(["product-delete"]), this.deleteOrder.bind(this));
        router.patch("/:id", checkUserConnected(), checkUserAccess(["product-edit"]), this.updateOrder.bind(this));
        return router;
    }

}