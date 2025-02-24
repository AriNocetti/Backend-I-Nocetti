// Importa el módulo express
const express = require('express');

// Crea una aplicación Express
const app = express();

// Usamos express.json() para procesar cuerpos JSON
app.use(express.json());

// Define una ruta para la página principal
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

// Configura el puerto en el que la aplicación escuchará
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});