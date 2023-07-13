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
        console.log("campor obligatorios se encuentran vacios");
    }else{
        const product = {title, description, price, thumbnail, code, stock, true:true, category}

        socket.emit("new-product", product)
        setTimeout(() => {
            document.getElementById("form").reset();
        }, 1000);
    }
}

socket.on("product-added", products => {
    let salida = `<table>
    <thead>
      <tr>
        <th>NOMBRE</th>
        <th>PRICE</th>
        <th>STOCK</th>
        <th>CODE</th>
        <th>ID</th>
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
            <td>${prod.id}</td>
          </tr>
          </tr>
       `
    });
    salida += ` </tbody>
            </table>`
    document.getElementById("div").innerHTML = salida
});

