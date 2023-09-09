document.getElementById('iniciarSesion').addEventListener('click', async function(event) {
    await showInterfazUsuario();
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
const items = document.getElementById("table-Articulos-body");



async function showInterfazUsuario(){
    // Obtener valores de los campos nombre y precio de entrada
    const name = document.getElementById("usuario").value;
    const password = document.getElementById("contraseña").value;
    // Crear un objeto con los valores obtenidos
    const data = { name, password };
    
    if (!(name === "" || password === "")) {
        try {
            // Realizar una solicitud POST al servidor
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            // Si la solicitud es exitosa
            if (response.ok) {
                // Limpiar elementos anteriores y cargar nuevos elementos
                while (items.firstChild) {
                    items.removeChild(items.firstChild);
                }
                document.getElementById("iniciarSesionDiv").style.display = "none";
                document.getElementById("interfazUsuario").style.display = "flex";
                fetchItems(); // Cargar nuevos elementos
                alert('Se ha iniciado sesion'); // Mostrar mensaje de éxito
            } else {
                console.log(response)
                alert('Usuario no existe'); // Mostrar mensaje de error
            }
        } catch (error) {
            alert('Error submitting data.'); // Mostrar mensaje de error en caso de problemas
        }
    }  
}

//Funcion que saca los datos de los articulos en el servidor y los pone en una tabla de html
async function fetchItems() {
    try {
        const response = await fetch('/Articulo');//Se sacan los datos del  archivo articulo
        const data = await response.json();//Se convierte los datos para que sean leidos en formato de un archivo .json 
        data.forEach(item => {
            const tr = document.createElement('tr');//Se crea una fila
            const td_nombre = document.createElement('td');// Se crea un espacio para almacenar datos
            const td_precio = document.createElement('td');// Se crea un espacio para almacenar datos
            const td_clase = document.createElement('td');// Se crea un espacio para almacenar datos
            const td_codigo = document.createElement('td');// Se crea un espacio para almacenar datos en la tabla
            td_clase.textContent = item.IdClaseArticulo;//Se almacena el id en el primer espacio de datos 
            td_nombre.textContent = item.Nombre;//Se almacena el id en el segundo espacio de datos 
            td_precio.textContent = item.Precio;//Se almacena el id en el tercer espacio de datos 
            td_codigo.textContent = item.Codigo
            //Se agregan los espacios a la fila 
            tr.appendChild(td_codigo);
            tr.appendChild(td_nombre);
            tr.appendChild(td_clase);
            tr.appendChild(td_precio);
            //Se agrega la linea a la tabla
            items.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}
