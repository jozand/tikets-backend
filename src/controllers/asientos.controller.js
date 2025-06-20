import { AsientoEvento } from '../models/index.js';
import { Op } from 'sequelize';

// GET: Asientos por evento
export const obtenerAsientosPorEvento = async (req, res) => {
  const { eventoId } = req.params;
  try {
    const asientos = await AsientoEvento.findAll({
      where: { eventoId },
      include: ['Localidad']
    });
    res.json(asientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener asientos' });
  }
};

// POST: Crear múltiples asientos
export const crearAsientos = async (req, res) => {
  const { eventoId, localidadId, precio, cantidad } = req.body;

  try {
    const registros = Array.from({ length: cantidad }, () => ({
      eventoId,
      localidadId,
      precio,
      usuarioId: null
    }));

    const resultado = await AsientoEvento.bulkCreate(registros);
    res.status(201).json({ mensaje: 'Asientos creados', datos: resultado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear asientos' });
  }
};

// PUT: Actualizar cantidad (agrega o elimina)
export const actualizarAsientos = async (req, res) => {
  const { eventoId, localidadId } = req.params;
  const { nuevaCantidad, precio } = req.body;

  try {
    const asientos = await AsientoEvento.findAll({
      where: {
        eventoId,
        localidadId,
        usuarioId: null
      }
    });

    const actual = asientos.length;

    if (nuevaCantidad > actual) {
      // Agregar
      const cantidadAgregar = nuevaCantidad - actual;
      const nuevos = Array.from({ length: cantidadAgregar }, () => ({
        eventoId,
        localidadId,
        precio,
        usuarioId: null
      }));
      await AsientoEvento.bulkCreate(nuevos);
    } else if (nuevaCantidad < actual) {
      // Eliminar (solo los más recientes sin usuario)
      const cantidadEliminar = actual - nuevaCantidad;
      const idsAEliminar = asientos.slice(-cantidadEliminar).map(a => a.asientoEventoId);
      await AsientoEvento.destroy({
        where: { asientoEventoId: { [Op.in]: idsAEliminar } }
      });
    }

    res.json({ mensaje: 'Cantidad actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cantidad de asientos' });
  }
};

// DELETE: Eliminar un asiento específico
export const eliminarAsiento = async (req, res) => {
  const { asientoEventoId } = req.params;

  try {
    await AsientoEvento.destroy({
      where: { asientoEventoId }
    });

    res.json({ mensaje: 'Asiento eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar asiento' });
  }
};
