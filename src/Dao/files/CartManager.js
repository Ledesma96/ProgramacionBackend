import fs from "fs";
import ProductManager from "./ProductManager.js";

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
}
