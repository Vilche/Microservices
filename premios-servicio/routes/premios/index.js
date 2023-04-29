const express = require("express");
const sqlite3 = require('sqlite3').verbose();
// Creamos un objeto Router
const router = express.Router();


async function conexionDB() {
const db = new sqlite3.Database('data/premios.db', (err) => { // inicio de la conecion
    if (err) {
      console.error(err.message);
    }
    console.log("Conectado a la base de datos");
  }); // fin de la coneccion a db 
  const info = [];

  db.all("SELECT * FROM campeonatos", (err, rows) => { // ejecucion del query
    if (err) {
      console.error(err.message);
    }
    rows.forEach((row) => {
      info.push(row);
    });
  }); // fin del query
 //Creamos el router para obtener todos los datos de la query
 router.get("/", (req, res) => {
    const response = {
      // crea una respuesta con información sobre los libros
      service: "premios",
      architecture: "microservices",
      length: info.length,
      data: info,
    };
    
    return res.json(response); // devuelve la respuesta al cliente
  });

  router.get('/:id', (req, res) =>{
    const {id} = req.params;
    const result = info.filter(premio => premio.id_campeon == id)
    
    if (result) {
      const response = {
        servicio: "razas",
        total: result.length,
        data: result
      }
      res.send(response);
    } else {
      res.status(404).send('Este perro no contiene premios');
    }

  });
}
conexionDB();
module.exports = router; 