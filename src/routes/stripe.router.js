import { Router } from "express";
import { StripePayment } from "../controllers/stipe.controllers.js";

const router = Router();

router.post('/payment', StripePayment)

export default router;