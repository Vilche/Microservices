const express = require("express"); // Importamos el framework Express para crear nuestra aplicación
const premios = require("../routes/premios"); // Importamos el módulo de rutas para autores desde la carpeta de rutas

const app = express(); // Creamos una instancia de la aplicación Express

app.use("/api/v1/premios", premios);

module.exports = app; // Exportamos la aplicación para poder ser utilizada desde otros módulos
