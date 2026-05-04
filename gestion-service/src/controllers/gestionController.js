// gestion-service/src/controllers/gestionController.js
// Controlador de gestión de sucursales

const conexion = require('../db');

// Obtener todas las sucursales
const getGestion = (req, res) => {
  conexion.query('SELECT * FROM sucursales', (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error en la BD' });
    res.json(resultados);
  });
};

// Crear una nueva sucursal
const crearGestion = (req, res) => {
  const { nombre, descripcion, estado, direccion, region } = req.body;
  const query = 'INSERT INTO sucursales (nombre, descripcion, estado, direccion, region) VALUES (?, ?, ?, ?, ?)';
  conexion.query(query, [nombre, descripcion, estado || 'activo', direccion, region], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error en la BD' });
    res.status(201).json({ mensaje: 'Sucursal creada', id: resultado.insertId });
  });
};

// Actualizar una sucursal por id
const actualizarGestion = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado, direccion, region } = req.body;
  const query = 'UPDATE sucursales SET nombre = ?, descripcion = ?, estado = ?, direccion = ?, region = ? WHERE id = ?';
  conexion.query(query, [nombre, descripcion, estado, direccion, region, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error en la BD' });
    res.json({ mensaje: 'Sucursal actualizada' });
  });
};

// Eliminar una sucursal por id
const eliminarGestion = (req, res) => {
  const { id } = req.params;
  conexion.query('DELETE FROM sucursales WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error en la BD' });
    res.json({ mensaje: 'Sucursal eliminada' });
  });
};

module.exports = {
  getGestion,
  crearGestion,
  actualizarGestion,
  eliminarGestion
};