// src/repositories/gestionRepository.js
// Capa de acceso a datos — separa las consultas SQL del controller
// Patrón Repository: el controller no sabe cómo se obtienen los datos,
// solo llama al repositorio y recibe el resultado

const db = require('../config/db');

// Repositorio de Productos
const ProductoRepository = {
    // Obtiene todos los productos de la BD
    obtenerTodos: async () => {
        const [filas] = await db.query('SELECT * FROM productos');
        return filas;
    }
};

// Repositorio de Sucursales
const SucursalRepository = {
    obtenerTodas: async () => {
        const [filas] = await db.query('SELECT * FROM sucursales');
        return filas;
    },
    crear: async ({ nombre, descripcion, direccion, region, estado }) => {
        const [resultado] = await db.query(
            'INSERT INTO sucursales (nombre, descripcion, direccion, region, estado) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, direccion, region, estado || 'activo']
        );
        return { id: resultado.insertId, nombre, descripcion, direccion, region, estado: estado || 'activo' };
    },
    eliminar: async (id) => {
        await db.query('DELETE FROM sucursales WHERE id = ?', [id]);
    }
};

// Repositorio de Empleados
const EmpleadoRepository = {
    obtenerTodos: async () => {
        const [filas] = await db.query('SELECT * FROM empleados');
        return filas;
    }
};

// Repositorio de Terceros
const TerceroRepository = {
    obtenerTodos: async () => {
        const [filas] = await db.query('SELECT * FROM terceros');
        return filas;
    }
};

module.exports = {
    ProductoRepository,
    SucursalRepository,
    EmpleadoRepository,
    TerceroRepository
};
