require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

//CORS
app.use(cors());

//Lectura yparseo del Body
app.use(express.json());

//Base de Datos
dbConnection();

//direcotrio Publico

app.use(express.static('public'));

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
	console.log('Servidor corriendo en puerto ' + process.env.PORT);
});
