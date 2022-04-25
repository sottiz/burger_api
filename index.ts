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

async function startServer(): Promise<void> {
    await mongoose.connect(process.env.MONGO_URI, {
        auth: {
            username: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD
        }
    });

    console.log("CONNECTED AS ",process.env.MONGO_USER);

    const app = express();
    app.use(bodyParser.json());
    //Permet d'enregistrer un controller qui est dans un autre fichier
    app.use('/product', ProductController.getInstance().buildRouter());
    app.use('/menu', MenuController.getInstance().buildRouter());
    app.use('/order', OrderController.getInstance().buildRouter());
    app.use('/auth', AuthController.getInstance().buildRouter());

    // Utiliser process.env pour récupérer les variables d'environnement
    app.listen(process.env.PORT, async function() {
        await bootstrap();
        console.log("Server started on port " + process.env.PORT);
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
            "product-read"
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