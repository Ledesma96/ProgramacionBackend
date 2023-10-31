export default class ProductsRepository{
    constructor(dao){
        this.dao = dao;
    }

    getAllProducts = async() => {
        return await this.dao.getAllProducts();
    }

    getProducts = async(limit) => {
        return await this.dao.getProducts(limit)
    }

    getProductById = async(id) => {
        return await this.dao.getProductById(id)
    }

    addProducts = async(product) => {
        return await this.dao.addProducts(product)
    }

    deleteProduct = async(id, email) => {
        return await this.dao.deleteProduct(id, email)
    }

    updateProduct = async(id, updateData) => {
        return await this.dao.updateProduct(id, updateData)
    }

}