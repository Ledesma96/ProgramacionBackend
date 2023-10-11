import Products from "./ProductManager.js";
const ProductsManager = new Products()
export default class View {
    constructor() {
    }

    getProductsPaginate = async (limit, page, sort, category) =>{
        try {
            console.log(limit);
            const products = await ProductsManager.getProducts()
    
            // Filtrado por categoría si category no es null
            if (category !== null) {
                products = products.filter(product => product.category === category);
            }
    
            // Ordenamiento
            if (sort === 1) {
                products.sort((a, b) => a.price - b.price);
            } else if (sort === -1) {
                products.sort((a, b) => b.price - a.price);
            }
    
            // Calcular el índice inicial y final para la paginación
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
    
            // Obtener los productos de la página actual
            const pagedProducts = products.slice(startIndex, endIndex);
            return {docs: pagedProducts};
        } catch (error) {
            console.log('Hubo un error al obtener los productos:', error);
            throw error;
        }
    }

    getProdutcsAll = async () => {
        const products = await ProductsManager.getProductsAll();
        return  products
    }

    getProductDetail= async (id) => {
        const products = await ProductsManager.getProductsAll();
        const product = products.find((prod) => prod.id === id)
        return product
    }

}