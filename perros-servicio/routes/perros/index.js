const express = require("express");
const data = require('../../data/datos_perro')
const router = express.Router();

//const data = require('../../data/datos_perro.json')

const logger = (message) => console.log(`Servicio perros : ${message}`);

router.get('/',(req, res)=>{
    const response = {
        service: "Perros",
        arquitectura: "Microservicio",
        data: data.dataLibrary.perros
    }

    res.send(response);
});

//punto tres
router.get('/:nombre',async(req, res)=>{
    const {nombre} = req.params;
    const result = data.dataLibrary.perros.filter(perro => perro.nombre_perro == nombre);
    if (result.length > 0) {
      const perros = await fetch(`http://premios:4000/api/v1/premios/raza/${id}`);
      const perrosJson = await perros.json();
      const razaInfo = result[0];

        const response = {
          servicio: "perros",
          total: result.length,
          data: result
        }
        res.send(response);
      } else {
        res.status(404).send('perro no encontrado');
      }
});

router.get('/raza/:raza', (req, res) =>{
  const {raza} = req.params;
  const result = data.dataLibrary.perros.filter(razas => razas.raza == raza);
  
  if (result) {
    const response = {
      servicio: "perros",
      total: result.length,
      data: result
    }
    res.send(response);
  } else {
    res.status(404).send('raza no encontrado');
  }
});

router.get('/paisAmo/:pais', (req, res) =>{
  const {pais} = req.params;
  const result = data.dataLibrary.perros.filter(paises => paises.pais_dueno == pais);
  if (result) {
    const response = {
      servicio: "perros",
      total: result.length,
      data: result
    }
    res.send(response);
  } else {
    res.status(404).send('pais no encontrado');
  }
});




module.exports = router;