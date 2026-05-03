// gestion-service/app.js
// Punto de entrada del servicio de gestión de datos

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const gestionRoutes = require('./src/routes/gestionRoutes');

// Cargamos las variables de entorno
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas del servicio de gestión
app.use('/api/gestion', gestionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Gestion service funcionando');
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`Gestion service corriendo en puerto ${PORT}`);
});