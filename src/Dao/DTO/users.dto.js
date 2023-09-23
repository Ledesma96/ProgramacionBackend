export default class users{
    constructor(user){
        this.first_name = user?.first_name ?? ''
        this.last_name = user?.last_name ?? ''
        this.age = user?.age ?? 0
        this.password = user?.password ?? ''
        this.email = user?.email ?? ''
        this.cartId = user?.cart ?? ''
        this.rol = user?.rol ?? 'user'
    }
}