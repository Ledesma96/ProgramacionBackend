import { Products, Carts, Ticket, View } from "../Dao/factory.js";
import ProductsRepository from "./products.services.js";
import CartRepository from "./cart.services.js";
import TikcetRepository from "./ticket.services.js";
import UsersRepository from "./users.services.js";
import ViewsRepository from "./view.services.js";
import UserServices from "../Dao/mongo/user.mongo.js";


const productsServices = new ProductsRepository(new Products());
const cartsServices = new CartRepository(new Carts());
const ticketServices = new TikcetRepository(new Ticket());
const viewsServices = new ViewsRepository(new View());
const userServices = new UsersRepository(new UserServices());

export { productsServices, cartsServices, ticketServices, userServices, viewsServices};
