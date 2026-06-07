const ProcesadorBase = require('./procesadorBase');

class ProcesadorAnalytics extends ProcesadorBase {
  constructor() {
    super('ProcesadorAnalytics', 'analytics_visitas', [
      'fecha', 'pagina', 'sesiones', 'usuarios',
      'nuevos_usuarios', 'bounce_rate', 'duracion_promedio_seg',
      'dispositivo', 'pais', 'fuente_trafico'
    ]);
  }

  mapearFila(fila) {
    if (!fila.fecha || !fila.pagina) {
      throw new Error('Faltan campos obligatorios: fecha, pagina');
    }
    return {
      fecha:                 fila.fecha,
      pagina:                fila.pagina,
      sesiones:              parseInt(fila.sesiones) || 0,
      usuarios:              parseInt(fila.usuarios) || 0,
      nuevos_usuarios:       parseInt(fila.nuevos_usuarios) || 0,
      bounce_rate:           parseFloat(fila.bounce_rate) || 0,
      duracion_promedio_seg: parseInt(fila.duracion_promedio_seg) || 0,
      dispositivo:           fila.dispositivo || 'desktop',
      pais:                  fila.pais || 'Chile',
      fuente_trafico:        fila.fuente_trafico || 'directo'
    };
  }
}

module.exports = ProcesadorAnalytics;
