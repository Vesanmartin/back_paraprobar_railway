// gestion-service/src/controllers/gestionController.js
// Controlador de gestión de datos
// Por ahora usa array en memoria, pendiente conectar a MySQL

let proyectos = [];

// Obtener todos los proyectos
const getGestion = (req, res) => {
  res.json(proyectos);
};

// Crear un nuevo proyecto
const crearGestion = (req, res) => {
  const nuevo = req.body;
  proyectos.push(nuevo);
  res.json({ mensaje: 'Proyecto creado', nuevo });
};

// Actualizar un proyecto por índice
const actualizarGestion = (req, res) => {
  const id = req.params.id;
  if (!proyectos[id]) {
    return res.status(404).json({ mensaje: 'No encontrado' });
  }
  proyectos[id] = req.body;
  res.json({ mensaje: 'Proyecto actualizado' });
};

// Eliminar un proyecto por índice
const eliminarGestion = (req, res) => {
  const id = req.params.id;
  if (!proyectos[id]) {
    return res.status(404).json({ mensaje: 'No encontrado' });
  }
  proyectos.splice(id, 1);
  res.json({ mensaje: 'Proyecto eliminado' });
};

module.exports = {
  getGestion,
  crearGestion,
  actualizarGestion,
  eliminarGestion
};