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
    stock = undefined,
    status = true,
    category= undefined
  ) {
    try {
      const product = {
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
        status: status,
        category: category
      };
      product.pid = this.#getID();
      const actualprods = await this.getProducts();

      const filtro = actualprods.filter((prod) => prod.pid == product.pid);

      if (filtro.length) {
        console.log('Este producto de ID:', product.pid, 'ya existe');
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
      console.log('Hubo un error al obtener los productos:', error);
      throw error; // Re-lanzar el error para manejarlo en un nivel superior si es necesario
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
        const filtro = actualprods.filter((prod) => prod.pid === id);

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

  async updateProduct(pid, updateFields) {
    try {
      const actualprods = await this.getProducts();
    
      if (actualprods.length === 0) {
        console.log('No se puede actualizar nada, el archivo aún está vacío');
        return false;
      }
    
      const productIndex = actualprods.findIndex((prod) => prod.pid === pid);
      console.log(productIndex);
    
      if (productIndex === -1) {
        console.log("No se encontró ningún producto con el ID:", pid);
        return false;
      }
    
      const updatedProduct = {
        ...actualprods[productIndex],
        ...updateFields
      };
    
      actualprods[productIndex] = updatedProduct;
    
      await fs.promises.writeFile('./products.json', JSON.stringify(actualprods));
      console.log("Producto actualizado correctamente.");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
  
  
  async deleteProduct(id) {
    try {
      const actualprods = await this.getProducts();
      const filteredProducts = actualprods.filter((prod) => prod.pid === id);
  
      if (filteredProducts.length === 0) {
        throw new Error(`El producto con ID ${id} no existe en la lista. No se puede eliminar.`);
      }
  
      const updatedProducts = actualprods.filter((prod) => prod.pid !== id);
      await fs.promises.writeFile('./products.json', JSON.stringify(updatedProducts));
      console.log(`Producto con ID ${id} eliminado correctamente.`);
    } catch (error) {
      console.log(error);
      throw new Error("Ha ocurrido un error al intentar eliminar el producto.");
    }
  }
  

}
