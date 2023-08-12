import { Router } from "express";
import ProductManager from "../Dao/ProductManager.js";
import productsModel from "../Dao/models/products.models.js";

const pd = new ProductManager();

const router = Router()

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await pd.getProducts();

    if (limit !== undefined) {
      const parsedLimit = parseInt(limit);
      if (!isNaN(parsedLimit)) {
        if (parsedLimit <= products.length) {
          return res.status(200).send(products.slice(0, parsedLimit));
        }
        return res.send("La cantidad de productos es: " + products.length);
      }
    }

    return res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al obtener los productos");
  }
});

router.get("/probando", async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await productsModel.find();

    if (limit !== undefined) {
      const parsedLimit = parseInt(limit);
      if (!isNaN(parsedLimit)) {
        if (parsedLimit <= products.length) {
          return res.status(200).send(products.slice(0, parsedLimit));
        }
        return res.send("La cantidad de productos es: " + products.length);
      }
    }

    return res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al obtener los productos");
  }
});


router.get("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    if(pid > 0 ){
        try{
            const product = await pd.getProductById(pid)
            if(!product) return res.send("el porducto de id " + pid + " no existe")
            return res.send(product)
         } catch (error){
            res.status(500).send("Error al obtener los productos");
    }} else {
        res.send("el id del producto no puede ser menos que o igual que 0")
    }
    
})

router.post("/", async (req, res) => {
      const title = req.body.title;
      const description = req.body.description;
      const price = req.body.price;
      const thumbnail = req.body.thumbnail;
      const code = req.body.code;
      const stock = req.body.stock;
      const category = req.body.category
     
    try{
        if( title === undefined || description == undefined || price == undefined || code == undefined || stock == undefined || category == undefined){
          res.send("faltan campos obligatorios")
        } else {
          console.log(req.body.description);
          await pd.addProduct(title, description, price, thumbnail, code, stock, category)
          res.send("se agrego un producto exitosamente")
        }
    } catch {
        res.status(400).send("ocurrio un error")
    }
})

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const piid = parseInt(pid)
 
  const updateFile = req.body;

  try{
    if (Object.keys(updateFile).length === 0){
      return res.status(400).send("no se encontro dato a para actualizar")
    }
    const updateProduuct = await pd.updateProduct(piid, updateFile)

    if(updateProduuct){
      res.send("producto actualizaso exitosamente")
    } else{
      res.status(404).send("no se encontro ningun producto")
    }
  }catch (err) {
    res.status(500).send("Ha ocurrido un error al intentar actualizar el producto: " + err);
  }
})

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const piid = parseInt(pid);

  try {
    const actualProd = await pd.getProducts();

    const updatedProducts = actualProd.filter((prod) => prod.id !== piid);

    if (actualProd.length === updatedProducts.length + 1) {
      await pd.deleteProduct(piid);
      res.send("Producto eliminado correctamente.");
    } else {
      res.status(404).send("No se encontró ningún producto con el ID: " + pid);
    }
  } catch (err) {
    res.status(500).send("Error al intentar eliminar un producto: " + err);
  }
});


export default router