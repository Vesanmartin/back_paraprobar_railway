// auth-service/src/db.js
import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();

// Pool en vez de conexión única — maneja reconexiones automáticamente (por tema dockers)
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
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a MySQL (pool)');
  conexion.release(); // liberamos la conexión de prueba
});

export default pool;