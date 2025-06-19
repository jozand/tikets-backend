import { v4 as uuidv4 } from 'uuid';
import { enviarCorreoConfirmacion } from '../services/email.service.js';
import Usuario from '../models/Usuario.js';
import Rol from '../models/Rol.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export const register = async (req, res) => {
    const { nombre, correo, contrasenia } = req.body;

    try {
    console.log('➡️ Datos recibidos:', { nombre, correo });

    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) return res.status(400).json({ message: 'Correo ya registrado' });

    const hash = await bcrypt.hash(contrasenia, 10);
    const token = uuidv4();

    console.log('🧾 Token generado:', token);

    const nuevo = await Usuario.create({
      nombre,
      correo,
      contrasenia: hash,
      verificado: false,
      tokenConfirmacion: token,
      rolId: 2 // Asignar rol por defecto (1 = Usuario)
    });

    console.log('👤 Usuario creado:', nuevo.correo);

    await enviarCorreoConfirmacion(correo, token);

    console.log('📤 Correo enviado a:', correo);

    res.json({ message: 'Usuario registrado. Revisa tu correo para confirmar tu cuenta.' });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(500).json({ message: 'Error en registro', error: err.message });
  }
};


export const confirmarCuenta = async (req, res) => {
  console.log('🔗 Confirmando cuenta con token:', req.params.token);
  const { token } = req.params;

  try {
    const usuario = await Usuario.findOne({ where: { tokenConfirmacion: token } });
    console.log('🔍 Buscando usuario con token:', token);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Token inválido o cuenta ya confirmada.' });
    }

    usuario.verificado = true;
    usuario.tokenConfirmacion = null;
    await usuario.save();

    res.json({ message: 'Cuenta confirmada con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar cuenta.' });
  }
};

export const login = async (req, res) => {
  const { correo, contrasenia } = req.body;

  try {
    console.log('🔑 Intentando login con:', correo);

    const usuario = await Usuario.findOne({
      where: { correo },
      include: { model: Rol, attributes: ['nombre'] } // Incluye el nombre del rol
    });

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ message: 'Correo o contraseña inválidos' });
    }

    const esValido = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!esValido) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ message: 'Correo o contraseña inválidos' });
    }

    const token = jwt.sign(
      {
        id: usuario.usuarioId,
        rol: usuario.Rol.nombre // 👈 Guardamos el rol en el token
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    console.log('✅ Token generado');

    res.json({
      token,
      usuario: {
        id: usuario.usuarioId,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.Rol.nombre,
        verificado: usuario.verificado
      }
    });
  } catch (err) {
    console.error('❌ Error inesperado en login:', err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};