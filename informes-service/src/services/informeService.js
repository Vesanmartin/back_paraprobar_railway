// src/services/informeService.js

// SERVICE — capa de lógica de negocio

// Este archivo coordinadir src\patterns las llamadas a otros microservicios
// usando el Circuit Breaker para proteger el sistema.
// El controlador llama a este service, no a axios directamente.


const axios = require('axios');
const CircuitBreaker = require('../patterns/circuitBreaker');

// Creamos UN breaker por cada servicio externo que consultamos
// Si kpi-service falla 3 veces, su circuito se abre
// Si gestion-service falla 3 veces, su circuito se abre
// Son independientes — uno no afecta al otro
const kpiBreaker = new CircuitBreaker({
    nombre: 'KPI-Service',
    limite: 3,
    tiempoEspera: 10000   // 10 segundos
});

const gestionBreaker = new CircuitBreaker({
    nombre: 'Gestion-Service',
    limite: 3,
    tiempoEspera: 15000   // 15 segundos
});


class InformeService {

    // ── Genera el informe completo del dashboard ───────────────────
    async generarDashboard(usuarioId) {

        // Llamamos a ambos servicios en paralelo con Promise.all
        // Si uno falla, el otro sigue funcionando gracias al try/catch
        const [kpiData, gestionData] = await Promise.all([
            this._obtenerKPIs(),
            this._obtenerDatosGestion()
        ]);

        return {
            titulo: 'Dashboard Ejecutivo — Grupo Cordillera',
            generadoPor: usuarioId,
            generadoEn: new Date().toISOString(),
            estadoCircuitos: this.obtenerEstadoCircuitos(),
            kpis: kpiData,
            gestion: gestionData
        };
    }


    // ── Llama a kpi-service protegido por Circuit Breaker ─────────
    async _obtenerKPIs() {
        try {
            // La función que pasamos es la llamada HTTP real
            // Si falla 3 veces, el breaker la bloquea automáticamente
            return await kpiBreaker.ejecutar(async () => {
                const respuesta = await axios.get(
                    `${process.env.KPI_SERVICE_URL}/api/kpis/summary`,
                    { timeout: 3000 }   // espera máximo 3 segundos
                );
                return respuesta.data;
            });

        } catch (err) {
            // Si el circuito está abierto o el servicio falló
            // devolvemos datos de respaldo en vez de caer
            console.warn('KPI Service no disponible, usando fallback');
            return {
                fallback: true,
                mensaje: 'KPIs temporalmente no disponibles',
                datos: null
            };
        }
    }


    // ── Llama a gestion-service protegido por Circuit Breaker ─────
    async _obtenerDatosGestion() {
        try {
            return await gestionBreaker.ejecutar(async () => {
                const respuesta = await axios.get(
                    `${process.env.GESTION_SERVICE_URL}/api/gestion/resumen`,
                    { timeout: 3000 }
                );
                return respuesta.data;
            });

        } catch (err) {
            console.warn('Gestion Service no disponible, usando fallback');
            return {
                fallback: true,
                mensaje: 'Datos de gestión temporalmente no disponibles',
                datos: null
            };
        }
    }


    // ── Estado de los circuitos para monitoreo ────────────────────
    obtenerEstadoCircuitos() {
        return {
            kpiBreaker: kpiBreaker.obtenerEstado(),
            gestionBreaker: gestionBreaker.obtenerEstado()
        };
    }
}

// Exportamos una sola instancia — Singleton implícito
module.exports = new InformeService();