import Evento from '../models/Evento.js';
import AsientoEvento from '../models/AsientoEvento.js';
import { Op } from 'sequelize';

// Obtener todos los eventos
export const obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.findAll();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener eventos', error: error.message });
  }
};

// Obtener evento por ID
export const obtenerEventosPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    if (!evento) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener evento', error: error.message });
  }
};

// Eventos activos (fecha hoy o futura)
export const obtenerEventosActivos = async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const eventos = await Evento.findAll({
      where: {
        fecha: {
          [Op.gte]: hoy
        }
      }
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener eventos activos', error: error.message });
  }
};

// Eventos concluidos (fecha pasada)
export const obtenerEventosConcluidos = async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const eventos = await Evento.findAll({
      where: {
        fecha: {
          [Op.lt]: hoy
        }
      }
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener eventos concluidos', error: error.message });
  }
};

// Crear nuevo evento
export const crearEvento = async (req, res) => {
  try {
    const { nombre, lugar, fecha } = req.body;
    const nuevo = await Evento.create({ nombre, lugar, fecha });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear evento', error: error.message });
  }
};

// Actualizar evento
export const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    if (!evento) return res.status(404).json({ message: 'Evento no encontrado' });

    await evento.update(req.body);
    res.json({ message: 'Evento actualizado', evento });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar evento', error: error.message });
  }
};

// Eliminar evento
export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    if (!evento) return res.status(404).json({ message: 'Evento no encontrado' });

    await evento.destroy();
    res.json({ message: 'Evento eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar evento', error: error.message });
  }
};

// Cambiar visibilidad
export const cambiarVisibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    if (!evento) return res.status(404).json({ message: 'Evento no encontrado' });

    evento.visible = !evento.visible;
    await evento.save();

    res.json({ message: 'Visibilidad actualizada', visible: evento.visible });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar visibilidad', error: error.message });
  }
};

export const obtenerEventosVisibles = async (req, res) => {
  const eventos = await Evento.findAll({
    where: { visible: true },
    include: [{ model: AsientoEvento }]
  });

  const eventosConTotales = eventos.map(ev => {
    const total = ev.AsientoEventos.length;
    const disponibles = ev.AsientoEventos.filter(a => a.usuarioId === null).length;

    return {
      ...ev.toJSON(),
      totalAsientos: total,
      disponibles
    };
  });

  res.json(eventosConTotales);
};
