let CLASES_ARTICULO = {}
let USUARIO = {"Nombre": ""}
const ITEMS = document.getElementById("table-Articulos-body");
const selectedFiltro = document.getElementById('filterSelect');

function Alertas(Salida){
    if (Salida==0)
        alert("Transacción exitosa");
    if (Salida==5010)
        alert("Error, nombre se encuentra duplicado");
    if (Salida==5011)
        alert("Error, codigo se encuentra duplicado");
    if (Salida==5020)
        alert("Error, articulo no existe");
};

document.getElementById("filtrar").addEventListener('click', async function(event) {
    const selectedOption = selectedFiltro.value;
    switch(selectedOption){
        case "Nombre":
            const combinacion = document.getElementById("nombreFiltroInput").value;
            await filtrar(combinacion, USUARIO.name, '/ArticulosFiltradoNombre')
            break;
        case "Clase":
            const selectedClase = getClassId(document.getElementById("claseFiltroSelect").value);
            filtrar(selectedClase, USUARIO.name, '/ArticulosFiltradoClase')
            break;
        case "Cantidad":
            const cantidad = document.getElementById("cantidadFiltroInput").value;
            filtrar(cantidad, USUARIO.name, '/ArticulosFiltradoCantidad')
            break;
    }
});

async function filtrar(dato, usuario, endPoint){
    if(dato.length === 0){
        let response = await fetch("/Articulos");//Se sacan los datos del  archivo articulo 
        let data = await response.json();
        while (ITEMS.firstChild) {
            ITEMS.removeChild(ITEMS.firstChild);
        }
        fetchItems(data);
        return;
    }
    data = {dato, usuario};
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
        while (ITEMS.firstChild) {
            ITEMS.removeChild(ITEMS.firstChild);
        }
        fetchItems(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });   
}


document.getElementById('iniciarSesion').addEventListener('click', async function(event) {
    await showInterfazUsuario();
});

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
                USUARIO.name = name;
                // Limpiar elementos anteriores y cargar nuevos elementos
                while (ITEMS.firstChild) {
                    ITEMS.removeChild(ITEMS.firstChild);
                }
                document.getElementById("iniciarSesionDiv").style.display = "none";
                document.getElementById("interfazUsuario").style.display = "flex";
                let response = await fetch("/ClasesArticulos")
                let data = await response.json()
                await fetchClaseArticulos(data)
                response = await fetch("/Articulos");//Se sacan los datos del  archivo articulo 
                data = await response.json();
                fetchItems(data); // Cargar nuevos elementos
            } else {
                console.log(response)
                alert('Usuario no existe'); // Mostrar mensaje de error
            }
        } catch (error) {
            alert('Error submitting data.'); // Mostrar mensaje de error en caso de problemas
        }
    }  
}

