const express = require('express');
const router = express.Router();

const {
    getGestion,
    crearGestion,
    actualizarGestion,
    eliminarGestion
} = require('../controllers/gestionController');

router.get('/gestion', getGestion);
router.post('/gestion', crearGestion);
router.put('/gestion/:id', actualizarGestion);
router.delete('/gestion/:id', eliminarGestion);
router.put('/:id', actualizarGestion);
router.delete('/:id', eliminarGestion)

module.exports = router;