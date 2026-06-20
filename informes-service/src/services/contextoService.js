// src/services/contextoService.js
const conexion = require('../config/database');

class ContextoService {

  async obtenerContexto(filtros = {}, pregunta = '') {
    try {
      let { año, mes_inicio, mes_fin } = filtros;
      if (!año) año = await this._getMaxAnio();

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
      console.error('Error obteniendo contexto:', error);
      return {};
    }
  }

  async obtenerAnalytics() {
    try {
      const [porFecha, fuentes, paginas, dispositivos] = await Promise.all([
        this._sesionesAnalitica(),
        this._fuentesTrafico(),
        this._paginasTop(),
        this._dispositivosAnalitica()
      ]);
      return { por_fecha: porFecha, fuentes_trafico: fuentes, paginas_top: paginas, dispositivos };
    } catch (error) {
      console.error('Error obteniendo analytics:', error.message);
      return {};
    }
  }

  _getMaxAnio() {
    return new Promise((resolve) => {
      conexion.query('SELECT MAX(anio) as max_anio FROM transacciones_erp', (err, resultados) => {
        if (err) resolve(2024);
        else resolve(resultados[0].max_anio || 2024);
      });
    });
  }

  _resumenVentasERP(año, mes_inicio, mes_fin) {
  const condiciones = ["tipo = 'venta'", 'año = ?'];
  const valores = [parseInt(año)];
  if (mes_inicio) { condiciones.push('mes >= ?'); valores.push(parseInt(mes_inicio)); }
  if (mes_fin)    { condiciones.push('mes <= ?'); valores.push(parseInt(mes_fin)); }
  return new Promise((resolve, reject) => {
    const query = `SELECT año, mes, COUNT(*) AS cantidad_transacciones, SUM(total) AS total_ventas, SUM(cantidad) AS unidades_vendidas
                   FROM transacciones_erp WHERE ${condiciones.join(' AND ')} 
                   GROUP BY año, mes ORDER BY año DESC, mes DESC`;
    console.log('QUERY VENTAS:', query, valores);
    conexion.query(query, valores, (err, r) => {
      console.log('RESULTADO VENTAS:', err, r?.length);
      err ? reject(err) : resolve(r);
    });
  });
}

  _topProductos(año, mes_inicio, mes_fin) {
    const condiciones = ["tipo = 'venta'", 'año = ?'];
    const valores = [parseInt(año)];
    if (mes_inicio) { condiciones.push('mes >= ?'); valores.push(parseInt(mes_inicio)); }
    if (mes_fin)    { condiciones.push('mes <= ?'); valores.push(parseInt(mes_fin)); }
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT nombre_producto, SUM(cantidad) AS unidades_vendidas, SUM(total) AS total_generado
         FROM transacciones_erp WHERE ${condiciones.join(' AND ')} GROUP BY nombre_producto ORDER BY total_generado DESC LIMIT 5`,
        valores, (err, r) => err ? reject(err) : resolve(r)
      );
    });
  }

  _ventasPorSucursalERP(año, mes_inicio, mes_fin) {
    const condiciones = ["tipo = 'venta'", 'año = ?'];
    const valores = [parseInt(año)];
    if (mes_inicio) { condiciones.push('mes >= ?'); valores.push(parseInt(mes_inicio)); }
    if (mes_fin)    { condiciones.push('mes <= ?'); valores.push(parseInt(mes_fin)); }
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT sucursal, COUNT(*) AS transacciones, SUM(total) AS total_ventas
         FROM transacciones_erp WHERE ${condiciones.join(' AND ')} GROUP BY sucursal ORDER BY total_ventas DESC`,
        valores, (err, r) => err ? reject(err) : resolve(r)
      );
    });
  }

  _resumenVentasPOS(año, mes_inicio, mes_fin) {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT sucursal, COUNT(*) AS cantidad_boletas, SUM(total) AS total_ventas FROM ventas_pos GROUP BY sucursal ORDER BY total_ventas DESC`,
        [], (err, r) => err ? reject(err) : resolve(r)
      );
    });
  }

  _resumenComprasERP(año, mes_inicio, mes_fin) {
    const condiciones = ["tipo = 'compra'", 'año = ?'];
    const valores = [parseInt(año)];
    if (mes_inicio) { condiciones.push('mes >= ?'); valores.push(parseInt(mes_inicio)); }
    if (mes_fin)    { condiciones.push('mes <= ?'); valores.push(parseInt(mes_fin)); }
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT año, mes, COUNT(*) AS cantidad_transacciones, SUM(total) AS total_compras
         FROM transacciones_erp WHERE ${condiciones.join(' AND ')} GROUP BY año, mes ORDER BY año DESC, mes DESC`,
        valores, (err, r) => err ? reject(err) : resolve(r)
      );
    });
  }

  _ultimasImportaciones() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT fuente, sucursal, registros, estado, created_at FROM importaciones ORDER BY created_at DESC LIMIT 5`,
        (err, r) => err ? reject(err) : resolve(r)
      );
    });
  }

  _sesionesAnalitica() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT fecha, SUM(sesiones) AS total_sesiones, SUM(usuarios) AS total_usuarios,
                SUM(nuevos_usuarios) AS total_nuevos, ROUND(AVG(bounce_rate), 1) AS bounce_promedio
         FROM analytics_visitas GROUP BY fecha ORDER BY fecha ASC`,
        [], (err, r) => err ? reject(err) : resolve(r)
      );
    });
  }

  _fuentesTrafico() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT fuente_trafico, SUM(sesiones) AS total_sesiones, SUM(usuarios) AS total_usuarios
         FROM analytics_visitas GROUP BY fuente_trafico ORDER BY total_sesiones DESC`,
        [], (err, r) => err ? reject(err) : resolve(r)
      );
    });
  }

  _paginasTop() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT pagina, SUM(sesiones) AS total_sesiones, ROUND(AVG(bounce_rate), 1) AS bounce_promedio,
                ROUND(AVG(duracion_promedio_seg), 0) AS duracion_promedio
         FROM analytics_visitas GROUP BY pagina ORDER BY total_sesiones DESC LIMIT 6`,
        [], (err, r) => err ? reject(err) : resolve(r)
      );
    });
  }

  _dispositivosAnalitica() {
    return new Promise((resolve, reject) => {
      conexion.query(
        `SELECT dispositivo, SUM(sesiones) AS total_sesiones FROM analytics_visitas GROUP BY dispositivo ORDER BY total_sesiones DESC`,
        [], (err, r) => err ? reject(err) : resolve(r)
      );
    });
  }
}

module.exports = new ContextoService();