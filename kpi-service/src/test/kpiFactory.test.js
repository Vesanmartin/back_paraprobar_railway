// src/tests/kpiFactory.test.js
// Pruebas unitarias - KPI Service
// Probamos el patrón Factory Method que implementamos para calcular KPIs
// Usamos Jest para correr las pruebas
// Ojo: estas pruebas no necesitan BD ni Docker corriendo

const FabricaKPI = require('../patterns/kpiFactory');

// PRUEBAS DE KPI FACTORY
// Verificamos que el Factory crea bien los objetos según el tipo
describe('FabricaKPI', () => {

  test('crear() debe devolver un calculador de ventas', () => {
    const calculador = FabricaKPI.crear('ventas');
    expect(calculador).toBeDefined();
    expect(typeof calculador.calculate).toBe('function');
  });

  test('crear() debe devolver un calculador de inventario', () => {
    const calculador = FabricaKPI.crear('inventario');
    expect(calculador).toBeDefined();
  });

  test('crear() debe devolver un calculador de rentabilidad', () => {
    const calculador = FabricaKPI.crear('rentabilidad');
    expect(calculador).toBeDefined();
  });

  test('crear() debe devolver un calculador de tendencias', () => {
    const calculador = FabricaKPI.crear('tendencias');
    expect(calculador).toBeDefined();
  });

  // Si el tipo no existe, EL KPI Factory debe lanzar un error
  test('crear() debe lanzar error si el tipo no existe', () => {
    expect(() => FabricaKPI.crear('desconocido')).toThrow('no existe');
  });

  // getTiposDisponibles() lo usamos en el frontend para mostrar las opciones
  test('getTiposDisponibles() debe retornar los 4 tipos', () => {
    const tipos = FabricaKPI.getTiposDisponibles();
    expect(tipos).toContain('ventas');
    expect(tipos).toContain('inventario');
    expect(tipos).toContain('rentabilidad');
    expect(tipos).toContain('tendencias');
  });
});

// PRUEBAS CALCULADOR DE VENTAS
// Simulamos datos de ventas sin tocar la BD
describe('CalculadorVentas', () => {

  const calculador = FabricaKPI.crear('ventas');

  // OJO: Datos de prueba inventados, reemplazan los datos reales de MySQL
  const datosVentas = [
    { amount: 100000 },
    { amount: 200000 },
    { amount: 150000 }
  ];

  test('debe contar bien cuántas ventas hay', () => {
    const resultado = calculador.calculate(datosVentas);
    expect(resultado.totalVentas).toBe(3);
  });

  test('debe sumar bien el ingreso total', () => {
    const resultado = calculador.calculate(datosVentas);
    expect(resultado.ingresoTotal).toBe('450000');
  });

  test('debe calcular el ticket promedio (450000 / 3 = 150000)', () => {
    const resultado = calculador.calculate(datosVentas);
    expect(resultado.ticketPromedio).toBe('150000');
  });

  // validate() heredado de la clase base debe rechazar arrays vacíos
  test('debe fallar si el array viene vacío', () => {
    expect(() => calculador.calculate([])).toThrow('array con datos');
  });

  test('debe fallar si no viene un array', () => {
    expect(() => calculador.calculate({})).toThrow('array con datos');
  });
});

// PRUEBAS CALCULADOR DE INVENTARIO
describe('CalculadorInventario', () => {

  const calculador = FabricaKPI.crear('inventario');

  // 2 productos con stock bajo el mínimo, 2 ok
  const datosInventario = [
    { stock: 5,  minStock: 10 }, // crítico
    { stock: 20, minStock: 10 }, // ok
    { stock: 3,  minStock: 10 }, // crítico
    { stock: 15, minStock: 10 }  // ok
  ];

  test('debe contar el total de productos', () => {
    const resultado = calculador.calculate(datosInventario);
    expect(resultado.totalProductos).toBe(4);
  });

  test('debe detectar los 2 productos en stock crítico', () => {
    const resultado = calculador.calculate(datosInventario);
    expect(resultado.stockCritico).toBe(2);
  });

  test('debe calcular 50% de productos críticos (2 de 4)', () => {
    const resultado = calculador.calculate(datosInventario);
    expect(resultado.porcentajeCritico).toBe('50.0%');
  });
});

// PRUEBAS CALCULADOR RENTABILIDAD
describe('CalculadorRentabilidad', () => {

  const calculador = FabricaKPI.crear('rentabilidad');

  const datosRentabilidad = [
    { revenue: 1000000, cost: 600000 },
    { revenue: 500000,  cost: 300000 }
  ];

  test('debe sumar los ingresos correctamente', () => {
    const resultado = calculador.calculate(datosRentabilidad);
    expect(resultado.ingresos).toBe('1500000.00');
  });

  test('debe sumar los costos correctamente', () => {
    const resultado = calculador.calculate(datosRentabilidad);
    expect(resultado.costos).toBe('900000.00');
  });

  test('utilidad debe ser ingresos menos costos (600000)', () => {
    const resultado = calculador.calculate(datosRentabilidad);
    expect(resultado.utilidad).toBe('600000.00');
  });

  test('margen debe ser 40% (600000 / 1500000)', () => {
    const resultado = calculador.calculate(datosRentabilidad);
    expect(resultado.margen).toBe('40.00%');
  });

  // Caso "XTREM": si no hay ingresos, no debe dividir por cero
  test('debe retornar 0% de margen si no hay ingresos', () => {
    const resultado = calculador.calculate([{ revenue: 0, cost: 100 }]);
    expect(resultado.margen).toBe('0.00%');
  });
});

// PRUEBAS CALCULADOR DE TENDENCIAS
describe('CalculadorTendencias', () => {

  const calculador = FabricaKPI.crear('tendencias');

  const datosTendencias = [
    { periodo: '2024-01', ventas: 1000000 },
    { periodo: '2024-02', ventas: 1200000 }, // subió
    { periodo: '2024-03', ventas: 1100000 }  // bajó
  ];

  test('debe contar los 3 períodos', () => {
    const resultado = calculador.calculate(datosTendencias);
    expect(resultado.periodos).toBe(3);
  });

  test('debe calcular 2 variaciones (entre los 3 períodos)', () => {
    const resultado = calculador.calculate(datosTendencias);
    expect(resultado.variaciones.length).toBe(2);
  });

  test('primera variación debe ser alza (de ene a feb subió)', () => {
    const resultado = calculador.calculate(datosTendencias);
    expect(resultado.variaciones[0].tendencia).toBe('Tendencia al alza');
  });

  test('el mejor período debe ser febrero (el de mayor venta)', () => {
    const resultado = calculador.calculate(datosTendencias);
    expect(resultado.mejorPeriodo).toBe('2024-02');
  });
});