const express = require('express');
const app = express();
const sql = require('mssql');

const config = {
    server: 'mssql-138899-0.cloudclusters.net',
    database: 'base_db',
    user: 'admin',
    password: '@HDqg2000.',
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

app.get('/Articulos', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query("EXEC GetArticulos @outResultCode = 0");
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    } finally {
        sql.close();
    }
});

app.get('/ClasesArticulos', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query("EXEC GetClasesArticulos @outResultCode = 0");
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    } finally {
        sql.close();
    }
});

app.post('/Delete', async (req, res) => {
    try {
        await sql.connect(config);
        const {codigo, InConfirmacion, nombreUsuario}= req.body;
        const request = new sql.Request();
        request.input('InCodigoArticulo', sql.VarChar(100),codigo);
        request.input('inConfirmacion', sql.Int,InConfirmacion);
        request.input('inPostIP', sql.VarChar(20),req.connection.remoteAddress);
        request.output('outResultCode', sql.Int);
        request.input('inNombre',  sql.VarChar(16), nombreUsuario);
        const result = await request.execute("DeleteArticulo");
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    } finally {
        sql.close();
    }
});

app.post('/Articulo', async (req, res) => {
    try {
        await sql.connect(config);
        const {codigo}= req.body;
        const request = new sql.Request();
        request.input('InCodigo', sql.VarChar(100),codigo);
        request.output('outResultCode', sql.Int);
        const result = await request.execute("GetArticuloxClave");
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    } finally {
        sql.close();
    }
});

app.post('/ArticulosFiltradoNombre', async (req, res) => {
    try {
        await sql.connect(config);
        const {dato, usuario}= req.body;
        const request = new sql.Request();
        request.input('InNombre', sql.VarChar(100),usuario);
        request.input('InIp', sql.VarChar(20),req.connection.remoteAddress);
        request.output('outResultCode', sql.Int);
        request.input('InCombinacion',  sql.VarChar(100), dato);
        const result = await request.execute("GetArticulosFiltradosNombre");
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    } finally {
        sql.close();
    }
});

app.post('/ArticulosFiltradoCantidad', async (req, res) => {
    try {
        await sql.connect(config);
        const {dato,usuario}= req.body;
        const request = new sql.Request();
        request.input('InNombre', sql.VarChar(100),usuario);
        request.input('InIp', sql.VarChar(20),req.connection.remoteAddress);
        request.output('outResultCode', sql.Int);
        request.input('InCantidad',  sql.VarChar(100), dato);
        const result = await request.execute("GetArticulosFiltradosCantidad");
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    } finally {
        sql.close();
    }
});

app.post('/ArticulosFiltradoClase', async (req, res) => {
    try {
        await sql.connect(config);
        const {dato, usuario}= req.body;
        const request = new sql.Request();
        request.input('InNombre', sql.VarChar(100),usuario);
        request.input('InIp', sql.VarChar(20),req.connection.remoteAddress);
        request.output('outResultCode', sql.Int);
        request.input('InIdClase',  sql.Int, dato);
        const result = await request.execute("GetArticulosFiltradosClase");
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    } finally {
        sql.close();
    }
});

app.post('/submit', async (req, res) => {
    try {        
        await sql.connect(config);
        const { name, password } = req.body;
        if(!(name === "" | password === "")){
            await sql.connect(config);
            const request = new sql.Request();
            request.output('outResultCode', sql.Int);
            request.input('InNombre', sql.VarChar(100),name);
            request.input('InPassword', sql.VarChar(100), password);
            request.input('InIp', sql.VarChar(20),req.connection.remoteAddress);
            const result = await request.execute('ConfirmarUsuario');
            if(result.output.outResultCode !== null)
                res.status(200).send('User encontrao');
            else
                res.status(500).send('User no encontrao');
            res.json(result.recordset);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    } finally {
        sql.close();
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});