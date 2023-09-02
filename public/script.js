//Se consigue la tabla de articulos de la interfaz
const items = document.getElementById("table-Articulos-body");
//Se consigue el boton que para insertar un articulo en la base de datos
const form = document.getElementById('submitButton');

//Action listener del boton de insertar articulos 
form.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevenir recarga de la página al hacer clic
    // Obtener valores de los campos nombre y precio de entrada
    const name = document.getElementById("name").value;
    const precio = document.getElementById("precio").value;
    // Crear un objeto con los valores obtenidos
    const data = { name, precio };
    // Verificar que los campos no estén vacíos
    if (!(name === "" || precio === "")) {
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
                fetchItems(); // Cargar nuevos elementos
                alert('Se inserto el articulo con exito'); // Mostrar mensaje de éxito
            } else {
                alert('Articulo repetido no se inserto'); // Mostrar mensaje de error
            }
        } catch (error) {
            alert('Error submitting data.'); // Mostrar mensaje de error en caso de problemas
        }
    }
});


//Funcion que saca los datos de los articulos en el servidor y los pone en una tabla de html
async function fetchItems() {
    try {
        const response = await fetch('/Articulo');//Se sacan los datos del  archivo articulo
        const data = await response.json();//Se convierte los datos para que sean leidos en formato de un archivo .json 
        data.forEach(item => {
            const tr = document.createElement('tr');//Se crea una fila
            const td_id = document.createElement('td');// Se crea un espacio para almacenar datos en la tabla
            const td_nombre = document.createElement('td');// Se crea un espacio para almacenar datos
            const td_precio = document.createElement('td');// Se crea un espacio para almacenar datos
            td_id.textContent = item.Id;//Se almacena el id en el primer espacio de datos 
            td_nombre.textContent = item.Nombre;//Se almacena el id en el segundo espacio de datos 
            td_precio.textContent = item.Precio;//Se almacena el id en el tercer espacio de datos 
            //Se agregan los espacios a la fila 
            tr.appendChild(td_id);
            tr.appendChild(td_nombre);
            tr.appendChild(td_precio);
            //Se agrega la linea a la tabla
            items.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}

/*
El codigo de abajo es para mostrar en la interfaz las entradas
Para que el ususario digite el nombre y el precio del item que desea insertar
*/
const showButton = document.getElementById('showInsertOptions');
const overlayDiv = document.getElementById('overlayDiv');
const closeButton = document.getElementById('closeButton');

//Action listener que muestra la pantalla para insertar articulos
showButton.addEventListener('click', function() {
  overlayDiv.style.display = 'flex'; // 
  document.getElementById("name").value = "";
  document.getElementById("precio").value = "";
});
//Action listener que esconde la pantalla para insertar articulos
closeButton.addEventListener('click', function() {
  overlayDiv.style.display = 'none'; // 
});


fetchItems();