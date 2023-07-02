import express from "express";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/carts.router.js";

const app = express();
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
