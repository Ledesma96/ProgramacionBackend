import { Router } from "express";
// import ProductManager from "../Dao/ProductManager.js";
import productsModel from "../Dao/models/products.models.js";
import messageModel from "../Dao/models/messages.models.js"
import cartModel from "../Dao/models/cart.model.js";

// const pd = new ProductManager();

const router = Router();


//vistas de session
function auth(req, res, next) {
  if(req.session?.user) return res.redirect("/")

  return next()
  
}
function profile(req, res, next) {
  if(req.session?.user) return next()
  
  return res.redirect("/login")
}
  //inicio de sesion
router.get("/login", auth, (req,res) => {
  res.render("login", {})
})

  //resgitro

router.get("/registre", auth, (req,res) => {
  res.render("registre")
})

  //profile

router.get("/profile", profile, (req, res) => {
  const user = req.session.user

  res.render("profile", user)
})



//vista home

router.get("/", async (req, res) => {
  const limit = parseInt(req.query?.limit || 5);
  const page = parseInt(req.query?.page || 1);
  const category = req.query?.category || null;

  const filterCategory = category ? {category} : {};

    const products = await productsModel.paginate(filterCategory, {
      page,
      limit,
      lean: true,
    })
    products.nextLink = products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}` : "";
    products.prevLink = products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}` : "";
    products.nextPagee = products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}` : "";
    products.prevPagee = products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}` : "";
    res.render("home", products)
})

function accesAdmin(req, res, next) {
  const user = req.session.user;
  if(user.rol == "admin") return next()

  return res.send("no tienes acceso a esta direccion")
}

router.get("/products",accesAdmin, async (req,res) => {
    const products = await productsModel.find().lean().exec()

    res.render("realTimeProducts", products)
})
//vista detail products


router.get("/detail/:_id", async (req, res) => {
  const id = req.params._id;

  const product = await productsModel.findById(id).lean().exec();
  console.log(product);

  try {
    res.render("detail", product)
  } catch (error) {
    console.log("error al obtener el producto", error);   
  }
})


//cista chat
router.get("/chat", async (req, res) => {
  const messages = await messageModel.find().lean().exec()

  res.render("chat", {messages})
})

//vista de carts
router.get("/carts/:cid", async(req, res) => {
  const id = req.params.cid;

  try {
    const cart = await cartModel.findOne({ _id: id }).populate("products.pid").lean().exec();
    console.log(JSON.stringify(cart.products, null, "\t"));
    if(!cart){
      res.send("el carrito no existe")
    } else {
      res.render("cart", {cart})
    }
    
  } catch (error) {
    console.log("error al obtener el carrito", error);
  }
})


//agregar un producto meidante un form
router.post("/products", async (req,res) => {
    // const title = req.body.title;
    // const description = req.body.description;
    // const price = parseInt(req.body.price);
    // const thumbnail = req.body.thumbnail;
    // const code = parseInt(req.body.code);
    // const stock = parseInt(req.body.stock);
    // const category = req.body.category;
    // const result = await pd.addProduct(title, description, price, thumbnail, code, stock,true, category)

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


router.get("/cart/count", async (req, res) => {
  try {
    const cartCount = await cartModel.findById("64c2f98bc34641fcca5a229b");
    res.json({ count: cartCount.products.length });
  } catch (error) {
    console.error("Error al obtener el número de productos en el carrito:", error);
    res.status(500).json({ error: "Error al obtener el número de productos en el carrito" });
  }
});

export default router