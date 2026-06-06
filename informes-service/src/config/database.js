// informes-service/src/config/database.js
// Conexión a MySQL para el servicio de informes

const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});

pool.getConnection((err, conexion) => {
  if (err) {
    console.error('Error de conexión Informes:', err);
    return;
  }
  console.log('Informes service conectado a MySQL (pool)');
  conexion.release();
});

module.exports = pool;