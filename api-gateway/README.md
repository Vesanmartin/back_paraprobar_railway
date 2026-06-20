# API Gateway

Punto de entrada único del sistema Grupo Cordillera. Recibe todas las peticiones del frontend, valida el token JWT, verifica los roles de acceso, y redirige cada petición al microservicio correspondiente. Ningún microservicio interno queda expuesto directamente al usuario.

## Tecnologías

- Node.js + Express
- http-proxy-middleware (enrutamiento hacia los microservicios)
- jsonwebtoken (validación de JWT)
- express-rate-limit (protección contra fuerza bruta)
- Jest (pruebas unitarias)
- Docker

## Responsabilidades

- **Autenticación**: valida el token JWT en cada petición protegida
- **Autorización (RBAC)**: verifica que el usuario tenga el rol necesario para acceder a cada ruta
- **Rate limiting**: limita la cantidad de peticiones por IP para evitar abusos y ataques de fuerza bruta
- **Enrutamiento**: redirige cada petición al microservicio correspondiente según la ruta solicitada

## Rutas y microservicios destino

| Ruta | Microservicio destino | Roles permitidos |
|------|------------------------|-------------------|
| /api/auth/* | auth-service (3001) | Público |
| /api/kpis/* | kpi-service (3002) | gerente, supersaiyajin |
| /api/gestion/* | gestion-service (3006) | admin, operador, supersaiyajin |
| /api/informes/* | informes-service (3004) | gerente, supersaiyajin |
| /api/importacion/* | importacion-service (3003) | operador, supersaiyajin |
| /health | — | Público (estado del gateway) |

## Instalación

```bash
cd api-gateway
npm install
```

## Ejecución

### Con Docker (recomendado)

Desde la carpeta raíz del proyecto (`grupocordillera_nuevo`):

```bash
docker compose up -d --build api-gateway
```

El servicio queda disponible en: `http://localhost:3000`

### De forma local (sin Docker)

```bash
cd api-gateway
npm start
```

Para verificar que está funcionando, se puede consultar:

```
http://localhost:3000/health
```

## Variables de entorno

```
PORT=3000
JWT_SECRET=<clave secreta para validar tokens>
AUTH_SERVICE_URL=http://auth-service:3001
KPI_SERVICE_URL=http://kpi-service:3002
GESTION_SERVICE_URL=http://gestion-service:3006
INFORMES_SERVICE_URL=http://informes-service:3004
IMPORTACION_SERVICE_URL=http://importacion-service:3003
```

## Pruebas unitarias

Las pruebas están escritas con Jest y usan mocks para simular tokens JWT, sin necesidad de un servidor real.

### Ejecutar las pruebas

```bash
cd api-gateway
npm test
```

Esto corre los tests y genera el reporte de cobertura automáticamente (el script `test` ya incluye `--coverage`).

El reporte detallado en HTML queda disponible en `coverage/lcov-report/index.html`, y se puede abrir en cualquier navegador.

### Resultado actual

- **8 pruebas**, todas pasando
- **100% de cobertura** en statements, branches, funciones y líneas

Se probaron los middlewares principales:
- `verificarToken`: rechaza peticiones sin token, con formato inválido, o con token expirado; permite el paso si el token es válido
- `verificarRol`: permite o bloquea el acceso según el rol del usuario (RBAC)
- `limitadorGeneral` y `limitadorLogin`: confirma que estén correctamente configurados como middlewares de Express
