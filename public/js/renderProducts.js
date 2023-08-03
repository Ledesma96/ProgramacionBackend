const filter = () =>{
    const selectElement = document.getElementById("category").value;
    
    window.location.href = `/?category=${selectElement}`
}