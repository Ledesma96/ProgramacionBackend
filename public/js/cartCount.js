// obtengo el número de productos en el carrito
fetch("/cart/count")
  .then((response) => response.json())
  .then((data) => {
    console.log(document.getElementById("countCart").textContent = data.count);
  })
  .catch((error) => {
    console.error("Error al obtener el número de productos en el carrito:", error);
  });
