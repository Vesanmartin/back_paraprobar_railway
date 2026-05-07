// src/services/contextoService.js
// Obtiene resumen de datos reales desde la BD grupocordillera
// para pasárselo como contexto a Ollama antes de responder.

const conexion = require('../config/database');

class ContextoService {

  async obtenerContexto() {
    try {
      const [resumenERP, topProductos, porSucursal, ventasPOS, ultimasImportaciones] = await Promise.all([
        this._resumenVentasERP(),
        this._topProductos(),
        this._ventasPorSucursalERP(),
        this._resumenVentasPOS(),
        this._ultimasImportaciones()
      ]);

      return {
        ventas_erp:            resumenERP,
        top_productos:         topProductos,
        ventas_por_sucursal:   porSucursal,
        ventas_pos:            ventasPOS,
        ultimas_importaciones: ultimasImportaciones
      };

    } catch (error) {
      console.error('Error obteniendo contexto:', error.message);
      return {};
    }
  }

  // Resumen de ventas ERP agrupado por mes
  _resumenVentasERP() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT año, mes,
                COUNT(*)     AS cantidad_transacciones,
                SUM(total)   AS total_ventas,
                SUM(cantidad) AS unidades_vendidas
         FROM transacciones_erp
         WHERE tipo = 'venta'
         GROUP BY año, mes
         ORDER BY año DESC, mes DESC
         LIMIT 6`,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  }

  // Top 5 productos más vendidos por total generado
  _topProductos() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT nombre_producto,
                SUM(cantidad) AS unidades_vendidas,
                SUM(total)    AS total_generado
         FROM transacciones_erp
         WHERE tipo = 'venta'
         GROUP BY nombre_producto
         ORDER BY total_generado DESC
         LIMIT 5`,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  }

  // Ventas ERP por sucursal
  _ventasPorSucursalERP() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT sucursal,
                COUNT(*)   AS transacciones,
                SUM(total) AS total_ventas
         FROM transacciones_erp
         WHERE tipo = 'venta'
         GROUP BY sucursal
         ORDER BY total_ventas DESC`,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  }

  // Resumen ventas POS por sucursal (puede estar vacía, no falla)
  _resumenVentasPOS() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT sucursal,
                COUNT(*)   AS cantidad_boletas,
                SUM(total) AS total_ventas
         FROM ventas_pos
         GROUP BY sucursal
         ORDER BY total_ventas DESC`,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados); // devuelve [] si está vacía
        }
      );
    });
  }

  // Últimas 5 importaciones registradas
  _ultimasImportaciones() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT fuente, sucursal, registros, estado, created_at
         FROM importaciones
         ORDER BY created_at DESC
         LIMIT 5`,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  }
}


module.exports = new ContextoService();