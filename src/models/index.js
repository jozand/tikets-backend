import Evento from './Evento.js';
import AsientoEvento from './AsientoEvento.js';
import Localidad from './Localidad.js';
import Usuario from './Usuario.js';
import Rol from './Rol.js';

Evento.hasMany(AsientoEvento, { foreignKey: 'eventoId' });
AsientoEvento.belongsTo(Evento, { foreignKey: 'eventoId' });

Localidad.hasMany(AsientoEvento, { foreignKey: 'localidadId' });
AsientoEvento.belongsTo(Localidad, { foreignKey: 'localidadId' });

Usuario.hasMany(AsientoEvento, { foreignKey: 'usuarioId' });
AsientoEvento.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.belongsTo(Rol, { foreignKey: 'rolId' });
Rol.hasMany(Usuario, { foreignKey: 'rolId' });

export { Evento, AsientoEvento, Localidad, Usuario };
