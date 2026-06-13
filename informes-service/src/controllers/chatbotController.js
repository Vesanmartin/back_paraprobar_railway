// src/controllers/chatbotController.js
const servicioChatbot  = require('../services/chatbotService');
const servicioContexto = require('../services/contextoService');

const preguntar = async (req, res) => {
  try {
    // Extraemos la pregunta del usuario y filtros opcionales del body
    const { pregunta, filtros = {} } = req.body;

    // Validación: la pregunta es obligatoria
    if (!pregunta) {
      return res.status(400).json({
        success: false,
        error: 'Debes enviar una "pregunta" en el body'
      });
    }

    console.log(`Pregunta recibida: ${pregunta}`);

    // Se obtiene  el contexto de datos desde la BD según la pregunta y filtros
    // incluye ventas, compras, productos, sucursales, etc.
    const datos = await servicioContexto.obtenerContexto(filtros, pregunta);

    // Enviamos la pregunta + contexto a Ollama y obtenemos la respuesta en texto
    const resultado = await servicioChatbot.responder(pregunta, datos);

    // Devolvemos la respuesta de Ollama + los datos estructurados para los gráficos
    // El frontend usa datos_grafico para renderizar los charts de Recharts
    res.json({
      ...resultado,
      datos_grafico: {
        ventas_por_mes:      datos.ventas_erp          || [],  // gráfico de línea
        ventas_por_sucursal: datos.ventas_por_sucursal  || [],  //  gráfico de torta
        top_productos:       datos.top_productos        || [],  //  gráfico de barras
        compras_por_mes:     datos.compras_erp          || []   //  gráfico de barras
      }
    });

  } catch (error) {
    console.error('Error en chatbot controller:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { preguntar };