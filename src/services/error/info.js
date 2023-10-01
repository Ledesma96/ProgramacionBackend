export const generateUserErrorInfo = (user) => {
    return 
    `
    Algunos campos se encuentran incompletos.
    Todos los campos son obligatorios.
     detalles:
     -first_name: ${user.first_name}
     -last_name: ${user.last_name}
     -email: ${user.email}
    `
}

export const ErrorGetProductById = (product) => {
    return `
        No se encontro el prodcuto solicitado.
        Id: ${product.id}
    `
}

export const ErrorGetProducts = () => {
    return `
    Lista de productos no encontrada`
}