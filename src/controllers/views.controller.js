import { View } from "../Dao/factory.js";
import CustomError from "../services/error/custom_error.js";
import EErrors from "../services/error/enums.js";
import { ErrorGetProductById, ErrorGetProducts } from "../services/error/info.js";

const viewsServices = await new View

export const getProductsViews = async(req, res) => {
    const limit = parseInt(req.query?.limit || 5);
    const page = parseInt(req.query?.page || 1);
    const sort = parseInt(req.query?.sort || 1)
    const category = req.query?.category || null;
    const user = req.user.user
    try {
        const products = await viewsServices.getProductsPaginate(limit, page, sort, category)
        if(products){
            res.status(201).render("home", {
            products: products,
            user: user
        })
        } else {
            res.status(400).json({message: "Error al obtener los products"})
        }
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error inesperado", error: error.message})
    }
}

export const getProductsAll= async(req, res) => {
    try {
        const products = await viewsServices.getAllProducts();
        if(products){
            if(!products){
                return CustomError.createError({
                    name: "Error get by id",
                    cause: ErrorGetProducts(id),
                    message: "Product not found",
                    code: EErrors.NOT_FOUND_ERROR
                  })
            }
        }
        res.status(200).render("realTimeProducts", products)
        } catch (error) {
        res.status(500).json({message: "Ocurrio un error inesperado: ", error: error.message})
    }

}

export const renderLogin = (req, res) => {
    res.render("login", {})
}

export const renderRegister = (req, res) => {
    res.render("registre", {})
}

export const renderProfile = (req, res) => {
    const user = req.user

    res.render("profile", user)
}

export const renderDetailProduct = async(req, res) => {
    const id = req.params._id;
    try {
        const product = await viewsServices.getProductDetail(id)
        if(!product){
            return CustomError.createError({
                name: "getProductById",
                cause: ErrorGetProductById(id),
                message: "Product not found",
                code: EErrors.NOT_FOUND_ERROR
              })
        }
        res.status(201).render("detail", product)
    } catch (error) {
        res.status(500).json({mssage: "Ocurrio un error inesperado"})
    }
}

export const mokingProducts = async(req, res) => {
    try {
        const products = await viewsServices.getAllProducts()
        if (!products) {
            return CustomError.createError({
                name: "get products  error",
                cause: ErrorGetProducts(),
                message: "Product not found",
                code: EErrors.NOT_FOUND_ERROR
              })
        }
        res.render("mockingproducts",  {products})
    } catch (error) {
        return {success: false, message: "Product not found"}
    }


}