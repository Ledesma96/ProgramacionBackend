export default class CartRepository{
    constructor(dao){
        this.dao = dao;
    }

    getCarts = async() => {
        return this.dao.getCarts()
    }

    getFilterCart = async(cid) => {
        return this.dao.getFilterCart(cid)
    }

    createCart = async(newCart) => {
        return this.dao.createCart(newCart)
    }

    addProductCart = async(cid, pid, quantity, user) => {
        return this.dao.addProductCart(cid, pid, quantity, user)
    }

    deleteProductCart = async(cid, pid) => {
        return this.dao.deleteProductCart(cid, pid)
    }

    deleteCart = async(cid) => {
        return this.dao.deleteCart(cid)
    }

    updateProductInCart = async(cid, pid, quantity) => {
        return this.dao.updateProductInCart(cid, pid, quantity)
    }

    clearCart = async(cid) => {
        return this.dao.clearCart(cid)
    }

    cartPurchase = async(cid, email) => {
        return this.dao.cartPurchase(cid, email)
    }
}