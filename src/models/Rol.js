import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Rol = sequelize.define('Rol', {
  rolId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false
});

export default Rol;
