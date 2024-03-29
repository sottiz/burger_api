import { config } from 'dotenv';
config(); //Permet de charger les variables d'environnement
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { ProductController } from './Controllers/product.controller';
import { MenuController } from './Controllers/menu.controller';
import { OrderController } from './Controllers/order.controller';
import { AuthController } from './Controllers/auth.controller';
import { RoleService } from './Services/role.service';
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware');


async function startServer(): Promise<void> {
    await mongoose.connect("mongodb+srv://oriana:Y8ocxB3Yqh7qixTR@clusterfastfood.4yvtbdy.mongodb.net/Fastfood");

    console.log("CONNECTED AS ",process.env.MONGO_USER);

    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.use('/admin/orders', createProxyMiddleware({
        target: 'http://localhost:3000/', //original url
        changeOrigin: true,
        //secure: false,
        onProxyRes: function (proxyRes, req, res) {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        }
    }));
    //Permet d'enregistrer un controller qui est dans un autre fichier
    app.use('/product', ProductController.getInstance().buildRouter());
    app.use('/menu', MenuController.getInstance().buildRouter());
    app.use('/order', OrderController.getInstance().buildRouter());
    app.use('/auth', AuthController.getInstance().buildRouter());

    // Utiliser process.env pour récupérer les variables d'environnement
    app.listen(3003, async function() {
        await bootstrap();
        console.log("Server started on port " + 3003);
    });
}

async function bootstrap(): Promise<void> {
    const adminRole = await RoleService.getInstance().getByName("admin");
    if(!adminRole) {
        await RoleService.getInstance().createRole("admin", [
            "product-create",
            "product-read",
            "product-delete",
            "product-edit",
            "order-create",
            "order-read",
            "order-edit",
            "order-delete"
        ]);
    }
    const customerRole = await RoleService.getInstance().getByName("customer");
    if(!customerRole) {
        await RoleService.getInstance().createRole("customer", [
            "product-read",
            "order-create"
        ]);
    }
    const preparatorRole = await RoleService.getInstance().getByName("preparator");
    if(!preparatorRole) {
        await RoleService.getInstance().createRole("preparator", [
            "product-read",
            "order-read",
            "order-edit",
            "order-delete"
        ]);
    }
}

startServer();