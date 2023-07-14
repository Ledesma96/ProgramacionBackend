import { Router } from "express";
import ProductManager from "../ProductManager.js";

const pd = new ProductManager();

const router = Router();

router.get("/", (req, res) => {
    res.render("home", {})
})

router.get("/products", async (req,res) => {
    const products = await pd.getProducts();

    res.render("realTimeProducts", {products})
})



router.post("/products", async (req,res) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = parseInt(req.body.price);
    const thumbnail = req.body.thumbnail;
    const code = parseInt(req.body.code);
    const stock = parseInt(req.body.stock);
    const category = req.body.category;
    const result = await pd.addProduct(title, description, price, thumbnail, code, stock,true, category)
})
 

export default router