// gestion-service/src/routes/gestionRoutes.js
// Rutas de data maestra para gestion-service

const express = require('express');
const router = express.Router();

const {
  getProductos,
  getSucursales,
  getEmpleados,
  getTerceros,
  crearSucursal,
  eliminarSucursal
} = require('../controllers/gestionController');

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/productos', getProductos);

/**
 * @swagger
 * /api/sucursales:
 *   get:
 *     summary: Obtiene todas las sucursales
 *     responses:
 *       200:
 *         description: Lista de sucursales
 */
router.get('/sucursales', getSucursales);

/**
 * @swagger
 * /api/gestion/gestion:
 *   post:
 *     summary: Crea una nueva sucursal
 *     responses:
 *       201:
 *         description: Sucursal creada
 */
router.post('/gestion/gestion', crearSucursal);

/**
 * @swagger
 * /api/gestion/gestion/{id}:
 *   delete:
 *     summary: Elimina una sucursal
 *     responses:
 *       200:
 *         description: Sucursal eliminada
 */
router.delete('/gestion/gestion/:id', eliminarSucursal);

/**
 * @swagger
 * /api/empleados:
 *   get:
 *     summary: Obtiene todos los empleados
 *     responses:
 *       200:
 *         description: Lista de empleados
 */
router.get('/empleados', getEmpleados);

/**
 * @swagger
 * /api/terceros:
 *   get:
 *     summary: Obtiene proveedores y clientes
 *     responses:
 *       200:
 *         description: Lista de terceros
 */
router.get('/terceros', getTerceros);

module.exports = router;