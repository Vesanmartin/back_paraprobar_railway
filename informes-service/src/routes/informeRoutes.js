// src/routes/informeRoutes.js

const express    = require('express');
const router     = express.Router();
const {
  getDashboard,
  getEstadoCircuitos,
  getHistorial,
  getDatosDashboard,
  getDatosAnalytics
} = require('../controllers/informeController');

router.get('/health', (req, res) => {
  res.json({ servicio: 'informes-service', estado: 'ok', timestamp: new Date().toISOString() });
});

router.get('/dashboard', getDashboard);
router.get('/circuitos', getEstadoCircuitos);
router.get('/historial', getHistorial);
router.get('/datos-analytics', getDatosAnalytics);

router.post('/publicar-evento', async (req, res) => {
  try {
    const { publicarDatosImportados } = require('../events/publicador');
    await publicarDatosImportados({ sucursal: 'Santiago Centro', tipo: 'ventas', periodo: '2026-05', registros: 150 });
    res.json({ mensaje: 'Evento publicado', cola: 'datos.importados', receptor: 'kpi-service' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/datos-dashboard', getDatosDashboard);

router.get('/resumen-sistema', async (req, res) => {
  const conexion = require('../config/database');
  conexion.query('SELECT COUNT(*) as total FROM usuarios', (err, resUsuarios) => {
    if (err) return res.status(500).json({ error: err.message });
    conexion.query('SELECT COUNT(*) as total, SUM(registros) as registros_totales FROM importaciones', (err, resImportaciones) => {
      if (err) return res.status(500).json({ error: err.message });
      conexion.query('SELECT fuente, sucursal, registros, estado, created_at FROM importaciones ORDER BY created_at DESC LIMIT 5', (err, resUltimas) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, totalUsuarios: resUsuarios[0].total, totalImportaciones: resImportaciones[0].total, registrosTotales: resImportaciones[0].registros_totales, ultimasImportaciones: resUltimas });
      });
    });
  });
});

router.post('/chat', async (req, res) => {
  try {
    const chatbotService  = require('../services/chatbotService');
    const contextoService = require('../services/contextoService');
    const { pregunta } = req.body;
    if (!pregunta) return res.status(400).json({ success: false, error: 'Falta el campo pregunta' });
    console.log('Pregunta recibida:', pregunta);
    const matchAnio = pregunta.match(/20\d{2}/);
    const filtros = matchAnio ? { año: matchAnio[0] } : {};
    const datos = await contextoService.obtenerContexto(filtros);
    const resultado = await chatbotService.responder(pregunta, datos);
    res.json({
      ...resultado,
      datos_grafico: {
        ventas_por_mes:      datos.ventas_erp           || [],
        ventas_por_sucursal: datos.ventas_por_sucursal  || [],
        top_productos:       datos.top_productos        || [],
        compras_por_mes:     datos.compras_erp          || []
      }
    });
  } catch (err) {
    console.error('Error en chat:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
