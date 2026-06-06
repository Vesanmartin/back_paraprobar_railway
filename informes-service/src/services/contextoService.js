// src/services/contextoService.js
const conexion = require('../config/database');

class ContextoService {

  async obtenerContexto(filtros = {}, pregunta = '') {
    try {
      let { año, mes_inicio, mes_fin } = filtros;

      // Si no hay año, obtener el más reciente desde la BD
      if (!año) {
        año = await this._getMaxAnio();
      }

      const preguntaLower = pregunta.toLowerCase();
      const quiereImportaciones = preguntaLower.includes('importa');
      const quiereProductos     = preguntaLower.includes('producto') || preguntaLower.includes('top');
      const quiereCompras       = preguntaLower.includes('compra');
      const quierePOS           = preguntaLower.includes('pos') || preguntaLower.includes('boleta');

      const [resumenERP, topProductos, porSucursal, ventasPOS, ultimasImportaciones, comprasERP] =
        await Promise.all([
          this._resumenVentasERP(año, mes_inicio, mes_fin),
          (quiereProductos || pregunta === '')     ? this._topProductos(año, mes_inicio, mes_fin)      : Promise.resolve([]),
          this._ventasPorSucursalERP(año, mes_inicio, mes_fin),
          (quierePOS || pregunta === '')           ? this._resumenVentasPOS(año, mes_inicio, mes_fin)  : Promise.resolve([]),
          (quiereImportaciones || pregunta === '') ? this._ultimasImportaciones()                      : Promise.resolve([]),
          (quiereCompras || pregunta === '')       ? this._resumenComprasERP(año, mes_inicio, mes_fin) : Promise.resolve([])
        ]);

      return {
        ventas_erp:            resumenERP,
        top_productos:         topProductos,
        ventas_por_sucursal:   porSucursal,
        ventas_pos:            ventasPOS,
        ultimas_importaciones: ultimasImportaciones,
        compras_erp:           comprasERP,
        filtros_aplicados:     { año, mes_inicio, mes_fin }
      };

    } catch (error) {
      console.error('Error obteniendo contexto:', error.message);
      return {};
    }
  }

  // Obtiene el año más reciente sin usar la ñ en la query
  _getMaxAnio() {
    return new Promise((resolve) => {
      conexion.query(
        'SELECT MAX(anio) as max_anio FROM transacciones_erp',
        (err, resultados) => {
          if (err) {
            console.log('Fallback a año 2024');
            resolve(2024);
          } else {
            resolve(resultados[0].max_anio || 2024);
          }
        }
      );
    });
  }

  _resumenVentasERP(año, mes_inicio, mes_fin) {
    const condiciones = ["tipo = 'venta'", 'año = ?'];
    const valores = [parseInt(año)];

    if (mes_inicio) { condiciones.push('mes >= ?'); valores.push(parseInt(mes_inicio)); }
    if (mes_fin)    { condiciones.push('mes <= ?'); valores.push(parseInt(mes_fin)); }

    const where = condiciones.join(' AND ');

    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT año, mes,
                COUNT(*)      AS cantidad_transacciones,
                SUM(total)    AS total_ventas,
                SUM(cantidad) AS unidades_vendidas
         FROM transacciones_erp
         WHERE ${where}
         GROUP BY año, mes
         ORDER BY año DESC, mes DESC`,
        valores,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  }

  _topProductos(año, mes_inicio, mes_fin) {
    const condiciones = ["tipo = 'venta'", 'año = ?'];
    const valores = [parseInt(año)];

    if (mes_inicio) { condiciones.push('mes >= ?'); valores.push(parseInt(mes_inicio)); }
    if (mes_fin)    { condiciones.push('mes <= ?'); valores.push(parseInt(mes_fin)); }

    const where = condiciones.join(' AND ');

    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT nombre_producto,
                SUM(cantidad) AS unidades_vendidas,
                SUM(total)    AS total_generado
         FROM transacciones_erp
         WHERE ${where}
         GROUP BY nombre_producto
         ORDER BY total_generado DESC
         LIMIT 5`,
        valores,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  }

  _ventasPorSucursalERP(año, mes_inicio, mes_fin) {
    const condiciones = ["tipo = 'venta'", 'año = ?'];
    const valores = [parseInt(año)];

    if (mes_inicio) { condiciones.push('mes >= ?'); valores.push(parseInt(mes_inicio)); }
    if (mes_fin)    { condiciones.push('mes <= ?'); valores.push(parseInt(mes_fin)); }

    const where = condiciones.join(' AND ');

    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT sucursal,
                COUNT(*)   AS transacciones,
                SUM(total) AS total_ventas
         FROM transacciones_erp
         WHERE ${where}
         GROUP BY sucursal
         ORDER BY total_ventas DESC`,
        valores,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  }

  _resumenVentasPOS(año, mes_inicio, mes_fin) {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT sucursal,
                COUNT(*)   AS cantidad_boletas,
                SUM(total) AS total_ventas
         FROM ventas_pos
         GROUP BY sucursal
         ORDER BY total_ventas DESC`,
        [],
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  }

  _resumenComprasERP(año, mes_inicio, mes_fin) {
    const condiciones = ["tipo = 'compra'", 'año = ?'];
    const valores = [parseInt(año)];

    if (mes_inicio) { condiciones.push('mes >= ?'); valores.push(parseInt(mes_inicio)); }
    if (mes_fin)    { condiciones.push('mes <= ?'); valores.push(parseInt(mes_fin)); }

    const where = condiciones.join(' AND ');

    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT año, mes,
                COUNT(*)      AS cantidad_transacciones,
                SUM(total)    AS total_compras
         FROM transacciones_erp
         WHERE ${where}
         GROUP BY año, mes
         ORDER BY año DESC, mes DESC`,
        valores,
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados);
        }
      );
    });
  }

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