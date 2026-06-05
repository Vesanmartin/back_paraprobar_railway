# Grupo Cordillera — Cómo levantar el sistema

> Lee esto antes de preguntar por qué no funciona 😄

---

## Lo que necesitas instalar en tu PC (una sola vez)

- **Docker Desktop** → https://www.docker.com/products/docker-desktop
- **Node.js** (versión LTS) → https://nodejs.org
- **Ollama** *(opcional, solo si quieres el chatbot CORDI)* → https://ollama.com

> OJOOO: Sin Docker Desktop no funciona **nada**. Es lo primero.
---
## Clonar el proyecto

```bash
git clone -b vero21042026 https://github.com/Vesanmartin/grupocordillera_back_tercera_evaluacion.git
cd grupocordillera_back_tercera_evaluacion
```
## Levantar el sistema

### 1. Abre Docker Desktop
Espera que el ícono de la ballena quede quieto (sin animación).

### 2. Levanta el backend
```bash
docker compose up -d --build
```
Para verificar que todo quedó bien:
```bash
docker compose ps
```
Todos deben decir `running` o `healthy`.

### 3. Levanta el frontend
```bash
cd ../grupocordillera_frontend
npm install        # solo la primera vez
npm run dev
```
Abre el navegador en: **http://localhost:5173**

### 4. Chatbot CORDI (opcional)
```bash
ollama run llama3.2
```
> Primera vez descarga ~2GB. Déjalo corriendo en esa terminal.

---
## Credenciales

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Super Admin | super@grupocordillera.cl | Admin1234 |

---
## Puertos

| Servicio | Puerto |
|----------|--------|
| api-gateway | 3000 |
| auth-service | 3001 |
| kpi-service | 3002 |
| importacion-service | 3003 |
| informes-service | 3004 |
| bff | 3005 |
| gestion-service | 3006 |
| RabbitMQ panel | 15672 (admin / admin123) |

---
## Para bajar todo
```bash
docker compose down
```
> **Nunca uses** `docker compose down -v` — borra la base de datos.

---

## Algo no funciona?

1. Verifica que Docker Desktop esté abierto
2. `docker compose ps` → revisa qué contenedor está caído
3. `docker compose logs nombre-del-servicio` → revisa el error
4. FIN
