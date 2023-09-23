export default class Cart{
    constructor(){
        this.id = 1
        this.cart = [];
    }

    getCarts = async() => {
        return this.cart;
    }

    getFilterCart = async(id) =>{
        const cart = this.cart.find(item => item.id == id);
        return cart;
    }

    createCart = async() => {
        const newCart = {
            id: this.cart.length + 1,
            products: []
        }
        this.cart.push(newCart);
        return newCart;
    }

    addProductsCart = async(cid, pid, quantity) => {
        try {
            const cart = await this.cart.find(item => item.id == cid);
            const products = products.find(product => product.id == pid);
            if (!cart){
                throw new Error('Cart not found');
            }
                if (products){
                    const existingProduct = cart.products.find(item => item.id == pid);
                    if (existingProduct){
                        existingProduct.quantity += quantity;
                    } else {
                        cart.products.push({
                            id: pid,
                            name: products.name,
                            price: products.price,
                            quantity: quantity
                        });
                    }
                    return({success: true, message: "producto guardado con exito"})
                } else{
                    return {seccess: false, message: "no existe el producto"}
                }
        } catch (error) {
            
        }
    }

    deleteProductsCart = async(cid, pid) => {
        try {
            const cart = await this.cart.find(cid)
            if(cart){
                const product = await cart.products.find(item => item.id == pid);
                if(product){
                    const index = cart.products.indexOf(product);
                    cart.products.splice(index, 1);
                    return({success: true, message: "producto eliminado con exito"})
                } else {
                    return {success: false, message: "no existe el producto"}
                }
            } else {
                return {success: false, message: "cart not found"}
            }
        } catch (error) {
            return {success: false, message:error.message}
        }
    }

    deleteCart = async (id) => {
        try {
            const cart = this.cart.findIndex((item) => item.id == id)
            if(cart === -1){
                return {success: false, message: "No se encontro carrito"}
            }
            this.cart.splice(cart, 1);

            return {success: true, message: "Se eliminado con exito"}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    updateProductInCart = async (cid, pid, quantity)=> {
        try {
            const cart = await this.cart.find(cid)
            if(cart){
                const product = await cart.products.find(item => item.id == pid);
                if(product){
                    product.quantity += quantity;
                    return({success: true, message: "producto actualizado con exito"})
                } else {
                    return {success: false, message: "no existe el producto"}
                }
            } else {
                return {success: false, message: "cart not found"}
            }
        } catch (error) {
            return {success: false, message:error.message}
        }
    }

    clearCart = async(id) => {
        try {
            const cart = this.cart.find(id)
            if(cart){
                cart.products = [];
                return({success: true, message: "carrito vaciado con exito"})
            } else {
                return {success: false, message: "cart no encontrado"}
            }
        } catch (error) {
            return {success: false, message: error.message}
        }
    }
}