// tests/auth.test.js
// Pruebas unitarias para los middlewares de autenticación del api-gateway
// Se usa mock de jsonwebtoken para simular tokens válidos e inválidos

jest.mock('jsonwebtoken');

const jwt = require('jsonwebtoken');
const { verificarToken, verificarRol } = require('../src/middleware/auth');

// Función auxiliar para simular el objeto "res" de Express
const crearMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// =====================
// PRUEBAS DE verificarToken
// =====================
describe('verificarToken', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe retornar 401 si no hay header Authorization', () => {
        const req = { headers: {} };
        const res = crearMockRes();
        const next = jest.fn();

        verificarToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: 'Acceso denegado' })
        );
        expect(next).not.toHaveBeenCalled();
    });

    test('debe retornar 401 si el formato del header es inválido', () => {
        // Header presente pero sin "Bearer <token>"
        const req = { headers: { authorization: 'TokenSinBearer' } };
        const res = crearMockRes();
        const next = jest.fn();

        verificarToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: 'Formato inválido' })
        );
        expect(next).not.toHaveBeenCalled();
    });

    test('debe llamar next() y decodificar el usuario si el token es válido', () => {
        const usuarioFalso = { id: 1, rol: 'admin' };
        jwt.verify.mockReturnValue(usuarioFalso);

        const req = { headers: { authorization: 'Bearer token123' } };
        const res = crearMockRes();
        const next = jest.fn();

        verificarToken(req, res, next);

        expect(req.usuario).toEqual(usuarioFalso);
        expect(req.headers['x-usuario-id']).toBe(1);
        expect(req.headers['x-usuario-rol']).toBe('admin');
        expect(next).toHaveBeenCalled();
    });

    test('debe retornar 401 si el token es inválido o expiró', () => {
        jwt.verify.mockImplementation(() => {
            throw new Error('jwt expired');
        });

        const req = { headers: { authorization: 'Bearer tokenVencido' } };
        const res = crearMockRes();
        const next = jest.fn();

        verificarToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: 'Token inválido o expirado' })
        );
        expect(next).not.toHaveBeenCalled();
    });
});

// =====================
// PRUEBAS DE verificarRol
// =====================
describe('verificarRol', () => {

    test('debe llamar next() si el usuario tiene un rol permitido', () => {
        const req = { usuario: { rol: 'admin' } };
        const res = crearMockRes();
        const next = jest.fn();

        const middleware = verificarRol('admin', 'gerente');
        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test('debe retornar 403 si el usuario no tiene un rol permitido', () => {
        const req = { usuario: { rol: 'invitado' } };
        const res = crearMockRes();
        const next = jest.fn();

        const middleware = verificarRol('admin', 'gerente');
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: 'Permisos insuficientes' })
        );
        expect(next).not.toHaveBeenCalled();
    });
});
