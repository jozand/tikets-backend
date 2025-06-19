import express from 'express';
import { register, confirmarCuenta, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.get('/confirmar/:token', confirmarCuenta);
router.post('/login', login);


export default router;
