import ProductServices from "../services/product.services.js";

const prductServices = new ProductServices()

export const getProducts = async(req, res) => {
    const limit = req.query?.limit || 4;
    const products = await prductServices.getProducts(limit)
    try {
        if(products){
            res.status(201).send(products)
        } else {
            res.status(400).json({message: products.message})
        }  
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error inesperado"})
    }
}