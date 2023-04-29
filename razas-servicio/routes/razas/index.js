const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');


const router = express.Router();

//const data = require('../../data/')

const logger = (message) => console.log(`Servicio razas : ${message}`);

function csvToJson(filePath, callback) {
  const RazaArray = []; // Crea un array vacío donde se guardará cada objeto convertido
  fs.createReadStream(filePath) // Crea un stream de lectura del archivo especificado
    .pipe(csv()) // Convierte el stream en un objeto CSV
    .on('data', (data) => { // Cuando se recibe un dato del stream
      Object.keys(data).forEach((key) => { // Itera sobre las claves del objeto
        const value = data[key];
        if (!isNaN(value) && value !== '') { // Comprueba si el valor es un número
          data[key] = +value; // Si es un número, conviértelo en número
        } else if (value === 'true' || value === 'false') { // Comprueba si el valor es "true" o "false"
          data[key] = (value === 'true'); // Si es "true", conviértelo a true. Si es "false", conviértelo a false.
        } else if (/\(.*\)/.test(value)) { // Comprueba si el valor contiene paréntesis
          let newValue = value;
          if (value.toLowerCase().includes('tricolor')) { // Si el valor contiene "tricolor", reemplaza el texto y separa los colores
            newValue = value.replace(/Tricolor \(.*?\)(;|$)/gi, 'Tricolor (Negro, marrón y blanco)$1');
            newValue = newValue.split(';').map(color => color.trim());
          } else { // Si no contiene "tricolor", solo separa los valores por ";"
            newValue = newValue.split(';').map(color => color.trim());
          }
          data[key] = newValue; // Reemplaza el valor original con el nuevo valor modificado
        } else if (value.includes(';')) { // Comprueba si el valor contiene ";"
          const values = value.split(';').map(v => v.trim()); // Separa los valores por ";"
          data[key] = values; // Reemplaza el valor original con los nuevos valores separados
        }
      });
      RazaArray.push(data); // Agrega el objeto modificado al array de objetos
    })
    .on('end', () => { // Cuando se termina de leer el stream
      callback(null, RazaArray); // Devuelve el array de objetos convertidos a JSON
    })
    .on('error', (err) => { // Si ocurre un error al leer el archivo
      callback(err); // Devuelve el error al callback
    });
}

router.get('/', (req, res) => {
  csvToJson('data/raza_info.csv', (err, json) => {
    if (err) {
      console.error(err);
    } else {
      const response = {
        servicio: "raza",
        total: json.length,
        data: json
      }
      res.send(response)
    }
  });
});  

//pruebas que hice 
router.get('/:id', async (req, res) => {
  csvToJson('data/raza_info.csv', async (err, json) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      const { id } = req.params;
      const result = json.filter(raza => raza.raza == id);
      
      if (result.length > 0) {
        const perros = await fetch(`http://perros:3000/api/v1/perros/raza/${id}`);
        const perrosJson = await perros.json();
        const razaInfo = result[0];
        
        const response = {
          servicio: "razas",
          total: result.length,
          raza: razaInfo,
          perros: perrosJson
        }
        res.send(response);
      } else {
        res.status(404).send('Raza no encontrada');
      }
    }
  });
});

//Punto #1
router.get('/raza/:color/:tamanio', (req, res) => {
  csvToJson('data/raza_info.csv', (err, json) => {
    if (err) {
      console.error(err);
    } else {
      const {color, tamanio} = req.params;
      const result = json.filter(raza => raza.color_de_pelo == color && raza.tamanio_de_pelo == tamanio);
      
      if(result){
        const response = {
          servicio: "raza",
          total: result.length,
          data: result
        }
        res.send(response)
      } else{
        res.status(404).send('raza no encontrado');
      }
      
    }
  });
})




module.exports = router;