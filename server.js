const express = require('express');
const app = express();
const sql = require('mssql');

const config = {
    server: 'mssql-138899-0.cloudclusters.net',
    database: 'base_db',
    user: 'admin',
    password: '@CAqg2000.',
    port: 17962,
    options: {
        encrypt: true, // For secure connection
        trustServerCertificate: true 
    },
};

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/Articulo', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('EXEC GetArticulos');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    } finally {
        sql.close();
    }
});




app.post('/submit', async (req, res) => {//req = request, res = response
    try {
        const { name, precio } = req.body;        
        if(!(name === "" | precio === "")){
            await sql.connect(config);
            const request = new sql.Request();
            request.input('InNombre', sql.VarChar(128),name);
            request.input('InPrecio', sql.Money, precio);
            const result = await request.execute('InsertarArticulo');
            if(result.returnValue === 0)
                res.status(200).send('Se inserto el articulo con exito');
            else
                res.status(500).send('Articulo repetido no se inserto');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error inserting data.');
    } finally {
        sql.close();
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
