import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);

import eventoRoutes from './routes/evento.routes.js';
app.use('/api/eventos', eventoRoutes);

export default app;
