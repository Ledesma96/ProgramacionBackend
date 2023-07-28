import { Router } from "express";
// import CartManager from "../Dao/CartManager.js"
import cartModel from "../Dao/models/cart.model.js";
import productsModel from "../Dao/models/products.models.js";


// const cd = new CartManager()

const router = Router();

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid
    // const carts = await cd.getCart()
    // const cart = await carts.find((c) => c.cid === cid)
    const cart = await cartModel.findById(cid)
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

router.post("/", async (req, res) => {
    try{
        // const cid = parseInt(1);
        // await cd.crateeCart(cid)
        new cartModel({products:[]}).save()
        res.send("se ah creado el carrito")
    } catch (e) {
        res.status(500).send("ocurrio un error al crear el carrito")
    }
})
  


router.post("/:cid/product/:pid/:quantity", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid; 
    const quantity = parseInt(req.params.quantity)

    try{
        let cart = await cartModel.findById(cid)
        let productos = await productsModel.findById(pid)
        

        if(!cart){
           cart = new cartModel({products:{pid,quantity}});
           await cart.save();
        }
        if (productos){
            const existProduct = cart.products.find(
                (item) => item.pid === pid
            )
            if(existProduct){
                existProduct.quantity += quantity
                await cart.save()
            } else {
                cart.products.push({ pid, quantity });
                await cart.save()
            }
            res.send("producto gaurdado con exito")
        } else {
            res.send("no existe el producto")
        }
    }catch (e) {
        console.error("Error al guardar el producto:", e);
        res.status(500).send("Error al guardar el producto en el carrito");
    }
    // if(cid > 0){
    //     const cart = await cartModel.findById(cid)
    //     if  (!cart) {
    //         return res.status(404).send("No se encontró el carrito especificado");
    //     } 
    //     try {
    //     await cartModel.updateOne(filter, updateData )
    //     res.send("Producto agregado al carrito correctamente");
    //     } catch (error) {
    //     res.status(500).send("Error al agregar el producto al carrito");
    //     }
    // } else {
    //     res.status(404).send("Imposible acceder a carritos de id menor o igual a 0")
    // }
  });
  

export default router;

