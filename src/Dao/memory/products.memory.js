export default class products{
    constructor(){
        this.id = 1
        this.products = [];
    }

    getProducts = async () => {
        try {
            const actualprods = await this.getProducts();
            return {success: true, products: actualprods}
        } catch (error) {
            return { success: false, error: error}
        }
    }

    addProduct = async (
        title = undefined,
        description = undefined,
        price = undefined,
        thumbnail = [],
        code = undefined,
        stock = undefined,
        status = true,
        category = undefined
    ) => {
        try {
            const id = this.products.length + 1; // Generar un nuevo ID único
            const product = {
                id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category,
            };
            this.products.push(product);
            return { success: true };
        } catch (error) {
            return { success: false, error: error };
        }
    };

    getProductById = async(id) => {
        try {
            const product = await this.products.find(p => p.id === id);
            return {success: true, product}
        } catch (error) {
            return { success: false, error: error}
        }
    }

    updateProduct = async (id, updateFields) => {
        try {
            const actualprods = await this.getProducts();
    
            const productIndex = actualprods.findIndex((prod) => prod.id === id);
    
            if (productIndex === -1) {
                throw new Error(`No se encontró producto con el ID: ${id}`);
            }
    
            const updatedProduct = {
                ...actualprods[productIndex],
                ...updateFields
            };
    
            actualprods[productIndex] = updatedProduct;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
}