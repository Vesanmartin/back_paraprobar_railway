// src/controllers/chatbotController.js

const servicioChatbot  = require('../services/chatbotService');
const servicioContexto = require('../services/contextoService');

const preguntar = async (req, res) => {
  try {
    const { pregunta, filtros = {} } = req.body;

    if (!pregunta) {
      return res.status(400).json({
        success: false,
        error: 'Debes enviar una "pregunta" en el body'
      });
    }

    console.log(`Pregunta recibida: ${pregunta}`);

    // Ahora pasamos filtros Y la pregunta para reducir el contexto
    const datos = await servicioContexto.obtenerContexto(filtros, pregunta);
    const resultado = await servicioChatbot.responder(pregunta, datos);

    res.json(resultado);

  } catch (error) {
    console.error('Error en chatbot controller:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { preguntar };