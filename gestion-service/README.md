# Gestion Service

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

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/sucursales | Obtiene todas las sucursales |
| POST | /api/gestion/gestion | Crea una nueva sucursal |
| DELETE | /api/gestion/gestion/:id | Elimina una sucursal |
| GET | /api/productos | Obtiene todos los productos |
| GET | /api/empleados | Obtiene todos los empleados |
| GET | /api/terceros | Obtiene proveedores y clientes |

## Documentación Swagger
