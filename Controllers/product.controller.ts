import * as express from 'express'
import { Types, FilterQuery } from 'mongoose';
import { parseJsonConfigFileContent, resolveProjectReferencePath } from 'typescript';
import { ApiErrorCode } from '../api-error-code.enum';
import { ProductDocument, ProductModel } from '../Models/product.model';
import { ProductService } from '../Services/product.service';
import {checkUserConnected} from "../middlewares";
import {checkUserAccess} from "../middlewares/role.middleware";

export class ProductController {

    private static instance;

    public static getInstance() {
        // --DESIGN PATTERN SINGLETON
        // Permet d'avoir une seule instance de classe
        if (ProductController.instance === undefined) {
            ProductController.instance = new ProductController();
        }
        return ProductController.instance
    }

    private constructor() { }

    async searchProduct(req, res) {
        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 20; //Number
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : 0; //Number
        const price = req.query.proof ? Number.parseInt(req.query.proof as string): undefined;
        const product = await ProductService.getInstance().searchProduct({
            name: req.query.type as string,
            category: req.query.name as string,
            price: price,
            limit: limit,
            offset: offset
        });
        res.json(product);
    }

    async getProductById(req, res) {
        const id = req.params.id;
        const result = await ProductService.getInstance().getProductById(id);
        if (result === ApiErrorCode.notFound) {
            return res.status(404).end();
        }else if(result === ApiErrorCode.invalidParameters) {
            return res.status(400).end();
        }
        res.json(result);
    }

    async createProduct(req: express.Request, res: express.Response) {
        const data = req.body;
        const result = await ProductService.getInstance().createProduct(data);
        if(result === ApiErrorCode.invalidParameters) {
            return res.status(400).end();
        }
        res.json(result);
    }

    async deleteProduct(req: express.Request, res: express.Response){
        const id = req.params.id;
        const result = await ProductService.getInstance().deleteProduct(id);
        if (result === ApiErrorCode.notFound) {
            return res.status(404).end();
        }else if(result === ApiErrorCode.invalidParameters) {
            return res.status(400).end();
        }
        res.status(204).end();
    }

    async updateProduct(req, res) {
        const id = req.params.id;
        const data = req.body;
        const result = await ProductService.getInstance().updateProduct(id, data);
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
        router.get('/', this.searchProduct.bind(this));//.bind conserve le this courrant
        router.get('/:id', checkUserConnected(), checkUserAccess(["product-read"]), this.getProductById.bind(this));
        router.post("/", checkUserConnected(), checkUserAccess(["product-create"]), this.createProduct.bind(this));
        router.delete("/:id", checkUserConnected(), checkUserAccess(["product-delete"]), this.deleteProduct.bind(this));
        router.patch("/:id", checkUserConnected(), checkUserAccess(["product-edit"]), this.updateProduct.bind(this));
        return router;
    }

}