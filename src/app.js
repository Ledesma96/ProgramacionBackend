import express from "express";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"
import ticketsRouter from "./routes/tickets.router.js"
import usersRouter from "./routes/users.router.js"
import handlebars  from "express-handlebars";
import __dirname from "./uitils.js";
import { Server, Socket } from "socket.io"
import productsModel from "./Dao/mongo/models/products.model.js";
import messagesModel from "./Dao/mongo/models/messages.model.js";
import session from "express-session";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import handleError from "./middlewere/error.js"
import 'dotenv/config.js';
import { addLoger } from "./config/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación de un e-commerce',
      description: 'Este es un e-commerce de venta de bebidas',
      version: '1.0.0'
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
};


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
app.use(cookieParser("secret"))
app.use(addLoger)

app.use(session({
  secret: "secret",
  resave:false,
  saveUninitialized:false
}))
//passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())




//middlewere de usuario
app.use((req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    const authenticatedUser = user ? req.user.user : null;
    res.locals.user = authenticatedUser;
    next(); // Continuar independientemente de si se encontró un usuario o no
  })(req, res, next);
});



app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars")

const DOCS = swaggerJSDoc(swaggerOptions)
console.log(DOCS);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(DOCS))

app.use("/", viewsRouter)
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", usersRouter)
app.use("/api/tickets", ticketsRouter);
app.use(handleError)

const port = process.env.PORT || 8081;
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
          io.emit("search", searchProduct);
        } catch (error) {
          console.error("Error al buscar productos:", error);
        }
      }
    });
    
  })
});

