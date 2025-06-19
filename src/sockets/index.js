export function initSocketEvents(io) {
  io.on('connection', (socket) => {
    console.log('🟢 Nuevo cliente conectado:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado:', socket.id);
    });

    // Aquí puedes agregar más eventos personalizados
    // socket.on('evento', (payload) => { ... });
  });
}