let codigoViejo
//Funcion que saca los datos de los articulos en el servidor y los pone en una tabla de html
async function fetchItems(data) {
    try {
        data.forEach(item => {
            const tr = document.createElement('tr');//Se crea una fila
            const td_nombre = document.createElement('td');// Se crea un espacio para almacenar datos
            const td_precio = document.createElement('td');// Se crea un espacio para almacenar datos
            const td_clase = document.createElement('td');// Se crea un espacio para almacenar datos
            const td_codigo = document.createElement('td');// Se crea un espacio para almacenar datos en la tabla
            td_clase.textContent = CLASES_ARTICULO[item.IdClaseArticulo];//Se almacena el id en el primer espacio de datos 
            td_nombre.textContent = item.Nombre;//Se almacena el id en el segundo espacio de datos 
            td_precio.textContent = item.Precio;//Se almacena el id en el tercer espacio de datos 
            td_codigo.textContent = item.Codigo
            //Se agregan los espacios a la fila 
            tr.appendChild(td_codigo);
            tr.appendChild(td_nombre);
            tr.appendChild(td_clase);
            tr.appendChild(td_precio);
            //Se agrega la linea a la tabla
            ITEMS.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}

function actualizarSelectsClases(){
    const selectsClases = document.getElementsByClassName("clases")
    for (let i = 0; i < selectsClases.length; i++) {
        for(let key in CLASES_ARTICULO){
            let clase = document.createElement("option")
            clase.value = CLASES_ARTICULO[key]
            clase.textContent = CLASES_ARTICULO[key]
            selectsClases[i].appendChild(clase)
        }
    }
}


async function GetArticuloxCodigo(codigo){
    const data = {codigo}
    response = await fetch('/Articulo', {
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
    .catch(error => {
        console.error('Fetch error:', error);
    });
    console.log(response[0])
    if(response.length === 0){//NO existe el articulo con tal codigo 
        return null
    }else{
        return response[0]
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


function getClassId(nombreClase){
    for(key in CLASES_ARTICULO){
        if(CLASES_ARTICULO[key] === nombreClase)
            return key;
    }
}

async function fetchClaseArticulos(data) {
    try {
        data.forEach(item => {
            CLASES_ARTICULO[item.id] = item.Nombre
        });
        actualizarSelectsClases()
    } catch (error) {
        console.error(error);
    }
}

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

document.getElementById("modificarArticulo").addEventListener('click', async function(event) {
    document.getElementById("overlayModificar").style.display = "flex";
});

document.getElementById("buscarBorrar").addEventListener('click', async function(event) {
    const codigo = document.getElementById("codigoBorrar").value;
    if(codigo.length === 0)
        return;
    let articulo = await GetArticuloxCodigo(codigo)
    if(articulo === null)
        return;
    else{
        console.log(articulo)
        document.getElementById("codigoBorrarEncontrado").textContent = articulo.Codigo
        document.getElementById("nombreBorrarEncontrado").textContent = articulo.Nombre
        document.getElementById("precioBorrarEncontrado").textContent = articulo.Precio
        document.getElementById("claseBorrarEncontrado").textContent = CLASES_ARTICULO[articulo.IdClaseArticulo]

        document.getElementById("overlayBorrarEncontrado").style.display = "flex";
        document.getElementById("overlayBorrar").style.display = "none";
    }
});

document.getElementById("buscarModificar").addEventListener('click', async function(event) {
    const codigo = document.getElementById("codigoModificar").value;
    if(codigo.length === 0)
        return;
    let articulo = await GetArticuloxCodigo(codigo)
    if(articulo === null)
        return;
    else{
        console.log(articulo)
        document.getElementById("codigoModificarEncontrado").value = articulo.Codigo
        document.getElementById("nombreModificarEncontrado").value = articulo.Nombre
        document.getElementById("precioModificarEncontrado").value = articulo.Precio
        document.getElementById("claseModificarEncontrado").value = CLASES_ARTICULO[articulo.IdClaseArticulo]
        codigoViejo= document.getElementById("codigoModificarEncontrado").value
    }
    //only if el articulo se en encontro
    document.getElementById("overlayModificarEncontrado").style.display = "flex";
    document.getElementById("overlayModificar").style.display = "none";
});

document.getElementById("salir").addEventListener('click', async function(event) {
    document.getElementById("interfazUsuario").style.display = "none";
    document.getElementById("iniciarSesionDiv").style.display = "flex";
});

document.getElementById("insertarArticulo").addEventListener('click', async function(event) {
    document.getElementById("overlayInsertar").style.display = "flex";
});

document.getElementById("borrarArticulo").addEventListener('click', async function(event) {
    document.getElementById("overlayBorrar").style.display = "flex";
});

document.getElementById('borrar').addEventListener('click', async function(event) {
    const codigo = document.getElementById('codigoBorrarEncontrado').textContent;
    const inConfirmacion = 1;
    const nombreUsuario = USUARIO.name
    const data = {codigo, inConfirmacion, nombreUsuario}
    response = await fetch('/Delete', {
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
        Alertas(data[0][""])
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
    response = await fetch("/Articulos");//Se sacan los datos del  archivo articulo 
    const articulos = await response.json();
    fetchItems(articulos);
    document.getElementById("overlayBorrarEncontrado").style.display = "none";
});

document.getElementById('botonBorrarCancelar').addEventListener('click', async function(event) {
    const codigo = document.getElementById('codigoBorrarEncontrado').textContent;
    const inConfirmacion = 0;
    const nombreUsuario = USUARIO.name
    const data = {codigo, inConfirmacion, nombreUsuario}
    response = await fetch('/Delete', {
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
    .catch(error => {
        console.error('Fetch error:', error);
    });
    document.getElementById("overlayBorrarEncontrado").style.display = "none";
});

document.getElementById('insertar').addEventListener('click', async function(event) {
    const codigo = document.getElementById('codigoInsertar').value;
    const selectedClase = getClassId(document.getElementById("claseFiltroInsertar").value);
    const nombre = document.getElementById('nombreInsertar').value;
    const precio= document.getElementById('precioInsertar').value;
    const nombreUsuario = USUARIO.name
    const data = {codigo, selectedClase, nombre, precio, nombreUsuario}
    response = await fetch('/Insertar', {
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
        Alertas(data[0][""])
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
    response = await fetch("/Articulos");//Se sacan los datos del  archivo articulo 
    const articulos = await response.json();
    fetchItems(articulos);
    document.getElementById("overlayInsertar").style.display = "none";
});


document.getElementById('modificar').addEventListener('click', async function(event) {
    const codigoNuevo = document.getElementById('codigoModificarEncontrado').value;
    const inConfirmacion = 1;
    const selectedClase = getClassId(document.getElementById("claseModificarEncontrado").value);
    const nombre = document.getElementById('nombreModificarEncontrado').value;
    const precio= document.getElementById('precioModificarEncontrado').value;
    const nombreUsuario = USUARIO.name
    const data = {codigoViejo, codigoNuevo, inConfirmacion, selectedClase, nombre, precio, nombreUsuario}
    response = await fetch('/Modificar', {
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
        Alertas(data[0][""])
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
    response = await fetch("/Articulos");//Se sacan los datos del  archivo articulo 
    const articulos = await response.json();
    fetchItems(articulos);
    document.getElementById("overlayModificarEncontrado").style.display = "none";
});

document.getElementById('modificarCancelar').addEventListener('click', async function(event) {
    const codigoNuevo = document.getElementById('codigoModificarEncontrado').value;
    const inConfirmacion = 0;
    const selectedClase = getClassId(document.getElementById("claseModificarEncontrado").value);
    const nombre = document.getElementById('nombreModificarEncontrado').value;
    const precio= document.getElementById('precioModificarEncontrado').value;
    const nombreUsuario = USUARIO.name
    const data = {codigoViejo, codigoNuevo, inConfirmacion, selectedClase, nombre, precio, nombreUsuario}
    response = await fetch('/Modificar', {
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
    .catch(error => {
        console.error('Fetch error:', error);
    });
    document.getElementById("overlayModificarEncontrado").style.display = "none";
});