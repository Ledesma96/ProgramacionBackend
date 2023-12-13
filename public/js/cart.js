const addCart = async (cid, pid) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: 1 }),
    };
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, requestOptions)

    if (response.status === 201) {
      console.log("Producto agregado al carrito");
    } else {
      console.error("Error al agregar al carrito. Código de estado:", response.status);
    }
  } catch (error) {
    console.error("Error al agregar al carrito, error:", error);
  }
};


//eliminar productos del carrito
const deleteProduct = (cart, id) => {
  const pid = id;
  const cid = cart;
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`/api/carts/${cid}/products/${pid}`, requestOptions)
  .then((response) => {
    if (response.status === 204) {
      console.log("Producto eliminado exitosamente");
      window.location.href= `/carts/${cart}`
    } else {
      console.error("Error al eliminar el producto. Código de estado:", response.status);
    }
  }).catch((error) => {
      console.error("Error al eliminar el producto:", error);
  });
}

//vaciar carrito
const clearCart = async () => {
  const id = cart
  const response = await fetch(`/api/carts/${id}`,{
    method:"PUT",
    headers:{"Content-Type": "application.json"}
  }); 
  try {
    if(response.ok){
      window.location.href= `/carts/${cart}`
    } else {
      console.log("Error al eliminar los productos");
    }
  } catch (error) {
    console.log("Algo ha salido mal")
  }
}

const purchase = async (cid, purchaser) => {
  try {
    const response = await fetch(`/api/carts/${cid}/purchase?purchaser=${purchaser}`,{
      method:"POST",
      headers:{"Content-Type": "application.json"},
      body: JSON.stringify({
        purchaser: purchaser
      })
    })
    if(response.ok){
      window.location.href= `/carts/${cid}`
    } else {
      console.log("Error al realizar la compra");
    }
  } catch (error){
    console.log("Ah ocurrido un error inesperado");
  }
};

const payment = async (cart) => {
  try {
    const response = await fetch(`http://localhost:8080/api/payments-stripe/payment`, { 
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ cart: cart }),
    });
    const data = await response.json();
    console.log(data);
    window.location.href = data.url
   
  } catch (error) {
    console.error(error.message);
  }
};

