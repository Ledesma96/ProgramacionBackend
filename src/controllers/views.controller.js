import ViewsServices from "../services/views.services.js";

const viewsServices = new ViewsServices()



export const getProductsViews = async(req, res) => {
    const limit = parseInt(req.query?.limit || 5);
    const page = parseInt(req.query?.page || 1);
    const sort = parseInt(req.query?.sort || 1)
    const category = req.query?.category || null;
    try {
        const products = await viewsServices.getProductsPaginate(limit, page, sort, category)
        if(products){
            res.status(201).render("home", products)
        } else {
            res.status(400).json({message: "Error al obtener los products"})
        }
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error inesperado"})
    }
}

export const renderLogin = (req, res) => {
    res.render("login", {})
}

export const renderRegister = (req, res) => {
    res.render("registre", {})
}

export const renderProfile = (req, res) => {
    const user = req.user

    res.render("profile", user)
}

export const renderDetailProduct = async(req, res) => {
    const id = req.params._id;

    try {
        const product = await viewsServices.getProductDetail(id)
        res.status(201).render("detail", product)
    } catch (error) {
        res.status(500).json({mssage: "Ocurrio un error inesperado"})
    }
}