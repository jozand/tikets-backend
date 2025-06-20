import express from 'express';
import {
  obtenerAsientosPorEvento,
  crearAsientos,
  actualizarAsientos,
  eliminarAsiento
} from '../controllers/asientos.controller.js';

const router = express.Router();

router.get('/evento/:eventoId', obtenerAsientosPorEvento);
router.post('/', crearAsientos);
router.put('/:eventoId/:localidadId', actualizarAsientos);
router.delete('/:asientoEventoId', eliminarAsiento);

export default router;
