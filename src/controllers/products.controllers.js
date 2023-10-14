import { productsServices } from "../services/index.js";
import ProductsDTO from "../Dao/DTO/products.dto.js";



export const getProducts = async(req, res) => {
    const limit = req.query?.limit || 4;
    const products = await productsServices.getProducts(limit)
    try {
        if(products){
            res.status(201).send(products)
        } else {
            res.status(400).json({message: products.message})
        }  
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(500).json({message: "Ocurrio un error inesperado", error: error})
    }
}

export const getProductById = async(req, res) => {
    const id = req.params.pid
    const product = await productsServices.getProductById(id)
    try {
        if(product){
            res.status(201).send(product)
        } else {
            res.status(400).json("Ocurrio un error, parece que el producto no existe")
        }  
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(500).json({message: "Ocurrio un error inesperado", error: error.message})
    }
}

export const createProduct = async(req, res) => {
    const product = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
        code: req.body.code,
        stock: req.body.stock,
        category: req.body.category
    };

    const DTO = new ProductsDTO(product);
    const newProduct = await productsServices.addProducts(DTO)
    try {
        if(newProduct){
            res.status(201).send(newProduct)
        } else {
            res.status(400).json({message: newProduct.message})
        }  
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(500).json({message: "Ocurrio un error inesperado", error: error})
    }
}

export const deleteProduct = async(req, res) => {
    const id = req.params.pid
    const product = await productsServices.deleteProduct(id)
    try {
        if(product){
            res.status(201).send(product)
        } else {
            res.status(400).json({message: product.message})
        }  
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(500).json({message: "Ocurrio un error inesperado", error: error})
    }
}

export const updateProduct = async(req, res) => {
    const id = req.params.pid
    const product = await productsServices.updateProduct(id, req.body)
    try {
        if(product){
            res.status(201).send(product)
        } else {
            res.status(400).json({message: product.message})
        }  
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(500).json({message: "Ocurrio un error inesperado", error: error})
    }
}