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
    thumbnail = [],
    code = undefined,
    stock = undefined,
    status = true,
    category = undefined
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
  
      const actualprods = await this.getProducts();
  
      // Buscar el primer ID que no existe
      let newId = 1;
      while (actualprods.find((prod) => prod.id === newId)) {
        newId++;
      }
      product.id = newId;
  
      // Verificar si ya existe un producto con el mismo código
      const existingProduct = actualprods.find((prod) => prod.code === code);
  
      if (existingProduct) {
        console.log('Ya existe un producto con el código:', code);
        return;
      }
  
      actualprods.push(product);
      await fs.promises.writeFile(this.#path, JSON.stringify(actualprods));
      console.log("se creo el producto: ", product);
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
        return null;
      } else {
        const filtro = actualprods.find((prod) => prod.id === id);
  
        if (filtro) {
          console.log('Resultado de GetProductsBy ID: Producto filtrado por id:', id);
          return filtro;
        } else {
          console.log('Resultado de GetProductsBy ID: No existe ningún producto con este ID');
          return null;
        }
      }
    } catch (error) {
      console.log('Algo falló:', error);
      return null;
    }
  }  

  async updateProduct(id, updateFields) {
    try {
      const actualprods = await this.getProducts();
    
      if (actualprods.length === 0) {
        console.log('No se a podido actualizar, el archivo aún está vacío');
        return false;
      }
    
      const productIndex = actualprods.findIndex((prod) => prod.id === id);
    
      if (productIndex === -1) {
        console.log("No se encontró producto con el ID:", id);
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
      const filteredProducts = actualprods.filter((prod) => prod.id === id);
  
      if (filteredProducts.length === 0) {
        throw new Error(`El producto con ID ${id} no existe en la lista. No se puede eliminar.`);
      }
  
      const updatedProducts = actualprods.filter((prod) => prod.id !== id);
      await fs.promises.writeFile('./products.json', JSON.stringify(updatedProducts));
      console.log(`Producto con ID ${id} eliminado correctamente.`);
    } catch (error) {
      console.log(error);
      throw new Error("Ha ocurrido un error al intentar eliminar el producto.");
    }
  }
  

}
