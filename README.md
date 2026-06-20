# Grupo Cordillera — Cómo levantar el sistema
# Grupo Cordillera — Sistema de Gestión Empresarial
## Guía de instalación y ejecución
### FullStack III — DUOC UC 2026

---

## ¿Qué es este sistema?

Plataforma empresarial desarrollada con arquitectura de microservicios. 
Incluye módulos de importación de datos, KPIs, informes, chatbot con IA (CORDI) 
y gestión de usuarios con doble autenticación (2FA).

---

## Lo que necesitas instalar (una sola vez)

| Herramienta | Link | Para qué sirve |
|---|---|---|
| Docker Desktop | https://www.docker.com/products/docker-desktop | Corre todos los microservicios |
| Node.js LTS | https://nodejs.org | Para el frontend |
| Git | https://git-scm.com/download/win | Para clonar el proyecto |
| Ollama (opcional) | https://ollama.com | Solo si quieres usar el chatbot CORDI |

> Sin Docker Desktop no funciona nada. Es lo primero que debes instalar.

> Si usas Windows con WSL 2, asegúrate de asignar mínimo 4GB de RAM a Docker.
> Crea el archivo `C:\Users\TuUsuario\.wslconfig` con este contenido:
> ```
> [wsl2]
> memory=4GB
> processors=2
> ```
> Luego ejecuta `wsl --shutdown` y reinicia Docker Desktop.

---

## Clonar los repositorios

**Backend:**
```bash
git clone -b vero21042026 https://github.com/Vesanmartin/grupocordillera_back_tercera_evaluacion.git
cd grupocordillera_back_tercera_evaluacion
```

**Frontend (en otra terminal):**
```bash
git clone https://github.com/Vesanmartin/GrupoCordillera_Front.git
cd GrupoCordillera_Front
```

---

## Levantar el sistema

### Paso 1 — Abre Docker Desktop
Espera que el ícono de la ballena quede quieto (sin animación). 
Si tienes otros proyectos Docker corriendo, deténlos primero — pueden 
generar conflictos de puertos con este proyecto.

### Paso 2 — Levanta el backend

**Primera vez (PC nuevo o después de clonar):**
```bash
docker compose down -v
docker compose up -d
```
El `-v` es importante la primera vez — hace que MySQL cargue 
la base de datos automáticamente desde el archivo `sql-init/dump.sql`.

**Las veces siguientes:**
```bash
docker compose up -d
```

**Verifica que todo quedó bien:**
```bash
docker compose ps
```
Todos los servicios deben decir `running` o `healthy`.
Si MySQL o RabbitMQ aparecen como `unhealthy`, espera 30 segundos y vuelve a revisar.

### Paso 3 — Levanta el frontend
```bash
cd GrupoCordillera_Front
npm install        # solo la primera vez
npm run dev
```
Abre el navegador en: **http://localhost:5173**

### Paso 4 — Chatbot CORDI (opcional)
```bash
ollama run llama3.2
```
La primera vez descarga aproximadamente 2GB. 
Déjalo corriendo en esa terminal mientras usas el sistema.

---

## Credenciales de acceso

| Rol | Email | Contraseña |
|---|---|---|
| Super Admin | super@grupocordillera.cl | Admin1234 |
| Admin | admin@grupocordillera.cl | (configurar) |
| Gerente | gerente@grupocordillera.cl | (configurar) |
| Operador | operador@grupocordillera.cl | (configurar) |

> El Super Admin tiene acceso a todos los módulos del sistema.

---

## Puertos del sistema

| Servicio | Puerto | Descripción |
|---|---|---|
| Frontend | 5173 | Interfaz de usuario (Vite + React) |
| api-gateway | 3000 | Punto de entrada de todas las peticiones |
| auth-service | 3001 | Autenticación y 2FA |
| kpi-service | 3002 | Indicadores de rendimiento |
| importacion-service | 3003 | Importación de datos ERP/CRM/POS |
| informes-service | 3004 | Informes, chatbot CORDI y analytics |
| bff | 3005 | Backend for Frontend |
| gestion-service | 3006 | Gestión organizacional |
| RabbitMQ panel | 15672 | Panel de mensajería (admin / admin123) |

> Si el puerto 3000 ya está ocupado por otro proyecto, el sistema no va a funcionar.
> Verifica con: `netstat -ano | findstr :3000`

