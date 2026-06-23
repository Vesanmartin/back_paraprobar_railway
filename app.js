const { execSync, spawn } = require('child_process');
const path = require('path');

const servicios = [
  'auth-service',
  'kpi-service',
  'importacion-service',
  'informes-service',
  'gestion-service',
  'bff',
  'api-gateway'
];

servicios.forEach(servicio => {
  console.log(`Instalando dependencias de ${servicio}...`);
  try {
    execSync('npm install', {
      cwd: path.join(__dirname, servicio),
      stdio: 'inherit'
    });
  } catch (err) {
    console.error(`Error instalando ${servicio}:`, err.message);
  }
});

servicios.forEach(servicio => {
  console.log(`Iniciando ${servicio}...`);
  const proc = spawn('npm', ['start'], {
    cwd: path.join(__dirname, servicio),
    stdio: 'inherit',
    shell: true
  });

  proc.on('error', (err) => {
    console.error(`Error en ${servicio}:`, err.message);
  });
});

console.log('Todos los servicios iniciados.');
