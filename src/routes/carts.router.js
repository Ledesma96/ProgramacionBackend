import { Router } from "express";
import CartManager from "../CartManager.js"

const cd = new CartManager()

const router = Router();

router.get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid)
    const carts = await cd.getCart()
    const cart = await carts.find((c) => c.cid === cid)
    try{
        if (cart){
            res.send(cart.products)
        } else {
            res.send("el carrito con el ID: " + cid + " no existe")
        }
        
    } catch (err){
        res.status(404).send("Ah ocurrido un error", err)
    }
    
})

router.post("/:cid", async (req, res) => {
    try {
      const cid = req.params.cid;
      await cd.createCart(cid);
      res.send("Se creó el carrito con ID: " + cid);
    } catch (error) {
      console.error(error);
      res.status(500).send("Ocurrió un error al crear el carrito");
    }
  });
  


router.post("/:cid/product/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid); 
    console.log(cid)
    console.log(pid)
    
  
    // Verificar si el carrito existe en la base de datos o en la memoria
    const cart = await cd.getCart(cid);
    
    
  
    if  (!cart) {
        return res.status(404).send("No se encontró el carrito especificado");
    } 
    try {
      // Agregar el producto al carrito utilizando la función addCart del CartManager
      await cd.addCart(cid, pid, 1);
  
      res.send("Producto agregado al carrito correctamente");
    } catch (error) {
      res.status(500).send("Error al agregar el producto al carrito");
    }
  });
  

export default router;

