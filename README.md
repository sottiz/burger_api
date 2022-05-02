# Projet nodeJS - burger_api

> ## Liens utiles
>  > - ## [Installation et utilisation](#installation--utilisation)
>  > - ## [Gestion des permissions](#gestion-des-permissions-selon-les-rôles)
>  >   - [Permissions sur les produits et menus](#permissions-sur-les-produits--menus)
>  >   - [Permissions sur les commandes](#permissions-sur-les-commandes)
>  >   #
>  > - ## [Requêtes API via Postman](#requc3aates-api-via-postman-1)
>  >   - ### [URLs à renseigner](#liste-des-urls)
>  >     #
>  >   - [Méthodes POST](#méthodes-post)
>  >       - [Création d'un utilisateur](#création-dun-utilisateur)
>  >       - [Connexion à un compte utilisateur](#connexion-à-un-compte-utilisateur)
>  >       - [Création d'un produit](#création-de-produit)
>  >       - [Création d'un menu](#création-de-menu) 
>  >       - [Création d'une commande](#création-de-commande)
>  >       #
>  >   - [Méthodes GET](#)
>  >       - [Récupérer tous les produits](#récupérer-tous-les-produits)
>  >       - [Récupérer un produit par son id](#récupérer-un-produit-par-son-id)
>  >       - [Récupérer tous les menus](#récupérer-tous-les-menus)
>  >       - [Récupérer un menu par son id](#récupérer-un-menu-par-son-id)
>  >       - [Récupérer toutes les commandes](#récupérer-toutes-les-commandes)
>  >       - [Récupérer une commande par son id](#récupérer-une-commande-par-son-id)
>  >       #
>  >   - [Méthodes PATCH](#)
>  >       - [Modifier un produit](#modifier-un-produit)
>  >       - [Modifier un menu](#modifier-un-menu)
>  >       - [Modifier une commande](#modifier-une-commande)
>  >       #
>  >   - [Méthodes DELETE](#)
>  >       - [Supprimer un produit](#supprimer-un-produit)
>  >       - [Supprimer un menu](#supprimer-un-menu)
>  >       - [Supprimer une commande](#supprimer-une-commande)
----

> ## Installation & utilisation
>   Saisir les commandes suivantes dans un terminal :
> 
>     git clone git@github.com:sottiz/burger_api.git
> 
>     cd burger_api
> 
>     npm install
> 
>     echo "PORT=<PORT NUMBER>\nMONGO_URI=<DB URL>\nMONGO_USER=<USER NAME>\nMONGO_PASSWORD=<PASSWORD>" > .env # Entrer des valeurs correctes dans les '</>'
> 
>     npm start # Démarre le serveur
> 

---

> ## Gestion des permissions selon les rôles
> L'accès à la création, la lecture, la modification ou suppression de données est gérée comme suit :
> - #### Permissions sur les produits & menus
>   * "product-read" *(droit de lecture de produit/menu)*
>     * *admin*
>     * *customer*
>     * *preparator*
>   
>   * "product-create" *(droit de création de produit/menu)*
>     * *admin*
>   
>   * "product-edit" *(droit de modification de produit/menu)*
>     * *admin*
>   
>   * "product-delete" *(droit de suppression de produit/menu)*
>     * *admin*
> - #### Permissions sur les commandes
>   * "order-read" *(droit de lecture de commande)*
>     * *admin*
>     * *preparator*
> 
>   * "order-create" *(droit de création de commande)*
>     * *admin*
>     * *customer*
>    
>   * "order-edit" *(droit de modification de commande)*
>     * *admin*
>     * *preparator*
>    
>   * "order-delete" *(droit de suppression de commande)*
>     * *admin*
>     * *preparator*
---
 
> ## Requêtes API via Postman
> > ### Liste des URLs
> > - `http://localhost:<PORT>/auth/subscribe`
> > - `http://localhost:<PORT>/auth/login`  
> > - `http://localhost:<PORT>/product`
> > - `http://localhost:<PORT>/menu`
> > - `http://localhost:<PORT>/order`
> > - `http://localhost:<PORT>/product/<product_id>`
> > - `http://localhost:<PORT>/menu/<menu_id>`
> > - `http://localhost:<PORT>/order/<order_id>`
> #
>  > ## Méthodes POST
>  > Les requêtes POST nécessite un corps d'objet à soumettre au format JSON depuis Postman. Pour présenter chaque méthode, nous nous contenterons de renseigner les champs obligatoires seulement.
>  > -  ### Création d'un utilisateur
>  >  ```JavaScript
>  >  POST http://localhost:3000/auth/subscribe/
>  > 
>  >  // Format JSON
>  >  {
>  >      "login": "user1",
>  >      "password": "psswd",
>  >      "roleName": "admin" // "admin" ou "customer" ou "preparator"
>  >  }
>  >  ```
>  >  #
>  > - ### Connexion à un compte utilisateur
>  >  ```JavaScript
>  >  POST http://localhost:3000/auth/login/
>  >  
>  >  // Format JSON
>  >  {
>  >      "login": "user_1",
>  >      "password": "psswd"
>  >  }
>  >  ```
>  > La requête retourne un token de connexion (Bearer token) permettant d'authentifier la session active, à renseigner dans l'onglet `Auth` de Postman.
> > #
> > - ### Création de produit
> > ```JavaScript
> > POST http://localhost:3000/product/
> > 
> > // Format JSON
> > {
> >     "name": "Sundae",
> >     "category": "Ice Cream",
> >     "price": 3.50
> > }
> > ```
> > #
> > - ### Création de menu
> > ```JavaScript
> > POST http://localhost:3000/menu/
> > 
> > // Format JSON
> > {
> >     "name": "Big Mac",
> >     "size": "Maxi",
> >     "price": 9.7
> > }
> > ```
> > #
> > - ### Création de commande
> > ```JavaScript
> > POST http://localhost:3000/order/
> > 
> > // Format JSON
> > {
> >     "menu": "Big Mac", // Facultatif
> >     "price": 9.7 // Obligatoire
> > }
> > ```
> #
> > ## Méthodes GET
> > - ### Récupérer tous les produits
> > ```JavaScript
> > GET http://localhost:3000/product/
> > ```
> > #
> > - ### Récupérer un produit par son id
> > ```JavaScript
> > GET http://localhost:3000/product/<product_id>
> > ```
> > #
> > - ### Récupérer tous les menus
> > ```JavaScript
> > GET http://localhost:3000/menu/
> > ```
> > #
> > - ### Récupérer un menu par son id
> > ```JavaScript
> > GET http://localhost:3000/menu/<menu_id>
> > ```
> > #
> > - ### Récupérer toutes les commandes
> > ```JavaScript
> > GET http://localhost:3000/order/
> > ```
> > #
> > - ### Récupérer une commande par son id
> > ```JavaScript
> > GET http://localhost:3000/order/<order_id>
> > ```
> #
> >  ## Méthodes PATCH
> > 
> > - ### Modifier un produit
> > ```JavaScript
> > PATCH http://localhost:3000/product/<product_id>
> > 
> > // Format JSON
> > {
> >     "menu": "Sundae Caramel",
> >     "price": 3.75, 
> >     "promo": true
> > }
> >```
> >
> > - ### Modifier un menu
> >```JavaScript
> >PATCH http://localhost:3000/menu/<menu_id>
> >
> >// Format JSON
> > {
> >     "menu": "Big Mac Bacon",
> >     "price": 9.75, 
> >     "promo": true
> > }
> >```
> >
> > - ### Modifier une commande
> >```JavaScript
> >PATCH http://localhost:3000/order/<order_id>
> >
> > // Format JSON
> > {
> >     "available": "true",
> >     "status":"IN DELIVERY"
> > }
> > ```
> #
> > ## Méthodes DELETE
> > - ### Supprimer un produit
> > ```JavaScript
> > DELETE http://localhost:3000/product/<product_id>
> > ```
> >
> > - ### Supprimer un menu
> > ```JavaScript
> > DELETE http://localhost:3000/menu/<menu_id>
> > ```
> >
> > - ### Supprimer une commande
> > ```JavaScript
> > DELETE http://localhost:3000/order/<order_id>
> > ```