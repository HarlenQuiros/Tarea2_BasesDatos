document.getElementById('iniciarSesion').addEventListener('click', async function(event) {
    document.getElementById("iniciarSesionDiv").style.display = "none";
    showInterfazUsuario();
});

document.getElementById("insertarArticulo").addEventListener('click', async function(event) {
    document.getElementById("overlayInsertar").style.display = "flex";
});

document.getElementById("borrarArticulo").addEventListener('click', async function(event) {
    document.getElementById("overlayBorrar").style.display = "flex";
});

document.getElementById("modificarArticulo").addEventListener('click', async function(event) {
    document.getElementById("overlayModificar").style.display = "flex";
});

document.getElementById("buscarBorrar").addEventListener('click', async function(event) {
    //only if el articulo se en encontro
    document.getElementById("overlayBorrarEncontrado").style.display = "flex";
    document.getElementById("overlayBorrar").style.display = "none";
});

document.getElementById("buscarModificar").addEventListener('click', async function(event) {
    //only if el articulo se en encontro
    document.getElementById("overlayModificarEncontrado").style.display = "flex";
    document.getElementById("overlayModificar").style.display = "none";
});

document.getElementById("salir").addEventListener('click', async function(event) {
    document.getElementById("interfazUsuario").style.display = "none";
    document.getElementById("iniciarSesionDiv").style.display = "flex";
});


const botonesCancelar = document.getElementsByClassName("cancelar")
for (let i = 0; i < botonesCancelar.length; i++) {
    botonesCancelar[i].addEventListener('click', async function(event) {
        const overlays = document.getElementsByClassName("overlay");
        for (let i = 0; i < overlays.length; i++) {
            overlays[i].style.display = "none";
        }
    });
}


function showInterfazUsuario(){
    document.getElementById("interfazUsuario").style.display = "flex";
}