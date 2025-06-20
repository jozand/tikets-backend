import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const AsientoEvento = sequelize.define('AsientoEvento', {
  asientoEventoId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eventoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  localidadId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios', // nombre de tabla real en MySQL
      key: 'usuarioId'
    }
  }
}, {
  tableName: 'asientos_evento',
  timestamps: true
});

export default AsientoEvento;
