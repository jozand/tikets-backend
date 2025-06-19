import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { initSocketEvents } from './src/sockets/index.js';

// Conexión Sequelize y modelo
import sequelize from './src/config/db.config.js';
import Usuario from './src/models/Usuario.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true }
});

initSocketEvents(io);

// Conexión y sincronización con la base de datos
try {
  await sequelize.authenticate();
  console.log('✅ Conexión a la base de datos exitosa');

  await sequelize.sync(); // sync({ force: true }) para reiniciar
  console.log('✅ Modelos sincronizados');
} catch (error) {
  console.error('❌ Error al conectar a la base de datos:', error);
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
