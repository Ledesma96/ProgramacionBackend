import CustomError from "../../services/error/custom_error.js";
import EErrors from "../../services/error/enums.js";
import { ErrorGetProductById } from "../../services/error/info.js";
import productsModel from "./models/products.model.js";
import mongoose from "mongoose";
import usersModel from "./models/users.model.js";
import transport from "../../config/mailing.js";

class ProductServices{
    constructor(){
        this.productsModel = new productsModel()
    }

    getAllProducts = async() => {
      try {
        let products = await productsModel.find();
        return products
      } catch (error) {
       return {message: "Error al obtener los productos"}
      }
    }

    getProducts = async(limit) => {
        try {
            let products = await productsModel.find();
            if (limit !== undefined) {
              const parsedLimit = parseInt(limit);
              if (!isNaN(parsedLimit)) {
                if (parsedLimit <= products.length) {
                    products = products.slice(0, parsedLimit)
                    return products;
                }
                return {message: `La cantidad de productos es: ${products.length}`};
              }
            }
            return products
          } catch (error) {
           return {message: "Error al obtener los productos"}
          }
    }

    getProductById = async(id) => {
      try {
        const product = await productsModel.findById(id)
        console.log(product);
        if (!product){
          return CustomError.createError({
            name: "getProductById",
            cause: ErrorGetProductById(id),
            message: "Product not found",
            code: EErrors.NOT_ACCEPTABLE_ERROR
          })
        }
        return product
      } catch (error) {
        return {success: false, message: error.message}
      }
    }

    addProducts = async(product) => {
      try{
        const newProduct = new productsModel(product)
        await newProduct.save()
        return {succes: true, message: "Producto cargado exitosamente"}
      } catch (error){
        return {success: false, message: error.message}
      }
    }

    deleteProduct = async (id, email) => {
      try {
        const user = await usersModel.findOne({ email: email });
        if (user) {
          if (user.rol === 'admin') {

            const product = await productsModel.findById(id);

            const deletionResponse = await productsModel.deleteOne({ _id: id });

            if (deletionResponse.deletedCount > 0) {

              if(product.owner !== 'admin'){

                const result = await transport.sendMail({
                  from: 'mailingprueba61@gmail.com',
                  to: product.owner,
                  subject: 'Cuenta eliminada',
                  html: `<div>
                          <p> Se ha eliminado ${product.title} de la lista de productos</p>
                        </div>`
              });
              }
              return { success: true, message: "Producto eliminado exitosamente" };
            } else {
              return { success: false, message: "Producto no encontrado" };
            }
          } else if (user.rol === 'premium') {
            const product = await productsModel.findById(id);
            if (product && product.owner === email) {
              const deletePremium = await productsModel.deleteOne({ _id: id });
              if (deletePremium.deletedCount > 0) {
                return { success: true, message: "Producto eliminado exitosamente" };
              } else {
                return { success: false, message: "No puedes eliminar este producto" };
              }
            } else {
              return { success: false, message: "No puedes eliminar este producto" };
            }
          } else {
            return { success: false, message: "Rol de usuario no válido" };
          }
        } else {
          return { success: false, message: "Usuario no encontrado" };
        }
      } catch (error) {
        return { success: false, message: error.message };
      }
    };
    

    updateProduct = async (id, updateData) => {
      try {
        const newID = new mongoose.Types.ObjectId(id)
        const updateResponse = await productsModel.updateOne(
          { _id: newID},
          { $set: updateData  }
        );
        if (updateResponse.modifiedCount > 0) {
          return { success: true, message: "Precio del producto actualizado exitosamente" };
        } else {
          return { success: false, message: "Producto no encontrado" };
        }
      } catch (error) {
        return { success: false, message: error.message };
      }
    };
}

export default ProductServices