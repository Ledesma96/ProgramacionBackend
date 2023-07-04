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
    const cid = parseInt(req.params.cid);
    if(cid > 0){
        try {
            await cd.createCart(cid);
            res.send("Se creó el carrito con ID: " + cid);
        } catch (error) {
            console.error(error);
            res.status(500).send("Ocurrió un error al crear el carrito");
        }
    } else {
        res.status(404).send("ocurrio un error al crear el carrito de ID menor o igual a 0")
    }
    
  });

router.post("/", async (req, res) => {
    try{
        const cid = parseInt(1);
        await cd.crateeCart(cid)
        res.send("se ah creado el carrito")
    } catch (e) {
        res.status(500).send("ocurrio un error al crear el carrito")
    }
    
    
})
  


router.post("/:cid/product/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid); 
    if(cid > 0){
        const cart = await cd.getCart(cid);
        if  (!cart) {
            return res.status(404).send("No se encontró el carrito especificado");
        } 
        try {
        await cd.addCart(cid, pid, 1);
        res.send("Producto agregado al carrito correctamente");
        } catch (error) {
        res.status(500).send("Error al agregar el producto al carrito");
        }
    } else {
        res.status(404).send("Imposible acceder a carritos de id menor o igual a 0")
    }
  
    
    
  });
  

export default router;

