const express = require("express"); // Importamos el framework Express para crear nuestra aplicación
const perros = require("../routes/perros"); // Importamos el módulo de rutas para autores desde la carpeta de rutas

const app = express(); // Creamos una instancia de la aplicación Express

app.use("/api/v1/perros", perros);

module.exports = app; // Exportamos la aplicación para poder ser utilizada desde otros módulos
