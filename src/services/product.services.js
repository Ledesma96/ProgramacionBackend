import productsModel from "../Dao/models/products.models.js";

class ProductServices{
    constructor(){
        this.productsModel = new productsModel()
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
            console.log(error);
           return {message: "Error al obtener los productos"}
          }
    }
}

export default ProductServices