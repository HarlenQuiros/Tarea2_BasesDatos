document.getElementById('iniciarSesion').addEventListener('click', async function(event) {
    await showInterfazUsuario();
});

document.getElementById("insertarArticulo").addEventListener('click', async function(event) {
    document.getElementById("overlayInsertar").style.display = "flex";
});

let clasesArticulo = {}

const selectedFiltro = document.getElementById('filterSelect');

const items = document.getElementById("table-Articulos-body");

document.getElementById("borrarArticulo").addEventListener('click', async function(event) {
    document.getElementById("overlayBorrar").style.display = "flex";
});

async function filtrar(dato,endPoint){
    data = {dato};
    response = await fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        while (items.firstChild) {
            items.removeChild(items.firstChild);
        }
        fetchItems(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
    
}


document.getElementById("filtrar").addEventListener('click', async function(event) {
    const selectedOption = selectedFiltro.value;
    let data;
    let response;
    switch(selectedOption){
        case "Nombre":
            const combinacion = document.getElementById("nombreFiltroInput").value;
            await filtrar(combinacion,'/ArticulosFiltradoNombre')
            break;
        case "Clase":
            document.getElementById('claseFiltro').style.display = "flex";
            const selectedClase = clasesArticulo[document.getElementById("claseFiltroSelect").value];
            filtrar(selectedClase,'/ArticulosFiltradoClase')
            break;
        case "Cantidad":
            document.getElementById('cantidadFiltro').style.display = "flex";
            break;
    }
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
        hideClass("overlay");
    });
}

function hideClass(className){
    const classObjects = document.getElementsByClassName(className);
    for (let i = 0; i < classObjects.length; i++) 
        classObjects[i].style.display = "none";
    
}

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
                let response = await fetch("/Articulos");//Se sacan los datos del  archivo articulo 
                let data = await response.json();
                fetchItems(data); // Cargar nuevos elementos
                response = await fetch("/ClasesArticulos")
                data = await response.json()
                fetchClaseArticulos(data)
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
async function fetchItems(data) {
    try {
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

function actualizarSelectsClases(){
    const selectsClases = document.getElementsByClassName("clases")
    for (let i = 0; i < selectsClases.length; i++) {
        for(let key in clasesArticulo){
            let clase = document.createElement("option")
            clase.textContent = key
            selectsClases[i].appendChild(clase)
        }
    }
}

async function fetchClaseArticulos(data) {
    try {
        data.forEach(item => {
            clasesArticulo[item.Nombre] = item.id
        });
        actualizarSelectsClases()
    } catch (error) {
        console.error(error);
    }
}


selectedFiltro.addEventListener('change', function() {
    const selectedOption = selectedFiltro.value;
    console.log(selectedOption)
    hideClass("filtro");
    switch(selectedOption){
        case "Nombre":
            document.getElementById('nombreFiltro').style.display = "flex";
            break;
        case "Clase":
            document.getElementById('claseFiltro').style.display = "flex";
            break;
        case "Cantidad":
            document.getElementById('cantidadFiltro').style.display = "flex";
            break;
    }
});