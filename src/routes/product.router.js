import { Router } from "express";
import { getProducts, getProductById, createProduct, deleteProduct, updateProduct } from "../controllers/products.controllers.js";
import { upload } from "../middlewere/file.js";

const router = Router()



router.get("/", getProducts);
router.get("/:pid", getProductById)
router.post("/", upload.array('products'), createProduct)
router.delete("/:pid", deleteProduct);
router.put("/:pid", updateProduct)



export default router