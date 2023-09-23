import { Router } from "express";
import { getProducts, getProductById, createProduct, deleteProduct, updateProduct } from "../controllers/products.controllers.js";

const router = Router()

router.get("/", getProducts);
router.get("/:pid", getProductById)
router.post("/", createProduct)
router.delete("/:pid", deleteProduct);
router.put("/:pid", updateProduct)



export default router