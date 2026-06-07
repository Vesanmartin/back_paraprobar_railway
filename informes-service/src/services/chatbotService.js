// src/services/chatbotService.js
const OLLAMA_URL = 'http://host.docker.internal:11434/api/chat';
const TIMEOUT_MS = 300000;

class ServicioChatbot {

  async responder(pregunta, datos = {}) {
    try {
      const contexto = this._construirContexto(datos);

      console.log('=== CONTEXTO ENVIADO A OLLAMA ===');
      console.log(contexto);
      console.log('================================');

      const controlador = new AbortController();
      const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);

      let respuesta;
      try {
        respuesta = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controlador.signal,
          body: JSON.stringify({
            model: 'llama3.2',
            stream: false,
            messages: [
              {
                role: 'system',
                content: `Eres CORDI, analista sarcástico de Grupo Cordillera.
Tratas al usuario como un CEO que no entiende sus números.
Eres ácido, directo y siempre tienes razón.
JAMÁS inventas cifras — solo usas los datos entregados.
JAMÁS generas código — solo texto con análisis.
Si no hay datos, lo dices con sarcasmo.
Respondes en español. Terminas con una observación ácida.

Datos:
${contexto}`
              },
              {
                role: 'user',
                content: pregunta
              }
            ]
          })
        });
      } finally {
        clearTimeout(temporizador);
      }

      if (!respuesta.ok) {
        throw new Error(`Ollama respondió con status ${respuesta.status}`);
      }

      const resultado = await respuesta.json();

      return {
        success:   true,
        pregunta,
        respuesta: resultado.message.content,
        modelo:    'llama3.2'
      };

    } catch (error) {
      console.error('Error en chatbot:', error.message);
      throw new Error(`Error al procesar la pregunta: ${error.message}`);
    }
  }

  _construirContexto(datos) {
    if (!datos || Object.keys(datos).length === 0) {
      return 'No hay datos disponibles.';
    }

    let texto = '';

    if (datos.ventas_erp?.length) {
      texto += 'VENTAS POR MES:\n';
      datos.ventas_erp.forEach(v => {
        texto += `- ${v.mes}/${v.año}: $${parseFloat(v.total_ventas).toLocaleString('es-CL')} (${v.cantidad_transacciones} transacciones)\n`;
      });
      texto += '\n';
    }

    if (datos.ventas_por_sucursal?.length) {
      texto += 'VENTAS POR SUCURSAL:\n';
      datos.ventas_por_sucursal.forEach(s => {
        texto += `- ${s.sucursal}: $${parseFloat(s.total_ventas).toLocaleString('es-CL')} (${s.transacciones} transacciones)\n`;
      });
      texto += '\n';
    }

    if (datos.top_productos?.length) {
      texto += 'TOP PRODUCTOS:\n';
      datos.top_productos.forEach(p => {
        texto += `- ${p.nombre_producto}: ${p.unidades_vendidas} unidades, $${parseFloat(p.total_generado).toLocaleString('es-CL')}\n`;
      });
      texto += '\n';
    }

    if (datos.compras_erp?.length) {
      texto += 'COMPRAS POR MES:\n';
      datos.compras_erp.forEach(c => {
        texto += `- ${c.mes}/${c.año}: $${parseFloat(c.total_compras).toLocaleString('es-CL')}\n`;
      });
      texto += '\n';
    }

    if (datos.filtros_aplicados?.año) {
      texto += `Período analizado: año ${datos.filtros_aplicados.año}\n`;
    }

    return texto || 'No hay datos disponibles.';
  }
}

module.exports = new ServicioChatbot();