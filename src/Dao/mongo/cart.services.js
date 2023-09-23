import cartModel from "./models/cart.model.js"
import productsModel from "./models/products.models.js"
import TicketServices from "./ticket.services.js"

const ticketService = new TicketServices()

class CartServices {
    constructor(){
        this.cartModel = new cartModel()
    }
    getCarts = async() => {
        const carts = await cartModel.find()
        return carts
    }

    getFilterCart = async(id) => {
        const cart = await cartModel.findById(id).populate("products.pid")
        return cart
    }

    createCart = async(cart) => {
        try {
            const newCart = await new cartModel(cart).save();
            if(newCart){
                console.log("carrito creado exitosamente", newCart);
                return {success:true, message:"Carrito creado con exito"}
            } else {
                console.log("ocurrio un error al crear un carrito");
                return {success: false, message: "No se pudo crear el carrito"}
            }
        } catch (error) {
            throw error
        }
    }

    addProductCart = async(cid, pid, quantity) => {
        try{
            let cart = await cartModel.findById(cid)
            let productos = await productsModel.findById(pid)
            if(!cart){
                cart = new cartModel({products:{pid,quantity}});
                await cart.save();
                return {succes: true, message: "Se ha creado un nuevo carrito con el producto pedido"}
            }
                if (productos){
                    const existProduct = cart.products.find((item) => item.pid.toString() === pid);
                    if(existProduct){
                        existProduct.quantity += quantity
                        await cart.save()
                        return {success: true, message:"Se actualizo la cantidad en el carrito"}
                    } else {
                        cart.products.push({ pid, quantity });
                        await cart.save()
                    }
                    return({success: true, message: "producto guardado con exito"})
                    } else {
                        return {seccess: false, message: "no existe el producto"}
                }
        }catch (e) {
            throw e
        }
    }

    deleteProductCart = async(cid, pid) => {
        try {
            const result = await cartModel.updateOne(
              { _id: cid},
              { $pull: { products: { pid: pid} } }
            );
             console.log(result);
            if (result.acknowledged) {
                return { success: true, message: "Producto eliminado exitosamente" }
            } else {
                return { success: false, message: "No se encontró el producto en el carrito" };
            }
    
        } catch (e){
            throw e
        }
    }

    deleteCart = async(cid) => {
        try {
            const cartDeleted = await cartModel.deleteOne({_id: cid})
            if (cartDeleted.acknowledged) {
                return { success: true, message: "Carrito eliminado exitosamente" }
            } else {
                return { success: false, message: "No se encontró el carrito para eliminar" };
            }
        } catch (error) {
            throw error
        }
    }

    updateProductInCart = async (cid, pid, quantity) => {
        try {
            let cart = await cartModel.findById(cid)
            const product = cart.products.find((item) => item.pid.toString() === pid)
            if(!product){
                return {success: false, message:"El producto que intenta acutalizar no existe en el carrito"}
            } else {
                product.quantity += quantity;
                cart.save();
                return({success:true, message:"Producto actualizado correctamente"})
            }
        } catch (error) {
            throw error
        }
    }

    clearCart = async (cid) => {
        try {
            const cart = await cartModel.findById(cid)
            if(!cart) return ({success: false, message: "El carrito no existe"})
            cart.products = []
            cart.save()
            return({success: true , message:"Carrito modificado exitosamente"})
        } catch (error) {
            throw error
        }
    }

    cartPurchase = async (cid, email) => {
        try {
            const cart = await cartModel.findById(cid).populate("products.pid");
            const products = await productsModel.find();
            const purchase = [];
            if(!cart) return ({success: false, message: "El carrito no existe"})
            for (let i = 0; i < cart.products.length; i++) {
                let productInCart = cart.products[i];
                for (let j = 0; j < products.length; j++) {
                    const element = products[j];
                    if(productInCart.pid._id.toString() === element._id.toString()){
                        if(element.stock == productInCart.quantity){
                            purchase.push(element.price * productInCart.quantity)
                            cart.products[i].splice(i, 1)
                            await cart.save()
                            products[j].stock = 0
                            await products[j].save()
                        } else if (element.stock < productInCart.quantity) {
                            purchase.push(element.price * element.stock)
                            cart.products[i].quantity -= element.stock
                            await cart.save()
                            products[j].stock = 0
                            await products[j].save()
                        }  else {
                            element.stock -= productInCart.quantity
                            purchase.push(element.price * productInCart.quantity)
                            cart.products.splice(i, 1)
                            await cart.save()
                            products[j].stock -= productInCart.quantity
                            products.save()
                        }                      
                    }
                }
            }
            const total = purchase.reduce((total, init) => total + init, 0)
            const ticket = {
                amount: total,
                purchaser: "hola@gmail.com"
            }
            const newTicket = await ticketService.createTickets(ticket)
            newTicket.save()
            return {success: true, message: "Compra realizada con exito"}
        } catch (error) {
            return { success: false, message: error.message }
        }
    }
}



export default CartServices