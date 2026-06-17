// src/tests/chatbotService.test.js
// Pruebas unitarias para el ServicioChatbot
// El método responder() llama a Ollama — lo mockeamos para no depender del servicio externo
// El método _construirContexto() tiene lógica pura — se prueba directo

const servicioChatbot = require('../services/chatbotService');

// MOCK DE FETCH
// Reemplazamos fetch global para simular respuestas de Ollama sin llamarlo realmente
global.fetch = jest.fn();

// Limpiamos el mock antes de cada prueba para no contaminar resultados
beforeEach(() => {
  jest.clearAllMocks();
});


// PRUEBAS DE _construirContexto()
// Lógica pura — no necesita mock
describe('ServicioChatbot - _construirContexto()', () => {

  test('debe retornar mensaje vacío si no hay datos', () => {
    const resultado = servicioChatbot._construirContexto({});
    expect(resultado).toBe('No hay datos disponibles.');
  });

  test('debe retornar mensaje vacío si datos es null', () => {
    const resultado = servicioChatbot._construirContexto(null);
    expect(resultado).toBe('No hay datos disponibles.');
  });

  test('debe incluir sección VENTAS POR MES si hay ventas_erp', () => {
    const datos = {
      ventas_erp: [
        { mes: 1, año: 2024, total_ventas: 1000000, cantidad_transacciones: 50 }
      ]
    };
    const resultado = servicioChatbot._construirContexto(datos);
    expect(resultado).toContain('VENTAS POR MES');
    expect(resultado).toContain('1/2024');
  });

  test('debe incluir sección VENTAS POR SUCURSAL si hay datos', () => {
    const datos = {
      ventas_por_sucursal: [
        { sucursal: 'Casa Matriz', total_ventas: 5000000, transacciones: 200 }
      ]
    };
    const resultado = servicioChatbot._construirContexto(datos);
    expect(resultado).toContain('VENTAS POR SUCURSAL');
    expect(resultado).toContain('Casa Matriz');
  });

  test('debe incluir sección TOP PRODUCTOS si hay datos', () => {
    const datos = {
      top_productos: [
        { nombre_producto: 'Café Granulado', unidades_vendidas: 100, total_generado: 500000 }
      ]
    };
    const resultado = servicioChatbot._construirContexto(datos);
    expect(resultado).toContain('TOP PRODUCTOS');
    expect(resultado).toContain('Café Granulado');
  });

  test('debe incluir sección COMPRAS POR MES si hay compras_erp', () => {
    const datos = {
      compras_erp: [
        { mes: 3, año: 2024, total_compras: 800000 }
      ]
    };
    const resultado = servicioChatbot._construirContexto(datos);
    expect(resultado).toContain('COMPRAS POR MES');
    expect(resultado).toContain('3/2024');
  });

  test('debe incluir el período analizado si hay filtros', () => {
    const datos = {
      filtros_aplicados: { año: 2024 }
    };
    const resultado = servicioChatbot._construirContexto(datos);
    expect(resultado).toContain('2024');
  });
});

// PRUEBAS DE responder()
// Mockeamos fetch para simular Ollama

describe('ServicioChatbot - responder()', () => {

  test('debe retornar respuesta exitosa cuando Ollama responde bien', async () => {
    // Simulamos que Ollama responde con un mensaje
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: { content: 'Respuesta de CORDI mockeada' }
      })
    });

    const resultado = await servicioChatbot.responder('ventas por mes', {});

    expect(resultado.success).toBe(true);
    expect(resultado.respuesta).toBe('Respuesta de CORDI mockeada');
    expect(resultado.modelo).toBe('llama3.2');
    expect(resultado.pregunta).toBe('ventas por mes');
  });

  test('debe incluir la pregunta en la respuesta', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: { content: 'cualquier respuesta' }
      })
    });

    const resultado = await servicioChatbot.responder('top productos', {});
    expect(resultado.pregunta).toBe('top productos');
  });

  test('debe lanzar error si Ollama responde con status de error', async () => {
    // Simulamos que Ollama devuelve un error 500
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(
      servicioChatbot.responder('ventas', {})
    ).rejects.toThrow('Error al procesar la pregunta');
  });

  test('debe lanzar error si fetch falla completamente', async () => {
    // Simulamos que la red falla
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(
      servicioChatbot.responder('ventas', {})
    ).rejects.toThrow('Error al procesar la pregunta');
  });

  test('debe llamar a fetch con la URL correcta de Ollama', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: { content: 'ok' }
      })
    });

    await servicioChatbot.responder('test', {});

    expect(global.fetch).toHaveBeenCalledWith(
      'http://host.docker.internal:11434/api/chat',
      expect.objectContaining({ method: 'POST' })
    );
  });
});