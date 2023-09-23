import { Carts } from "../Dao/factory.js";
import CartsDTO from "../Dao/DTO/carts.dto.js";

const cartService = new Carts()

export const getCarts = async(req, res) => {
    const carts = await cartService.getCarts()
    res.status(200).json(carts)
}

export const getCart = async(req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartService.getFilterCart(cid)
        if (cart) {
          res.send(cart);
        } else {
          res.send("El carrito con el ID: " + cid + " no existe");
        }
      } catch (err) {
        res.status(404).send("Ha ocurrido un error: " + err.message);
      }
}

export const CreateNewCart = async(req, res) => {
  try {
    const newCart = new CartsDTO({products: []})
    const cart = await cartService.createCart(newCart)
      if(cart){
        res.send("Carrito creado exitosamente")
      } else {
        console.log("Ah ocurrido un error");
      }
  } catch (error) {
      res.status(404).send("Ha ocurrido un error: " + error.message);
  }
}

export const add = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = parseInt(req.body.quantity || 1)
  try {
    const responseCart = await cartService.addProductCart(cid, pid, quantity)
    if(responseCart.success){
      res.status(201).json({message:responseCart.message})
    }
  } catch (error) {
    res.status(500).json({message:"Ah ocurrido un erro", error})  
  }
}

export const deleteProduct = async(req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid
  try {
    const responseDeletProduct = await cartService.deleteProductCart(cid, pid)
    if(responseDeletProduct.success){
      res.status(200).json({message: "Producto eliminado con exito"})
    } else {
      res.status(400).json({ message: responseDeletProduct.message });
    }
  } catch (error) {
    res.status(500).json({message: "Ah ocurrido un error inesperado", error})
  }
}

export const deleteCartCompleted = async(req, res) => {
  const cid = req.params.cid;
  try {
    const cartDeletedResponse = await cartService.deleteCart(cid);
    if (cartDeletedResponse.success) {
      res.status(200).json({ message: cartDeletedResponse.message });
    } else {
      res.status(400).json({ message: cartDeletedResponse.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error inesperado", error });
  }
}

export const updateOne = async(req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = parseInt(req.body.quantity || 1)
  try {
    const responseUpdate = await cartService.updateProductInCart(cid, pid, quantity)
    if(responseUpdate.success){
      res.status(201).json({message: responseUpdate.message})
    } else {
      res.status(400).json({message: responseUpdate.message})
    }
  } catch (error) {
    res.status(500).json({messaage:" Ah ocurrido un error inesperado", error: error})
  }
}

export const emptyCart = async (req, res) => {
  const cid = req.params.cid;
  try {
    const responseEmptyCart = await cartService.clearCart(cid)
    if(responseEmptyCart.success){
      res.status(201).json({message: responseEmptyCart.message})
    } else {
      res.status(400).json({message: responseEmptyCart.message})
    }
  } catch (error) {
    res.status(500).json({message: "Ah ocurrido uh eror inesperado", error: error})
  }
}

export const cartPurchase = async (req, res) => {
  const cid = req.params.cid;
  const email = req.body.email;
  try {
      await cartService.cartPurchase(cid, email);
      res.status(200).send({succes: true, message: "ticket creado con exito"})
  } catch (error) {
      res.status(404).send({succes: false, message: error.message})
  }
}