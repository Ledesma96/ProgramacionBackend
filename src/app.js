import express from "express";
import { Server, Socket } from "socket.io";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"
import usersRouter from "./routes/users.router.js"
import handlebars  from "express-handlebars";
import mongoose from "mongoose";
import productsModel from "./Dao/models/products.models.js";
import __dirname from "./uitils.js";
import messagesModel from "./Dao/models/messages.models.js";
import MongoStore from "connect-mongo";
import session from "express-session";


// import ProductManager from "./Dao/models/products.models.js";
//url mango db
const url = "mongodb+srv://gabrielmledesma96:Lolalaloca1@cluster0.a4qufb6.mongodb.net/?retryWrites=true&w=majority"
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

app.use(session({
  store: MongoStore.create({
    mongoUrl: url,
    dbName: "session",
    mongoOptions:{
      useNewUrlParser: true,
      useUnifiedTopology:true
    },  
    ttl: 1000
  }),
  secret: "secret",
  resave:false,
  saveUninitialized:false
}))

app.use((req, res, next) => {
  const user = req.session.user || null;
  
  if(user) {
    res.locals.user = user.first_name
    return next()
  }
  return next();
});

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars")

app.use("/", viewsRouter)
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", usersRouter)

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
        //carga de productos en tiempo real
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
        //buscardor en tiempo real
        socket.on("text", async data => {
          const searchItem = data.trim(); 
          if (searchItem === "") {
            io.emit("search", []); 
          } else {
            const regex = new RegExp(`^${searchItem}`, "i");
          
            try {
              const searchProduct = await productsModel.find({ title: regex }).lean().exec();
              console.log(searchProduct);
              io.emit("search", searchProduct);
            } catch (error) {
              console.error("Error al buscar productos:", error);
            }
          }
        });
        
      })
    });
  })
  .catch (e => {
    console.log("can´t connect to DB");
  })

