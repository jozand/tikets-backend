import { AsientoEvento } from '../models/index.js';
import Evento from '../models/Evento.js';
import Localidad from '../models/Localidad.js';
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

export const comprarAsiento = async (req, res) => {
  const { asientoEventoId, usuarioId } = req.body;

  const asiento = await AsientoEvento.findByPk(asientoEventoId);
  if (!asiento || asiento.usuarioId) {
    return res.status(400).json({ mensaje: 'Asiento no disponible' });
  }

  asiento.usuarioId = usuarioId;
  await asiento.save();

  res.json({ mensaje: 'Compra exitosa', asiento });
};

export const comprarMultiplesAsientos = async (req, res) => {
  const { asientoIds, usuarioId } = req.body;

  if (!Array.isArray(asientoIds) || asientoIds.length === 0 || !usuarioId) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  const asientos = await AsientoEvento.findAll({
    where: {
      asientoEventoId: asientoIds,
      usuarioId: null
    }
  });

  if (asientos.length !== asientoIds.length) {
    return res.status(409).json({ mensaje: 'Uno o más asientos ya no están disponibles' });
  }

  // Actualizamos cada asiento
  await AsientoEvento.update(
  { usuarioId },
    {
      where: {
        asientoEventoId: asientoIds,
        usuarioId: null
      }
    }
  );

  res.json({ mensaje: 'Compra realizada con éxito', cantidad: asientos.length });
};


export const obtenerTiketsPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Obtiene todos los asientos comprados por el usuario
    const asientos = await AsientoEvento.findAll({
      where: { usuarioId },
      include: [
        {
          model: Evento,
          as: 'Evento',
          attributes: ['eventoId', 'nombre', 'lugar', 'fecha']
        },
        {
          model: Localidad,
          as: 'Localidad',
          attributes: ['nombre']
        }
      ],
      order: [['eventoId', 'ASC']]
    });

    // Agrupa por evento
    const agrupados = {};
    for (const asiento of asientos) {
      const eventoId = asiento.Evento.eventoId;
      if (!agrupados[eventoId]) {
        agrupados[eventoId] = {
          evento: asiento.Evento,
          tikets: []
        };
      }

      agrupados[eventoId].tikets.push({
        asientoEventoId: asiento.asientoEventoId,
        localidad: asiento.Localidad?.nombre || `Localidad ${asiento.localidadId}`,
        precio: asiento.precio
      });
    }

    res.json(Object.values(agrupados));
  } catch (error) {
    console.error('Error al obtener tikets:', error);
    res.status(500).json({ mensaje: 'Error al obtener los tikets del usuario' });
  }
};