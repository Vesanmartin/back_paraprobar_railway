// src/tests/circuitBreaker.test.js
// Pruebas unitarias para el patrón Circuit Breaker
// Probamos los 3 estados: CERRADO, ABIERTO y RECUPERACION
// No necesita Docker ni conexión a nada externo

const CircuitBreaker = require('../patterns/circuitBreaker');

// --- ESTADO INICIAL ---
describe('CircuitBreaker - estado inicial', () => {

  test('debe iniciar en estado CERRADO', () => {
    const breaker = new CircuitBreaker();
    expect(breaker.estado).toBe('CERRADO');
  });

  test('debe iniciar con 0 fallos', () => {
    const breaker = new CircuitBreaker();
    expect(breaker.fallos).toBe(0);
  });

  test('debe usar límite de 3 fallos por defecto', () => {
    const breaker = new CircuitBreaker();
    expect(breaker.limite).toBe(3);
  });

  test('debe respetar opciones personalizadas', () => {
    const breaker = new CircuitBreaker({ limite: 5, nombre: 'MiBreaker' });
    expect(breaker.limite).toBe(5);
    expect(breaker.nombre).toBe('MiBreaker');
  });
});

// ESTADO CERRADO: llamadas exitosas
describe('CircuitBreaker - estado CERRADO', () => {

  test('debe ejecutar la función y retornar el resultado', async () => {
    const breaker = new CircuitBreaker();
    // Simulamos una llamada exitosa con una función que devuelve un valor
    const resultado = await breaker.ejecutar(() => Promise.resolve('ok'));
    expect(resultado).toBe('ok');
  });

  test('debe mantenerse CERRADO después de una llamada exitosa', async () => {
    const breaker = new CircuitBreaker();
    await breaker.ejecutar(() => Promise.resolve('ok'));
    expect(breaker.estado).toBe('CERRADO');
  });

  test('debe contar fallos cuando la función lanza error', async () => {
    const breaker = new CircuitBreaker();
    // Simulamos una llamada que falla
    try {
      await breaker.ejecutar(() => Promise.reject(new Error('fallo')));
    } catch {}
    expect(breaker.fallos).toBe(1);
  });
});

// ESTADO ABIERTO: después de muchos fallos
describe('CircuitBreaker - se abre tras fallos consecutivos', () => {

  test('debe abrirse después de 3 fallos consecutivos', async () => {
    const breaker = new CircuitBreaker({ limite: 3 });

    // Provocamos 3 fallos seguidos
    for (let i = 0; i < 3; i++) {
      try {
        await breaker.ejecutar(() => Promise.reject(new Error('fallo')));
      } catch {}
    }

    expect(breaker.estado).toBe('ABIERTO');
  });

  test('debe bloquear llamadas cuando está ABIERTO', async () => {
    const breaker = new CircuitBreaker({ limite: 3, tiempoEspera: 60000 });

    // Abrimos el circuito
    for (let i = 0; i < 3; i++) {
      try {
        await breaker.ejecutar(() => Promise.reject(new Error('fallo')));
      } catch {}
    }

    // Ahora debe bloquear sin siquiera intentar la llamada
    await expect(
      breaker.ejecutar(() => Promise.resolve('no debería llegar aquí'))
    ).rejects.toThrow('Circuito ABIERTO');
  });

  test('el mensaje de error debe indicar los segundos de espera', async () => {
    const breaker = new CircuitBreaker({ limite: 1, tiempoEspera: 30000 });

    try {
      await breaker.ejecutar(() => Promise.reject(new Error('fallo')));
    } catch {}

    await expect(
      breaker.ejecutar(() => Promise.resolve('ok'))
    ).rejects.toThrow('Reintenta en');
  });
});

// ESTADO RECUPERACION
describe('CircuitBreaker - recuperación', () => {

  test('debe pasar a RECUPERACION después del tiempo de espera', async () => {
    // Usamos tiempo de espera muy corto para la prueba (1ms)
    const breaker = new CircuitBreaker({ limite: 1, tiempoEspera: 1 });

    try {
      await breaker.ejecutar(() => Promise.reject(new Error('fallo')));
    } catch {}

    // Esperamos que pase el tiempo
    await new Promise(r => setTimeout(r, 10));

    // La próxima llamada debe intentar recuperarse
    await breaker.ejecutar(() => Promise.resolve('recuperado'));
    expect(breaker.estado).toBe('CERRADO');
  });

  test('debe volver a ABIERTO si falla en estado RECUPERACION', async () => {
    const breaker = new CircuitBreaker({ limite: 1, tiempoEspera: 1 });

    // Primer fallo — abre el circuito
    try {
      await breaker.ejecutar(() => Promise.reject(new Error('fallo')));
    } catch {}

    await new Promise(r => setTimeout(r, 10));

    // Falla de nuevo en recuperación — vuelve a abrirse
    try {
      await breaker.ejecutar(() => Promise.reject(new Error('fallo recuperacion')));
    } catch {}

    expect(breaker.estado).toBe('ABIERTO');
  });
});

// obtenerEstado()
describe('CircuitBreaker - obtenerEstado()', () => {

  test('debe retornar el estado actual del circuito', () => {
    const breaker = new CircuitBreaker({ nombre: 'TestBreaker' });
    const estado = breaker.obtenerEstado();

    expect(estado.nombre).toBe('TestBreaker');
    expect(estado.estado).toBe('CERRADO');
    expect(estado.fallos).toBe(0);
    expect(estado.ultimoFallo).toBeNull();
  });

  test('debe registrar la fecha del último fallo', async () => {
    const breaker = new CircuitBreaker();

    try {
      await breaker.ejecutar(() => Promise.reject(new Error('fallo')));
    } catch {}

    const estado = breaker.obtenerEstado();
    expect(estado.ultimoFallo).not.toBeNull();
  });
});