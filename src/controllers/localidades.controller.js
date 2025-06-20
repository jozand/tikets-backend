import { Localidad } from '../models/index.js';

export const obtenerLocalidades = async (req, res) => {
  try {
    const localidades = await Localidad.findAll();
    res.json(localidades);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener localidades' });
  }
};
