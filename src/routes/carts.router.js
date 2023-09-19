import { Router } from "express";
import { CreateNewCart, add, deleteCartCompleted, deleteProduct, emptyCart, getCart, getCarts, updateOne } from "../controllers/carts.controllers.js";

const router = Router();

router.get("/", getCarts)
router.get("/:cid", getCart);
router.post("/", CreateNewCart)
router.post("/:cid/product/:pid", add)
router.delete("/:cid/products/:pid", deleteProduct)
router.delete("/:cid",deleteCartCompleted)
router.put("/:cid/products/:pid", updateOne)
router.put("/:cid", emptyCart)

export default router;

