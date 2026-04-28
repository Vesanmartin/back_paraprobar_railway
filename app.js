const express = require('express');

const app = express();

app.use(express.json());

const gestionRoutes = require('./src/routes/gestionRoutes');

app.use('/api', gestionRoutes);

app.get('/', (req, res) => {
    res.send('Gestion Service funcionando');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});