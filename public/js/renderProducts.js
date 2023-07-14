const socket = io();

socket.on("product-added", products => {
    let salida = ""
    products.forEach(prod => {
        salida+=`<div class="card" style="width: 18rem;">
                    <img src="${prod.thumbnail}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${prod.title}</h5>
                        <p class="card-text">${prod.description}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>`
    });

    document.getElementById("card").innerHTML = salida;
})