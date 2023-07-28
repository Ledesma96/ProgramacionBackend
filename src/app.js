import express from "express";
import { Server, Socket } from "socket.io";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"
import handlebars  from "express-handlebars";
import mongoose from "mongoose";
import productsModel from "./Dao/models/products.models.js";
import __dirname from "./uitils.js";
import messagesModel from "./Dao/models/messages.models.js";
// import ProductManager from "./Dao/models/products.models.js";


// const pd = new ProductManager()

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use('/static', express.static('public'));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars")

app.use("/", viewsRouter)
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const url = "mongodb+srv://gabrielmledesma96:Lolalaloca1@cluster0.a4qufb6.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(url, {
  dbName: "ecommerce"
})
  .then(() => {
    console.log("DB connected!!");
    const port = 8080;
    const hhtpServer = app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);

      const io = new Server(hhtpServer)

      io.on("connection", async socket => {

        console.log("cliente conectado");

        socket.on("new-product", async (product) => {
          const productCreated = new productsModel(product)
          await productCreated.save()
          const products = await productsModel.find().lean().exec()
          io.emit("product-added", products);
        })

        //intercambio de informacion del chat
        socket.on("new-user", async user => {
          console.log(`${user} se acaba de conectar`);
          const userCreated = new messagesModel(user)
          await userCreated.save()
        })

        socket.on("message", async data => {
          const message = data.message;
          const user = data.user;
          const filter = { user: user };
          const updateData = { $push: { message: message } };
          try {
            await messagesModel.updateOne(filter, updateData);
  
            io.emit("logs", data);
          } catch (error) {
            console.error("Error al agregar el mensaje al usuario:", error);
          }
          
        })
      })
    });
  })
  .catch (e => {
    console.log("can´t connect to DB");
  })

