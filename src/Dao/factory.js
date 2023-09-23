import config from "../config/config.js";
import mongoose from "mongoose";
import 'dotenv/config.js';

export let Products
export let Carts
export let View
export let Ticket

switch (config.persistence) {
    case "MEMORY" :
      
        const {default: ViewMemory } = await import("./memory/view.memory.js");
        const {default: ProductsMemory } = await import("./memory/products.memory.js");
        const {default: CartsMemory} = await import("./memory/cart.memory.js");
        Products = ProductsMemory;
        Carts = CartsMemory;
        View = ViewMemory;
        break;

    case "FILE" :
        const {default: ProductsFile } = await import("./files/productManager.js");
        const {default: CartsFile} = await import("./files/cartManager.js");
        console.log("connected to file");
        Products = ProductsFile
        Carts = CartsFile
        break;

    case "MONGODB" :{
      
        const {default: ProductsMongo } = await import("./mongo/product.services.js");
        const {default: ViewMongo } = await import("./mongo/views.services.js");
        const {default: CartsMongo} = await import("./mongo/cart.services.js");
        const {default: TicketsMongo} = await import("./mongo/ticket.services.js")
        mongoose.connect(process.env.URL_MONGO, {
            dbName: "ecommerce"
          })
            .then(() => {
              console.log("DB connected!!");
             
            })
            .catch (e => {
              console.log("can´t connect to DB", e.message);
            })
        Products = ProductsMongo
        Carts = CartsMongo
        View = ViewMongo
        Ticket = TicketsMongo
        break;
    }
}