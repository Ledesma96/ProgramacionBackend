import { Router } from "express";
import { CreateNewCart, add, deleteCartCompleted, cartPurchase, deleteProduct, emptyCart, getCart, getCarts, updateOne } from "../controllers/carts.controllers.js";
const router = Router();

router.get("/", getCarts)
router.post("/", CreateNewCart)

router.get("/:cid", getCart);
router.delete("/:cid",deleteCartCompleted)
router.put("/:cid", emptyCart)

router.post("/:cid/product/:pid", add)
router.delete("/:cid/products/:pid", deleteProduct)
router.put("/:cid/products/:pid", updateOne)

router.post("/:cid/purchase", cartPurchase)

export default router;

