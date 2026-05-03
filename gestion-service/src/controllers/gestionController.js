// gestion-service/src/controllers/gestionController.js
// Controlador de gestión conectado a MySQL

const conexion = require('../db');

// Obtener todos los proyectos
const getGestion = (req, res) => {
  conexion.query('SELECT * FROM proyectos', (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error en la BD' });
    res.json(resultados);
  });
};

// Crear un nuevo proyecto
const crearGestion = (req, res) => {
  const { nombre, descripcion, estado } = req.body;
  const query = 'INSERT INTO proyectos (nombre, descripcion, estado) VALUES (?, ?, ?)';
  conexion.query(query, [nombre, descripcion, estado || 'activo'], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error en la BD' });
    res.status(201).json({ mensaje: 'Proyecto creado', id: resultado.insertId });
  });
};

// Actualizar un proyecto por id
const actualizarGestion = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado } = req.body;
  const query = 'UPDATE proyectos SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?';
  conexion.query(query, [nombre, descripcion, estado, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error en la BD' });
    res.json({ mensaje: 'Proyecto actualizado' });
  });
};

// Eliminar un proyecto por id
const eliminarGestion = (req, res) => {
  const { id } = req.params;
  conexion.query('DELETE FROM proyectos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error en la BD' });
    res.json({ mensaje: 'Proyecto eliminado' });
  });
};

module.exports = {
  getGestion,
  crearGestion,
  actualizarGestion,
  eliminarGestion
};