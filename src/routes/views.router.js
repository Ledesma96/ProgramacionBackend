import { Router } from "express";
// import ProductManager from "../Dao/ProductManager.js";
import productsModel from "../Dao/models/products.models.js";
import messageModel from "../Dao/models/messages.models.js"

// const pd = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
    const products = await productsModel.find().lean().exec()
    res.render("home", {products})
})

router.get("/products", async (req,res) => {
    const products = await productsModel.find().lean().exec()

    res.render("realTimeProducts", {products})
})


router.get("/chat", async (req, res) => {
  const messages = await messageModel.find().lean().exec()

  res.render("chat", {messages})
})


router.post("/products", async (req,res) => {
    // const title = req.body.title;
    // const description = req.body.description;
    // const price = parseInt(req.body.price);
    // const thumbnail = req.body.thumbnail;
    // const code = parseInt(req.body.code);
    // const stock = parseInt(req.body.stock);
    // const category = req.body.category;
    // const result = await pd.addProduct(title, description, price, thumbnail, code, stock,true, category)

    const productNew = req.body;

    try {
        const productCreated = new productsModel(productNew);
        await productCreated.save();
        res.redirect('/');
      } catch (error) {
        console.error(error);
        res.redirect('/error');
      }
})
 

export default router