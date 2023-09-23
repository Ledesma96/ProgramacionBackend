export default class carts {
    constructor(cart){
        this.products = cart?.products ?? [];
    }
}