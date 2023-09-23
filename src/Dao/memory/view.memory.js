import Products from "./products.memory.js"
const ProductsMemory =new Products()
export default class Productsview {
    constructor() {
    }
    getProductsPaginate = async (page, limit, sort, category) =>{
        try {
            const products = ProductsMemory.getProducts()
            console.log(products);
    
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

    getProdutcsAll = async() => {
        return this.products;
    }

    getProductDetail = async (id) => {
        const product = this.products.find((product) => product.id === id);
        return product;
    }    
}