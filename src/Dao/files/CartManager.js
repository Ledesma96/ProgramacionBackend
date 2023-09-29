import fs from "fs";
import ProductManager from "./ProductManager.js";
import TicketsManager from "./TicketManager.js";

const pd = new ProductManager();

export default class CartManager {
    #id = 0;
    #path = undefined;

    constructor() {
        if (!fs.existsSync("./cart.json")){
            fs.writeFileSync("./cart.json", JSON.stringify([]));
        }
        this.#path = "./cart.json"
    }

    
    async getCarts() {
        try {
            const content = await fs.promises.readFile(this.#path, "utf-8");
            return JSON.parse(content);
        } catch (error) {
            console.log("No se pudo obtener el carrito", error);
        }
    }
    
    async #getID(cid) {
        let newCid = cid;
        const actualCart = await this.getCart();
        while (actualCart.some((cart) => cart.cid === newCid)) {
          newCid++;
        }
        return newCid;
      }
      

    async crateCart(cid = undefined){
        try{
            const actualCart = await this.getCart();
            const existingCart = actualCart.find((c) => c.cid === cid)
            if(existingCart){
                const newCart ={
                    cid: await this.#getID(cid),
                    products:[]
                }
                actualCart.push(newCart)
                await fs.promises.writeFile(this.#path, JSON.stringify(actualCart));
            } else {
                const newCart ={
                    cid: cid,
                    products:[]
                }
                actualCart.push(newCart)
                console.log("se creo el carrito de id: " + cid );
                await fs.promises.writeFile(this.#path, JSON.stringify(actualCart));
            } 
        }catch (e) {
            console.log("ocurrio un error al agregar el carrito", e);
        }
    }

    async createCart(cid = undefined) {
        try{
            if(cid > 0){
                const actualCart = await this.getCart();
                const existingCart = actualCart.find((c) => c.cid === cid);
                if (existingCart) {
                    const newCart = {
                        cid: await this.#getID(cid),
                        products: []
                    };
                    actualCart.push(newCart);
                    await fs.promises.writeFile(this.#path, JSON.stringify(actualCart));
                    console.log("El carrito con ID: " + cid + " ya existe." + "sin embargo, se creo un carrito con el ID: "+ (await this.#getID(cid) - 1));
                } else {
                    const newCart = {
                        cid: await this.#getID(cid),
                        products: []
                    };
                    actualCart.push(newCart);
                    await fs.promises.writeFile(this.#path, JSON.stringify(actualCart));
                }
            } else {
                console.log("no es posible crear un carrito con id menor o igual a 0");
            }
        } catch {

        }
        
      }

      async getFilterCart(cid){
        try {
            const carts = await this.getCart();
            const filterCart = carts.filter((c) => c.id === cid);
            return filterCart;
        } catch (error) {
            return {success: false, message: error.messagge}
        }
      }
      
    
      

    async addCart(cid= undefined, pid = undefined, quantity = undefined) {
        try {
                const product = {
                    pid: pid,
                    quantity: quantity
                  };
                  const actualCart = await this.getCart();
                  const existingCart = actualCart.find((c) => c.cid === cid);
        
                  const products = await pd.getProducts();
                  const actualProcut = products.find((p) => p.id === pid)
                  if(actualProcut){
              
                  if (existingCart) {
                    console.log(existingCart.products);
                    const existingProduct = existingCart.products.find((p) => p.pid === pid);
                    console.log(existingProduct);
              
                    if (existingProduct) {
                      existingProduct.quantity += quantity;
                    } else {
                      existingCart.products.push(product);
                    }
                  } else {
                    console.log("el carrito de ID: ", cid, " no existe");
                  }
              
                  await fs.promises.writeFile(this.#path, JSON.stringify(actualCart));
                } else {
                    console.log("no se encontro producto");
                }
        } catch (error) {
          console.log("No se pudo agregar el producto al carrito", error);
        }
      } 

    async cartPurchase(cid, email) {
        try {
            
            const cart = await this.getFilterCart(cid);
            const products = await pd.getProductsAll()
            const purchase = []
    
            if(!cart) return {success: false, message: "No se encontro el carrito"}
    
            for (let i = 0; i < cart.products.length; i++) {
                let actualProduct = cart.products[i]
    
                for (let j = 0; j < products.length; j++) {
                    const product = products[j];
    
                    if(actualProduct.pid.toString() == product.id.toString()) {
                        if(product.stock === actualProduct.quantity){
                            purchase.push(product.price * actualProduct.quantity)
                            product.stock -= actualProduct.quantity
                            cart.products.splice(i, 1)
                            await fs.promises.writeFile(this.#path, JSON.stringify(cart));
                            await fs.promises.writeFile('./products.json', JSON.stringify(products));
                        } else if (product.stock < actualProduct.quantity){
                            purchase.push(product.stock * product.price)
                            product.stock = 0;
                            actualProduct.quantity -= product.stock;
                            await fs.promises.writeFile(this.#path, JSON.stringify(cart));
                            await fs.promises.writeFile('./products.json', JSON.stringify(products));
                        } else {
                            purchase.push(product.price * actualProduct.quantity)
                            product.stock -= actualProduct.quantity
                            cart.products.splice(i, 1)
                            await fs.promises.writeFile(this.#path, JSON.stringify(cart));
                            await fs.promises.writeFile('./products.json', JSON.stringify(products));
                        }
                    }
                }
            }
            const total = purchase.reduce((total, init) => total + init, 0);
            const ticket = {
                amount : total,
                purchaser: email
            }
            const newTicket = await new TicketsManager.createTickets(ticket)
            await fs.promises.writeFile('./tickets.json', JSON.stringify(newTicket));
            return { success: true, message : "Ticket creado con exito"}
        } catch (error) {
            return { success: false, message: error.message }
        }
    }
}
