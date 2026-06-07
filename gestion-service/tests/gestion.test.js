// tests/gestion.test.js
// Pruebas unitarias para gestion-service usando Jest
// Se usa mock para simular la base de datos sin conectarse a ella

// Simulamos el módulo de base de datos (mock)
jest.mock('../src/config/db', () => ({
    query: jest.fn()
}));

const db = require('../src/config/db');
const { 
    ProductoRepository, 
    SucursalRepository, 
    EmpleadoRepository, 
    TerceroRepository 
} = require('../src/repositories/gestionRepository');

// =====================
// PRUEBAS DE SUCURSALES
// =====================
describe('SucursalRepository', () => {

    // Limpia los mocks antes de cada prueba
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('obtenerTodas debe retornar lista de sucursales', async () => {
        // Datos falsos que simula la BD
        const sucursalesFalsas = [
            { id: 1, nombre: 'Sucursal Centro', direccion: 'Av. Principal 123' },
            { id: 2, nombre: 'Sucursal Norte', direccion: 'Calle Norte 456' }
        ];

        // Mock: cuando se llame db.query, retorna los datos falsos
        db.query.mockResolvedValue([sucursalesFalsas]);

        // Ejecuta la función
        const resultado = await SucursalRepository.obtenerTodas();

        // Verifica que el resultado sea el esperado
        expect(resultado).toEqual(sucursalesFalsas);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM sucursales');
    });

    test('obtenerTodas debe retornar lista vacía si no hay sucursales', async () => {
        db.query.mockResolvedValue([[]]);

        const resultado = await SucursalRepository.obtenerTodas();

        expect(resultado).toEqual([]);
    });
});

// =====================
// PRUEBAS DE PRODUCTOS
// =====================
describe('ProductoRepository', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('obtenerTodos debe retornar lista de productos', async () => {
        const productosFalsos = [
            { id: 1, nombre: 'Producto A', precio: 1000 },
            { id: 2, nombre: 'Producto B', precio: 2000 }
        ];

        db.query.mockResolvedValue([productosFalsos]);

        const resultado = await ProductoRepository.obtenerTodos();

        expect(resultado).toEqual(productosFalsos);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM productos');
    });

    test('obtenerTodos debe retornar lista vacía si no hay productos', async () => {
        db.query.mockResolvedValue([[]]);

        const resultado = await ProductoRepository.obtenerTodos();

        expect(resultado).toEqual([]);
    });
});

// =====================
// PRUEBAS DE EMPLEADOS
// =====================
describe('EmpleadoRepository', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('obtenerTodos debe retornar lista de empleados', async () => {
        const empleadosFalsos = [
            { id: 1, nombre: 'Juan Pérez', cargo: 'Vendedor' },
            { id: 2, nombre: 'María López', cargo: 'Gerente' }
        ];

        db.query.mockResolvedValue([empleadosFalsos]);

        const resultado = await EmpleadoRepository.obtenerTodos();

        expect(resultado).toEqual(empleadosFalsos);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM empleados');
    });
});

// =====================
// PRUEBAS DE TERCEROS
// =====================
describe('TerceroRepository', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('obtenerTodos debe retornar lista de terceros', async () => {
        const tercerosFalsos = [
            { id: 1, nombre: 'Proveedor A', tipo: 'proveedor' },
            { id: 2, nombre: 'Cliente B', tipo: 'cliente' }
        ];

        db.query.mockResolvedValue([tercerosFalsos]);

        const resultado = await TerceroRepository.obtenerTodos();

        expect(resultado).toEqual(tercerosFalsos);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM terceros');
    });
});