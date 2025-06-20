import express from 'express';
import {
  obtenerAsientosPorEvento,
  crearAsientos,
  actualizarAsientos,
  eliminarAsiento,
  comprarAsiento,
  comprarMultiplesAsientos,
  obtenerTiketsPorUsuario
} from '../controllers/asientos.controller.js';

const router = express.Router();

router.get('/evento/:eventoId', obtenerAsientosPorEvento);
router.post('/', crearAsientos);
router.put('/:eventoId/:localidadId', actualizarAsientos);
router.delete('/:asientoEventoId', eliminarAsiento);
router.post('/comprar', comprarAsiento);
router.post('/comprar-multiples', comprarMultiplesAsientos);
router.get('/usuario/:usuarioId', obtenerTiketsPorUsuario);

export default router;
