import productsModel from "./models/products.model.js";

class ViewsServices{
    getProductsPaginate = async(limit, page, sort, category) => {
        const filterCategory = category ? { category } : {};
        try {
            const products = await productsModel.paginate(filterCategory, {
                page,
                limit,
                sort:{price: sort},
                lean: true,
            })
            products.nextLink = products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}&sort=${sort}` : "";
            products.prevLink = products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}&sort=${sort}` : "";
            products.nextPagee = products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}&sort=${sort}` : "";
            products.prevPagee = products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}&sort=${sort}` : "";
            return products
        
        } catch (error) {
            throw error
        }
    }

    getProductDetail = async(id) => {
        const product = await productsModel.findById(id).lean().exec();
        return product
    }

    getAllProducts = async () => {
        const products = await productsModel.find().lean().exec();
        return products
    }

    
}

export default ViewsServices