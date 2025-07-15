const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {

  //  REGISTRO DE USUARIO
  register: async (req, res) => {
    try {
      const { nombre, correo, contraseña, rol } = req.body;

      // Validaciones mínimas
      if (!nombre || !correo || !contraseña || !rol) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
      }

      // Verificar si el correo ya está en uso
      const existe = await pool.query(
        'SELECT * FROM usuarios WHERE correo = $1',
        [correo]
      );
      if (existe.rowCount > 0) {
        return res.status(400).json({ msg: 'El correo ya está en uso.' });
      }

      // Encriptar contraseña con bcrypt
      const saltRounds = 10;
      const hash = await bcrypt.hash(contraseña, saltRounds);

      // Insertar usuario
      const query = `
        INSERT INTO usuarios (nombre, correo, contraseña, rol)
        VALUES ($1, $2, $3, $4)
        RETURNING id_usuario, nombre, correo, rol;
      `;
      const values = [nombre, correo, hash, rol];

      const result = await pool.query(query, values);
      const newUser = result.rows[0];

      return res.status(201).json({
        msg: 'Usuario registrado correctamente.',
        user: newUser
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Error al registrar el usuario.' });
    }
  },

  // (2) LOGIN DE USUARIO
  login: async (req, res) => {
    try {
      const { correo, contraseña } = req.body;

      if (!correo || !contraseña) {
        return res.status(400).json({ msg: 'Correo y contraseña son requeridos.' });
      }

      // Buscar usuario en la base de datos
      const result = await pool.query(
        'SELECT * FROM usuarios WHERE correo = $1',
        [correo]
      );

      if (result.rowCount === 0) {
        return res.status(401).json({ msg: 'Credenciales inválidas.' });
      }

      const usuario = result.rows[0];

      // Validar contraseña con bcrypt
      const match = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!match) {
        return res.status(401).json({ msg: 'Credenciales inválidas.' });
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          idUsuario: usuario.id_usuario,
          rol: usuario.rol
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        msg: 'Login exitoso.',
        token,
        rol: usuario.rol
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Error al iniciar sesión.' });
    }
  },

  // (3) EJEMPLO: OBTENER TODOS LOS USUARIOS (Sólo para rol "doctora", por ejemplo)
  getAllUsers: async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id_usuario, nombre, correo, rol FROM usuarios'
      );
      return res.json(result.rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Error al obtener usuarios.' });
    }
  },
};

module.exports = userController;
