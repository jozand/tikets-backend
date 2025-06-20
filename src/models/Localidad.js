import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Localidad = sequelize.define('Localidad', {
  localidadId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'localidades',
  timestamps: false // si no necesitas createdAt / updatedAt
});

export default Localidad;
