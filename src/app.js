import express from "express";
import ProductManager from "./ProductManager.js";

const pd = new ProductManager();

const app = express();

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await pd.getProducts();

    if (limit !== undefined) {
      const parsedLimit = parseInt(limit);
      if (!isNaN(parsedLimit)) {
        if(limit <= products.length){
            return res.send(products.slice(0, parsedLimit));
        } return res.send("la cantidad de productos es: " + products.length)
        
      }
    }

    return res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al obtener los productos");
  }
});


app.get("/products/:pid", async (req, res) => {
     const pid = parseInt(req.params.pid);
     try{
        const products = await pd.getProducts();
        const product = products.find(u => u.id === pid);
        if(!product) return res.send("el porducto de id " + pid + " no existe")
        return res.send(product)
     } catch (error){
        res.status(500).send("Error al obtener los productos");
     }
     
})

app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});
