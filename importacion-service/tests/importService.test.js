const importService = require('../src/services/importService');
const ConnectorFactory = require('../src/services/factories/connectorFactory');

jest.mock('../src/services/factories/connectorFactory');

describe('ImportService', () => {

    test('debe importar datos correctamente', async () => {

        const mockFetchData = jest.fn().mockResolvedValue({
            totalRegistros: 100,
            origen: 'ERP'
        });

        ConnectorFactory.createConnector.mockReturnValue({
            fetchData: mockFetchData
        });

        const resultado = await importService.importData('ERP');

        expect(resultado.totalRegistros).toBe(100);
        expect(resultado.origen).toBe('ERP');
        expect(resultado.processedAt).toBeDefined();
    });

    test('debe importar datos desde ERP', async () => {

    ConnectorFactory.createConnector.mockReturnValue({
        fetchData: jest.fn().mockResolvedValue({
            totalRegistros: 50,
            origen: 'ERP'
        })
    });

    const resultado = await importService.importData('ERP');

    expect(resultado.totalRegistros).toBe(50);
    expect(resultado.origen).toBe('ERP');
});

test('debe importar datos desde CRM', async () => {

    ConnectorFactory.createConnector.mockReturnValue({
        fetchData: jest.fn().mockResolvedValue({
            totalRegistros: 25,
            origen: 'CRM'
        })
    });

    const resultado = await importService.importData('CRM');

    expect(resultado.totalRegistros).toBe(25);
    expect(resultado.origen).toBe('CRM');
});

test('debe agregar processedAt', async () => {

    ConnectorFactory.createConnector.mockReturnValue({
        fetchData: jest.fn().mockResolvedValue({
            totalRegistros: 10
        })
    });

    const resultado = await importService.importData('POS');

    expect(resultado.processedAt).toBeDefined();
});

});