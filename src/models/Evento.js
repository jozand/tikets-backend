import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Evento = sequelize.define('Evento', {
  eventoId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lugar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'eventos'
});

export default Evento;
