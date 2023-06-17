import fs from "fs"

export default class ProductManager {
  #id = 0;
  #path = undefined;

  constructor() {
    if (!fs.existsSync('./products.json')) {
      fs.writeFileSync('./products.json', JSON.stringify([]));
    }
    this.#path = './products.json';
  }

  #getID() {
    this.#id++;
    return this.#id;
  }

  async addProduct(
    title = undefined,
    description = undefined,
    price = undefined,
    thumbnail = undefined,
    code = undefined,
    stock = undefined
  ) {
    try {
      const product = {
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
      };
      product.id = this.#getID();
      const actualprods = await this.getProducts();

      console.log(actualprods);

      const filtro = actualprods.filter((prod) => prod.id == product.id);

      if (filtro.length) {
        console.log('Este producto de ID:', product.id, 'ya existe');
        return;
      } else {
        actualprods.push(product);
        await fs.promises.writeFile(
          this.#path,
          JSON.stringify(actualprods)
        );
      }
    } catch (error) {
      console.log('No se cargó ningún producto, algo salió mal:', error);
    }
  }

  async getProducts() {
    try {
      const content = await fs.promises.readFile(this.#path, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.log('Hubo un error para obtener los productos:', error);
    }
  }

  async getProductById(id) {
    try {
      const actualprods = await this.getProducts();

      if (actualprods.length == 0) {
        console.log(
          'No se puede filtrar ningún producto por su ID, el archivo aún está vacío'
        );
        return;
      } else {
        const filtro = actualprods.filter((prod) => prod.id === id);

        if (filtro.length > 0) {
          console.log(
            'Resultado de GetProductsBy ID: Producto filtrado por id:',
            id,
            filtro
          );
        } else {
          console.log(
            'Resultado de GetProductsBy ID: No existe ningún producto con este ID'
          );
        }
      }
    } catch (error) {
      console.log('Algo falló:', error);
    }
  }

  async updateProduct(id, campo, newValue) {
    try {
      const actualprods = await this.getProducts();

      if (actualprods.length == 0) {
        console.log(
          'No se puede actualizar nada, el archivo aún está vacío'
        );
        return;
      }  else {
          console.log(
            'Usted desea actualizar producto de ID:',
            id,
            'campo:',
            campo
          );
          const newFilter = actualprods.filter((prod) => prod.id === id);

          if (newFilter.length == 0) {
            console.log("No existe en la lista un objeto con el ID: ", id," no se puede actualizar nada.");
            return
          } else{
           //Actualizo
            const listUpdated = await newFilter.find((prod)=>{
            prod[campo] = newValue;
            return prod;
            })
            //Filtro una nueva lista sin el objeto anterior
            const actualprodsupdated = await actualprods.filter(prod => prod.id !== id);
            await actualprodsupdated.push(listUpdated);
            await fs.promises.writeFile('./products.json', JSON.stringify(actualprods))
            console.log("Lista actualizada: ", listUpdated);
          }
        }
    } catch (error) {
        console.log(error);
      }
  }
      async deleteProduct(id){
        try {
          const actualprods = await this.getProducts();
          const testid = await actualprods.filter(prod => prod.id == id);
           if (testid == 0) {
              console.log("Este producto con el ID: ",id, "no existe en la lista. No se puede eliminar nada");
              return
            }else{
              const listUpdated = await actualprods.filter(prod => prod.id !== id);
              await fs.promises.writeFile('./products.json', JSON.stringify(listUpdated))
               console.log("Lista con elemento de ID: ",id," eliminado", listUpdated);
            }
        } catch (error) {
            console.log(error);
          }
  }

}

let pd = new ProductManager();
pd.addProduct("coca cola","sabor original", 600, "https://d1on8qs0xdu5jz.cloudfront.net/webapp/images/fotos/b/0000000000/2176_1.jpg", 11374, 10)
pd.addProduct("fanta","naranja", 700, "https://d1on8qs0xdu5jz.cloudfront.net/webapp/images/fotos/b/0000000000/2176_1.jpg", 11364, 10)
pd.addProduct("cunington","pomelo", 600, "https://d1on8qs0xdu5jz.cloudfront.net/webapp/images/fotos/b/0000000000/2176_1.jpg", 11320, 10)
pd.addProduct("baggio","multifruta", 800, "https://d1on8qs0xdu5jz.cloudfront.net/webapp/images/fotos/b/0000000000/2176_1.jpg", 11328, 10)
pd.addProduct("citric","naranja", 900, "https://d1on8qs0xdu5jz.cloudfront.net/webapp/images/fotos/b/0000000000/2176_1.jpg", 11325, 10)
pd.addProduct("fernet","branca", 1600, "https://d1on8qs0xdu5jz.cloudfront.net/webapp/images/fotos/b/0000000000/2176_1.jpg", 11326, 10)
pd.addProduct("heinkene","rubia", 900, "https://d1on8qs0xdu5jz.cloudfront.net/webapp/images/fotos/b/0000000000/2176_1.jpg", 11327, 10)


 