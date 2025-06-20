import express from 'express';
import {
  obtenerAsientosPorEvento,
  crearAsientos,
  actualizarAsientos,
  eliminarAsiento,
  comprarAsiento
} from '../controllers/asientos.controller.js';

const router = express.Router();

router.get('/evento/:eventoId', obtenerAsientosPorEvento);
router.post('/', crearAsientos);
router.put('/:eventoId/:localidadId', actualizarAsientos);
router.delete('/:asientoEventoId', eliminarAsiento);
router.post('/asientos-evento/comprar', comprarAsiento);

export default router;
