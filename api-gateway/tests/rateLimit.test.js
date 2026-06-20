// tests/rateLimit.test.js
// Pruebas unitarias básicas para los middlewares de rate limiting

const { limitadorGeneral, limitadorLogin } = require('../src/middleware/rateLimit');

describe('Rate Limit Middlewares', () => {

    test('limitadorGeneral debe ser una función middleware', () => {
        expect(typeof limitadorGeneral).toBe('function');
    });

    test('limitadorLogin debe ser una función middleware', () => {
        expect(typeof limitadorLogin).toBe('function');
    });
});

