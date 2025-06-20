import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Rol from './Rol.js';

const Usuario = sequelize.define('Usuario', {
  usuarioId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  contrasenia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  tokenConfirmacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'rolId'
    }
  }
}, {
  tableName: 'usuarios'
});

export default Usuario;
