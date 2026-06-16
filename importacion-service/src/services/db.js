// importacion-service/src/services/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const conexion = mysql.createPool({
  host:               process.env.DB_HOST,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  charset:            'utf8mb4',
  timezone:           '+00:00',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});

conexion.getConnection((err, conn) => {
  if (err) {
    console.error('Error de conexión Importacion:', err);
    return;
  }
  console.log('Importacion service conectado a MySQL');
  conn.release();
});

module.exports = conexion;