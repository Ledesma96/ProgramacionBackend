import { cartsServices } from "../services/index.js";
import CartsDTO from "../Dao/DTO/carts.dto.js";
import { logger } from "../config/logger.js"



export const getCarts = async(req, res) => {
    const carts = await cartsServices.getCarts()
    res.status(200).json(carts)
}

export const getCart = async(req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartsServices.getFilterCart(cid)
        if (cart) {
          res.status(200).send(cart);
        } else {
          logger.warning('Cart not found, invalid id: ' + cid)
          res.status(400).send("El carrito con el ID: " + cid + " no existe");
        }
      } catch (err) {
        logger.error('An error occurred' + err.message)
        res.status(404).send("Ha ocurrido un error: " + err.message);
      }
}

export const CreateNewCart = async(req, res) => {
  try {
    const newCart = new CartsDTO({products: []})
    const cart = await cartsServices.createCart(newCart)
      if(cart){
        res.status(200).send("Carrito creado exitosamente")
      } else {
        logger.error('An unexpected error occurred')
        res.status(400).send("Ah ocurrido un error");
      }
    } catch (error) {
      logger.error('An error occurred' + error.message)
      res.status(404).send("Ha ocurrido un error: " + error.message);
  }
}

export const add = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const user = req.user
  const quantity = parseInt(req.body.quantity || 1)
  try {
    const responseCart = await cartsServices.addProductCart(cid, pid, quantity, user)
    if(responseCart.success){
      res.status(201).json({success: responseCart.success, message: responseCart.message})
    }
  } catch (error) {
    logger.error('An error occurred' + error.message)
    res.status(500).json({message:"Ah ocurrido un erro", error: error.messaage})  
  }
}

export const deleteProduct = async(req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid

  try {
    const responseDeletProduct = await cartsServices.deleteProductCart(cid, pid)
    if(responseDeletProduct.success){
      res.status(200).json({success: responseDeletProduct.success ,message: "Producto eliminado con exito"})
    } else {
      res.status(400).json({ message: responseDeletProduct.message });
    }
  } catch (error) {
    logger.error('An error occurred' + error.message)
    res.status(500).json({message: "Ah ocurrido un error inesperado", error})
  }
}

export const deleteCartCompleted = async(req, res) => {
  const cid = req.params.cid;
  try {
    const cartDeletedResponse = await cartsServices.deleteCart(cid);
    if (cartDeletedResponse.success) {
      res.status(200).json({ message: cartDeletedResponse.message });
    } else {
      logger.warning('Cart not found, invalid id: ' + cid)
      res.status(400).json({ message: cartDeletedResponse.message });
    }
  } catch (error) {
    logger.error('An error occurred' + error.message)
    res.status(500).json({ message: "Ha ocurrido un error inesperado", error });
  }
}

export const updateOne = async(req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = parseInt(req.body.quantity || 1)
  try {
    const responseUpdate = await cartsServices.updateProductInCart(cid, pid, quantity)
    if(responseUpdate.success){
      res.status(201).json({message: responseUpdate.message})
    } else {
      res.status(400).json({message: responseUpdate.message})
    }
  } catch (error) {
    logger.error('An error occurred' + error.message)
    res.status(500).json({messaage:" Ah ocurrido un error inesperado", error: error})
  }
}

export const emptyCart = async (req, res) => {
  const cid = req.params.cid;
  try {
    const responseEmptyCart = await cartsServices.clearCart(cid)
    if(responseEmptyCart.success){
      res.status(201).json({message: responseEmptyCart.message})
    } else {
      res.status(400).json({message: responseEmptyCart.message})
    }
  } catch (error) {
    logger.error('An error occurred' + error.message)
    res.status(500).json({message: "Ah ocurrido uh eror inesperado", error: error})
  }
}

export const cartPurchase = async (req, res) => {
  const cid = req.params.cid;
  const email = req.query.purchaser;
  try {
      await cartsServices.cartPurchase(cid, email);
      res.status(200).send({succes: true, message: "ticket creado con exito"})
  } catch (error) {
      logger.error('An error occurred' + error.message)
      res.status(404).send({succes: false, message: error.message})
  }
}