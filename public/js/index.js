const socket = io();

 document.getElementById("form").onsubmit = e => {
     e.preventDefault()

     const title = document.querySelector("input[name=title]").value;
     const price = parseInt(document.querySelector("input[name=price]").value);
     const description = document.querySelector("input[name=description]").value;
     const thumbnail = document.querySelector("input[name=thumbnail]").value;
     const code = parseInt(document.querySelector("input[name=code]").value);
     const stock = parseInt(document.querySelector("input[name=stock]").value);
     const category = document.querySelector("input[name=category]").value;

     if(title == "" || price == "" || description == "" || code == "" || stock == "" || category == ""){
         console.log("campos obligatorios se encuentran vacios");
     }else{
         const product = {title, description, price, thumbnail, code, stock, true:true, category}
         console.log(product);

         socket.emit("new-product", product)
         setTimeout(() => {
             document.getElementById("form").reset();
         }, 500);
     }
 }

socket.on("product-added", products => {
    console.log(products);
    let salida = `<table>
    <thead>
      <tr>
        <th class="text-center">NOMBRE</th>
        <th class="text-center">PRICE</th>
        <th class="text-center">STOCK</th>
        <th class="text-center">CODE</th>
        <th class="text-center">ID</th>
      </tr>
    </thead>
    <tbody>`
    products.forEach(prod => {
        salida +=
            `<tr>
                <td>${prod.title}</td>
                <td>$ ${prod.price}</td>
                <td>${prod.stock}</td>
                <td>${prod.code}</td>
                <td>${prod._id}</td>
            </tr>
          </tr>
       `
    });
    salida += ` </tbody>
            </table>`
    
    document.getElementById("div").innerHTML = salida;
});

