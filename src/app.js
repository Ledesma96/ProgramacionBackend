import express from "express";
import { Server, Socket } from "socket.io";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"
import handlebars  from "express-handlebars";
import __dirname from "./uitils.js";
import ProductManager from "./ProductManager.js";

const pd = new ProductManager()

const app = express();
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use('/static', express.static('public'));
console.log();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars")

app.use("/", viewsRouter)
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const port = 8080;
const hhtpServer = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

const io = new Server(hhtpServer)

io.on("connection", async socket => {
  socket.on("new-product", async ({ title, price, description, thumbnail, code, stock, category }) => {
    await pd.addProduct (title, description, price, thumbnail, code, stock, true, category );
  })
  const products = await pd.getProducts();
  io.emit("product-added", products);
})