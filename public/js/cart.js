// agregar productos al carrito
let cart = "";
 
const obtendUser = async () => {
 await fetch("http://127.0.0.1:8080/api/sessions/user")
 
  .then(response => response.json())
  .then(data => {
    if(data.user){
      cart = data.user.cartId
      console.log(cart);
    } else {
      console.log("Usuario no registrado")
    }
  })
}
obtendUser()


const addCart = (id) => {
  const cid = cart;
  const pid = id;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: 1 }),
  };

  fetch(`/api/carts/${cid}/product/${pid}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      
      console.error("Error al agregar el producto al carrito:", error);
    });
};


//eliminar productos del carrito
const deleteProduct = (id) => {
  const cid = cart;
  const pid = id;
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


  