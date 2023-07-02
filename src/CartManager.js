import fs from "fs";

export default class CartManager {
    #id = 0;
    #path = undefined;

    constructor() {
        if (!fs.existsSync("./cart.json")){
            fs.writeFileSync("./cart.json", JSON.stringify([]));
        }
        this.#path = "./cart.json"
    }

    #getID(cid) {
        if(this.#id == cid){
            this.#id++;
        }
        
        return this.#id = cid;
    }

    async getCart() {
        try {
          const content = await fs.promises.readFile(this.#path, "utf-8");
          return JSON.parse(content);
        } catch (error) {
          console.log("No se pudo obtener el carrito", error);
        }
    }

    async createCart(cid = undefined) {
        console.log(cid);
        const actualCart = await this.getCart();
        const existingCart = actualCart.find((c) => c.cid === cid);
        console.log(existingCart);
      
        if (existingCart) {
          console.log("El carrito con ID: " + cid + " ya existe");
        } else {
          const newCart = {
            cid: cid,
            products: []
          };
          actualCart.push(newCart);
          await fs.promises.writeFile(this.#path, JSON.stringify(actualCart));
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
          console.log(existingCart);
      
          if (existingCart) {
            const existingProduct = existingCart.products.find((p) => p.pid === pid);
      
            if (existingProduct) {
              existingProduct.quantity += quantity;
            } else {
              existingCart.products.push(product);
            }
          } else {
            const newCart = {
              cid: this.#getID(cid),
              products: [product]
            };
            actualCart.push(newCart);
          }
      
          await fs.promises.writeFile(this.#path, JSON.stringify(actualCart));
        } catch (error) {
          console.log("No se pudo agregar el producto al carrito", error);
        }
      } 
}
