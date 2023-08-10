import { Router } from "express";
// import CartManager from "../Dao/CartManager.js"
import mongoose from "mongoose";
import cartModel from "../Dao/models/cart.model.js";
import productsModel from "../Dao/models/products.models.js";


// const cd = new CartManager()

const router = Router();

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    console.log(await cartModel.findOne({ _id: cid }));
  
    try {
      const cart = await cartModel.findOne({ _id: cid }).populate("products.pid");
      if (cart) {
        res.send(cart);
      } else {
        res.send("El carrito con el ID: " + cid + " no existe");
      }
    } catch (err) {
      res.status(404).send("Ha ocurrido un error: " + err.message);
    }
  });
  

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
  


router.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid; 
    const quantity = parseInt((req.body.quantity || 1))
    try{
        let cart = await cartModel.findById(cid)
        let productos = await productsModel.findById(pid)
        

        if(!cart){
           cart = new cartModel({products:{pid,quantity}});
           await cart.save();
        }
        if (productos){
            const existProduct = cart.products.find((item) => item.pid.toString() === pid);
            
            if(existProduct){
                existProduct.quantity += quantity
                await cart.save()
            } else {
                cart.products.push({ pid, quantity });
                await cart.save()
            }
            res.send({message: "producto gaurdado con exito"})
        } else {
            res.send({message: "no existe el producto"})
        }
    }catch (e) {
        console.error("Error al guardar el producto:", e);
        res.status(500).send({error: "Error al guardar el producto en el carrito"});
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

router.delete("/:cid/products/:pid", async(req, res) => {
    const {cid, pid} = req.params;
    const cartId = mongoose.Types.ObjectId.createFromHexString(cid)
    const productID = mongoose.Types.ObjectId.createFromHexString(pid)

    try {
        const result = await cartModel.updateOne(
          { _id: cartId},
          { $pull: { products: { _id: productID } } }
        );
         console.log(result);
         
        if (result.acknowledged > 0) {
          res.status(204).send("Producto eliminado exitosamente");
        } else {
          res.status(404).send("Producto no encontrado en el carrito");
        }

    } catch (e){
        res.status(404).send({ error: "Ha ocurrido un error", message: e.message });
    }
})

router.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;

    const cart = await cartModel.findById(cid)

    try {
        if(!cart){
            res.send("El carrido con id: " + cid + " no existe")
        } else {
            await cartModel.updateOne({_id: cid},{$set:{products:[]}})
            res.send("Todos los productos fueron eliminados exitosamente")
        }
    } catch (error) {
        res.status(404).send("Ah ocurrido un erro inesperado")
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    const {cid, pid} = req.params;
    const quantity = req.body.quantity || 1
    let cart = await cartModel.findById(cid)

    try {
        const product = cart.products.find((item) => item.pid.toString() === pid)

        if(!product){
             res.send("El producto que intenta actualizar no existe")
         } else {
             product.quantity += quantity;
             cart.save();
             res.send("Producto actualizado correctamente")
         }
    } catch (e) {
        res.status(404).send({ error: "Ha ocurrido un error", message: e.message })
    }
})


  

export default router;

