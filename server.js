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
        const result = await sql.query("EXEC GetArticulos @outResultCode = 0");
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
            const result = await request.execute('ConfirmarUsuario');
            console.log()
            if(result.output.outResultCode === 1)
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
