const filter = () =>{
    const selectElement = document.getElementById("category").value;
    const orden = document.getElementById("ordenar").value
    
    window.location.href = `/?category=${selectElement}&sort=${orden}`
}