---

## Correr pruebas unitarias

Las pruebas no necesitan Docker — se corren directo con Node.

**kpi-service (23 pruebas):**
```bash
cd kpi-service
npm test
```

**informes-service (14 pruebas):**
```bash
cd informes-service
npm test
```

**Con reporte de cobertura:**
```bash
npx jest --coverage
```

---

## Bajar el sistema

**Bajar sin borrar datos:**
```bash
docker compose down
```

**Bajar borrando la base de datos (usar solo si quieres empezar de cero):**
```bash
docker compose down -v
```

---

## Algo no funciona?

**Problema: no puedo entrar con las credenciales**
- Verifica que MySQL esté `healthy` con `docker compose ps`
- Si es la primera vez, asegúrate de haber usado `docker compose down -v` antes del `up`

**Problema: el puerto 3000 está ocupado**
- Detén otros proyectos Docker que estén corriendo
- Verifica con `netstat -ano | findstr :3000`

**Problema: MySQL o RabbitMQ no levantan**
- Verifica que Docker Desktop tenga mínimo 4GB de RAM asignados
- En WSL 2, configura el archivo `.wslconfig` (ver sección de instalación)

**Comandos útiles para diagnosticar:**
```bash
docker compose ps                          # estado de todos los servicios
docker compose logs nombre-del-servicio    # logs de un servicio específico
docker compose restart nombre-del-servicio # reiniciar un servicio
```

---

## Estructura del proyecto

## Estructura del proyecto

```
grupocordillera_back_tercera_evaluacion/
├── api-gateway/
│   └── src/
│       ├── middleware/
│       │   ├── auth.js
│       │   └── rateLimit.js
│       └── routes/
├── auth-service/
│   └── src/
│       ├── controllers/
│       │   └── auth.controller.js
│       ├── middlewares/
│       │   └── auth.middleware.js
│       ├── models/
│       │   └── user.model.js
│       ├── routes/
│       │   └── auth.routes.js
│       ├── services/
│       │   └── auth.service.js
│       └── strategies/
│           └── rolStrategy.js
├── bff/
│   └── src/
│       └── routes/
├── gestion-service/
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   └── gestionController.js
│       ├── middlewares/
│       │   ├── error.middleware.js
│       │   └── validation.middleware.js
│       ├── repositories/
│       │   └── gestionRepository.js
│       └── routes/
│           └── gestionRoutes.js
├── importacion-service/
│   └── src/
│       ├── procesadores/          ← Patrón Factory Method
│       │   ├── procesadorBase.js
│       │   ├── procesadorFactory.js
│       │   ├── procesadorERP.js
│       │   ├── procesadorCRM.js
│       │   ├── procesadorPOS.js
│       │   ├── procesadorRRHH.js
│       │   └── procesadorAnalytics.js
│       ├── repositories/
│       │   └── importacionRepository.js
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       └── uploads/
├── kpi-service/
│   └── src/
│       ├── config/
│       ├── controllers/
│       │   └── kpiController.js
│       ├── patterns/              ← Patrón Factory Method
│       │   └── kpiFactory.js
│       ├── routes/
│       │   └── kpiRoutes.js
│       └── test/                  ← Pruebas unitarias Jest (23 pruebas)
│           └── kpiFactory.test.js
├── informes-service/
│   └── src/
│       ├── config/
│       ├── controllers/
│       │   ├── chatbotController.js
│       │   └── informeController.js
│       ├── events/
│       │   └── publicador.js
│       ├── models/
│       │   └── informeModel.js
│       ├── patterns/              ← Patrón Circuit Breaker
│       │   └── circuitBreaker.js
│       ├── repositories/
│       │   └── informeRepositories.js
│       ├── routes/
│       │   ├── chatbotRoutes.js
│       │   └── informeRoutes.js
│       ├── services/
│       │   ├── chatbotService.js
│       │   ├── contextoService.js
│       │   └── informeService.js
│       └── test/                  ← Pruebas unitarias Jest (14 pruebas)
│           └── circuitBreaker.test.js
├── sql-init/                      ← Dump de la base de datos (carga automática)
│   └── dump.sql
└── docker-compose.yml
```


*Desarrollado por Cocq — Gallegos — San Martín — Vásquez | DUOC UC 2026*
