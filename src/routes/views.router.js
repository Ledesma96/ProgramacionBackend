import { Router } from "express";
import { authorization, passportCall, passportCall1 } from "../uitils.js";
import productsModel from "../Dao/mongo/models/products.model.js";
import messageModel from "../Dao/mongo/models/messages.model.js"
import cartModel from "../Dao/mongo/models/cart.model.js";
import { getProductsViews, renderDetailProduct, renderLogin, renderProfile, renderRegister, getProductsAll, mokingProducts, getUsers } from "../controllers/views.controller.js";
import CustomError from "../services/error/custom_error.js";
import EErrors from "../services/error/enums.js";
import compression from "express-compression";
import jwt from "jsonwebtoken";
import 'dotenv/config.js';

const router = Router();

//vistas de session
function auth(req, res, next) {
  if(req.user) return res.redirect("/")
  return next()
}

// perfil de usuario
function profile(req, res, next) {
  if(req.user) return next()
  return res.redirect("/login")
}


  //inicio de sesion
router.get("/login", auth, renderLogin)

//resgitro
router.get("/registre", auth, renderRegister)

//profile
router.get("/profile", profile, renderProfile)

//users list
router.get('/users-list',authorization('admin'), getUsers)
//change role
router.get("/change-role", (req, res) => {
  const id = req.user._id
  console.log(id);
  res.render('changeRole', {id} )
})

//vista home
router.get("/",  passportCall1("jwt",{ session:false}), getProductsViews)

router.get('/reset-password', (req, res) => {
  const token = req.query.token;

  if(!token) return res.redirect('http://127.0.0.1:8080/login')

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY)
    res.render('resetPassword', {email: decoded.email})
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.redirect('http://127.0.0.1:8080/login');
    } else {
      return res.send({ success: false, message: error.message });
    }
  }
})

//moking products
router.get("/mokingproducts", 
compression({
  brotli:{
    enabled: true,
    zlib:{}
  }}), mokingProducts)


//real time prodcuts
function accesAdmin(req, res, next) {
  const user = req.user;

  if(user.rol == "admin" || user.rol == "premium") return next()

  return res.send("no tienes acceso a esta direccion")
}
router.get("/products",accesAdmin, getProductsAll)



//vista detail products
router.get("/detail/:_id", renderDetailProduct)


function accesAUser(req, res, next) {
const user = req.user;
  if(user.rol == "usuario") return next()

  return res.send("no tienes acceso a esta direccion")
}
//cista chat
router.get("/chat",accesAUser, async (req, res) => {
  const messages = await messageModel.find().lean().exec()
  const user = req.user;
  if(user.rol != "usuario"){
    return CustomError.createError({
      name: "Restriccion de admin",
      cause,
      message:"Permitido para usuarios",
      code: EErrors.NOT_AUTHORIZED_ERROR
    })
  }
  res.render("chat", {messages})
})

//vista de carts
router.get("/carts/:cid",passportCall("jwt",{ session:false}), async(req, res) => {
  const id = req.params.cid;
  const user = req.user.user
  try {
    const cart = await cartModel.findOne({ _id: id }).populate("products.pid").lean().exec();
    if(!cart){
      res.send("el carrito no existe")
    } else {
      res.render("cart", {
        cart: cart,
        user: user
      })
    }
    
  } catch (error) {
    console.log("error al obtener el carrito", error);
  }
})


//agregar un producto meidante un form
router.post("/products", async (req,res) => {
    const productNew = req.body;
    try {
        const productCreated = new productsModel(productNew);
        await productCreated.save();
        res.redirect('/');
      } catch (error) {
        console.error(error);
        res.redirect('/error');
      }
})

router.get("/current", (req, res) => {
  res.render("current", {})
})

export default router