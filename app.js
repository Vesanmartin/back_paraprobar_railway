const { execSync, spawn } = require('child_process');
const path = require('path');

const servicios = [
  { nombre: 'auth-service',       puerto: 3001 },
  { nombre: 'kpi-service',        puerto: 3002 },
  { nombre: 'importacion-service',puerto: 3005 },
  { nombre: 'informes-service',   puerto: 3004 },
  { nombre: 'gestion-service',    puerto: 3003 },
  { nombre: 'bff',                puerto: 3006 },
  { nombre: 'api-gateway',        puerto: null }
];

servicios.forEach(({ nombre }) => {
  console.log(`Instalando dependencias de ${nombre}...`);
  try {
    execSync('npm install', {
      cwd: path.join(__dirname, nombre),
      stdio: 'inherit'
    });
  } catch (err) {
    console.error(`Error instalando ${nombre}:`, err.message);
  }
});

servicios.forEach(({ nombre, puerto }) => {
  console.log(`Iniciando ${nombre}...`);
  const env = { ...process.env };
  if (puerto) env.PORT = String(puerto);

  const proc = spawn('npm', ['start'], {
    cwd: path.join(__dirname, nombre),
    stdio: 'inherit',
    shell: true,
    env
  });

  proc.on('error', (err) => {
    console.error(`Error en ${nombre}:`, err.message);
  });
});

console.log('Todos los servicios iniciados.');
