import express from 'express';
import {
  obtenerEventos,
  obtenerEventosPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  cambiarVisibilidad,
  obtenerEventosActivos,
  obtenerEventosConcluidos,
  obtenerEventosVisibles
} from '../controllers/evento.controller.js';

const router = express.Router();

router.get('/visibles', obtenerEventosVisibles);
router.get('/activos', obtenerEventosActivos);
router.get('/concluidos', obtenerEventosConcluidos);
router.get('/', obtenerEventos);
router.get('/:id', obtenerEventosPorId);

router.post('/', crearEvento);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);
router.patch('/visibilidad/:id', cambiarVisibilidad);



export default router;
