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
/**
 * @swagger
 * /api/gestion/gestion:
 *   post:
 *     summary: Crea una nueva sucursal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - direccion
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Sucursal Centro
 *               descripcion:
 *                 type: string
 *                 example: Sucursal principal de la empresa
 *               direccion:
 *                 type: string
 *                 example: Av. Principal 123
 *               region:
 *                 type: string
 *                 example: Metropolitana
 *               estado:
 *                 type: string
 *                 example: activo
 *     responses:
 *       201:
 *         description: Sucursal creada
 */
router.post('/gestion/gestion', crearSucursal);

/**
/**
 * @swagger
 * /api/gestion/gestion/{id}:
 *   delete:
 *     summary: Elimina una sucursal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sucursal a eliminar
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