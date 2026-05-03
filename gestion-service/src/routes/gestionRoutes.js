// gestion-service/src/routes/gestionRoutes.js
// Define las rutas del servicio de gestión

const express = require('express');
const router = express.Router();
const {
  getGestion,
  crearGestion,
  actualizarGestion,
  eliminarGestion
} = require('../controllers/gestionController');

// Obtener todos los registros de gestión
router.get('/gestion', getGestion);

// Crear un nuevo registro
router.post('/gestion', crearGestion);

// Actualizar por id
router.put('/gestion/:id', actualizarGestion);

// Eliminar por id
router.delete('/gestion/:id', eliminarGestion);

module.exports = router;