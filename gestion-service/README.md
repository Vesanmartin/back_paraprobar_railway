# Gestion Service

<<<<<<< HEAD
Microservicio encargado de la gestión de datos maestros de Grupo Cordillera: sucursales, productos, empleados y terceros.

## Tecnologías
- Node.js
- Express
- MySQL2
- Swagger (documentación API)
- Jest (pruebas unitarias)

## Puerto
Este servicio corre en el puerto **3006**

## Instalación

```bash
npm install
```

## Ejecución

Con Docker (recomendado):
```bash
docker compose up -d --build gestion-service
```

Local:
```bash
node app.js
```

## Endpoints disponibles
=======
Microservicio encargado de gestionar los datos organizacionales de Grupo Cordillera: sucursales, productos, empleados y terceros (proveedores y clientes).

## Tecnologías

- Node.js + Express
- MySQL (driver `mysql2`)
- Jest (pruebas unitarias)
- Swagger (swagger-jsdoc + swagger-ui-express)
- Docker

## Arquitectura

El servicio sigue una arquitectura en capas:

```
Controller → Service → Repository → MySQL
```

- **Controller**: recibe la petición HTTP y devuelve la respuesta
- **Repository**: ejecuta las consultas SQL (patrón Repository)
- Las pruebas usan **mocks** para simular la base de datos, sin necesidad de una conexión real

## Endpoints principales
>>>>>>> origin/natalie-dev

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/sucursales | Obtiene todas las sucursales |
<<<<<<< HEAD
| POST | /api/gestion/gestion | Crea una nueva sucursal |
| DELETE | /api/gestion/gestion/:id | Elimina una sucursal |
| GET | /api/productos | Obtiene todos los productos |
| GET | /api/empleados | Obtiene todos los empleados |
| GET | /api/terceros | Obtiene proveedores y clientes |

## Documentación Swagger
=======
| GET | /api/productos | Obtiene todos los productos |
| GET | /api/empleados | Obtiene todos los empleados |
| GET | /api/terceros | Obtiene proveedores y clientes |
| POST | /api/gestion/gestion | Crea una nueva sucursal |
| DELETE | /api/gestion/gestion/{id} | Elimina una sucursal por id |

## Instalación

Este servicio corre como parte del sistema completo, orquestado con Docker Compose desde la raíz del proyecto (`grupocordillera_nuevo`).

1. Cloná el repositorio principal del backend
2. Desde la raíz del proyecto, instalá las dependencias (si vas a correr el servicio de forma local, sin Docker):
   ```bash
   cd gestion-service
   npm install
   ```

## Ejecución

### Con Docker (recomendado)

Desde la carpeta raíz del proyecto (`grupocordillera_nuevo`):

```bash
docker compose up -d --build gestion-service
```

El servicio queda disponible en: `http://localhost:3006`

### De forma local (sin Docker)

```bash
cd gestion-service
npm start
```

## Variables de entorno

El servicio usa las siguientes variables (configuradas en `docker-compose.yml`):

```
PORT=3006
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=Nenas.2120
DB_NAME=grupocordillera
```

## Documentación de la API (Swagger)

Con el sistema corriendo, la documentación interactiva está disponible en:

```
http://localhost:3006/api-docs
```

Ahí se pueden ver todos los endpoints, sus parámetros, y probarlos directamente con el botón "Try it out".

## Pruebas unitarias

Las pruebas están escritas con Jest y usan mocks para simular la base de datos.

### Ejecutar las pruebas

```bash
cd gestion-service
npm test
```

### Ejecutar las pruebas con reporte de cobertura

```bash
npm test -- --coverage
```

Esto genera un resumen en la terminal y un reporte HTML detallado en la carpeta `coverage/lcov-report/index.html`, que se puede abrir en cualquier navegador.

### Resultado actual

- **9 pruebas**, todas pasando
- **100% de cobertura** en statements, branches, funciones y líneas

Se probaron los 4 repositorios del servicio:
- `SucursalRepository`: obtener todas, crear, eliminar, y caso de lista vacía
- `ProductoRepository`: obtener todos y caso de lista vacía
- `EmpleadoRepository`: obtener todos
- `TerceroRepository`: obtener todos
>>>>>>> origin/natalie-dev
