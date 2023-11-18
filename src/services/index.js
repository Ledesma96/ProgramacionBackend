import { Products, Carts, Ticket, View, User } from "../Dao/factory.js";
import ProductsRepository from "./products.services.js";
import CartRepository from "./cart.services.js";
import TikcetRepository from "./ticket.services.js";
import UsersRepository from "./users.services.js";
import ViewsRepository from "./view.services.js";


const productsServices = new ProductsRepository(new Products());
const cartsServices = new CartRepository(new Carts());
const ticketServices = new TikcetRepository(new Ticket());
const viewsServices = new ViewsRepository(new View());
const usersServices = new UsersRepository(new User());


export { productsServices, cartsServices, ticketServices, usersServices, viewsServices};
