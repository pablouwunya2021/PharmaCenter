require('dotenv').config();
const express = require('express');
//const app = express();
const db = require('./models/db');
const cors = require('cors');
const { transporter, sendLowStockAlert } = require('./utils/email');
const { scheduleInventoryChecks } = require('./utils/monitor');
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//=======================MIDDLEWARES====================================
// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

scheduleInventoryChecks();

// Middleware para verificar el token JWT

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Token requerido" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = user;
    next();
  });
}

// Middleware para verificar el rol 

function verifyRole(requiredRole) {
  return (req, res, next) => {
    if (req.user.rol !== requiredRole) {
      return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta" });
    }
    next();
  };
}



//=======================RUTAS====================================

//================== Medicamentos =========================

// GET: Todos los medicamentos
app.get('/api/medicamentos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Medicamento');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Medicamento por ID
app.get('/api/medicamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM Medicamento WHERE idMedicamento = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medicamento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Crear nuevo medicamento
app.post('/api/medicamentos', async (req, res) => {
  const {
    nombre,
    cantidadInventario,
    fechaVencimiento,
    precio,
    costo,
    proveedor,
    imagenUrl
  } = req.body;

  // Validaciones
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  if (cantidadInventario == null || isNaN(cantidadInventario)) {
    return res.status(400).json({ error: 'La cantidad en inventario debe ser un número válido' });
  }
  if (!fechaVencimiento) {
    return res.status(400).json({ error: 'La fecha de vencimiento es obligatoria' });
  }
  if (precio == null || isNaN(precio) || precio < 0) {
    return res.status(400).json({ error: 'El precio debe ser un número válido y no negativo' });
  }
  if (costo == null || isNaN(costo) || costo < 0) {
    return res.status(400).json({ error: 'El costo debe ser un número válido y no negativo' });
  }
  if (!proveedor || proveedor.trim() === '') {
    return res.status(400).json({ error: 'El proveedor es obligatorio' });
  }
  if (!imagenUrl || imagenUrl.trim() === '') {
    return res.status(400).json({ error: 'La URL de la imagen es obligatoria' });
  }

  try {
    const result = await db.query(
      `INSERT INTO Medicamento
        (nombre, cantidadInventario, fechaVencimiento, precio, costo, proveedor, imagenUrl)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        nombre.trim(),
        Number(cantidadInventario),
        fechaVencimiento,
        Number(precio),
        Number(costo),
        proveedor.trim(),
        imagenUrl.trim()
      ]
    );

    res.status(201).json({
      message: 'Medicamento registrado correctamente',
      medicamento: result.rows[0]
    });
  } catch (err) {
    console.error('Error al registrar medicamento:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un medicamento con estos datos' });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// PUT: Actualizar medicamento
app.put('/api/medicamentos/:id', async (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  if (!id || Object.keys(campos).length === 0) {
    return res.status(400).json({ error: 'ID y campos para actualizar son requeridos' });
  }

  const columnas = Object.keys(campos);
  const valores = Object.values(campos);
  const setQuery = columnas.map((col, i) => `${col} = $${i + 1}`).join(', ');

  try {
    const result = await db.query(
      `UPDATE Medicamento SET ${setQuery} WHERE idMedicamento = $${columnas.length + 1}`,
      [...valores, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Medicamento no encontrado' });
    }
    res.json({ message: 'Medicamento actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar medicamento:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Eliminar medicamento
app.delete('/api/medicamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      'DELETE FROM Venta_Medicamento WHERE idMedicamento = $1',
      [id]
    );

    const result = await db.query(
      'DELETE FROM Medicamento WHERE idMedicamento = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Medicamento no encontrado' });
    }

    res.json({ message: 'Medicamento y registros relacionados eliminados exitosamente' });
  } catch (err) {
    console.error('Error al eliminar medicamento:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

//================== Usuarios =========================

// Rutas básicas
app.get('/api/usuarios', verifyToken, async (req, res) => { 
  try {
    const result = await db.query('SELECT idUsuario, nombre, correo FROM Usuario');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  // GET: Obtener un usuario por ID
app.get('/api/usuarios/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    // 🔹 Solo el propio usuario o un admin puede acceder
    if (req.user.rol !== 'admin' && req.user.idUsuario !== parseInt(id)) {
        return res.status(403).json({ error: 'No tienes permiso para ver este usuario' });
    }

    try {
      const result = await db.query('SELECT idUsuario, nombre, correo, rol FROM Usuario WHERE idUsuario = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


// POST: Crear un nuevo usuario
app.post('/api/usuarios', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  try {
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await db.query(
      'INSERT INTO Usuario (nombre, correo, contrasena) VALUES ($1, $2, $3)',
      [nombre, correo, hashedPassword]
    );
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Crear contraseñas
app.put('/api/usuarios/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nombre, contrasena } = req.body;

    // Solo el propio usuario o un admin puede cambiar la contraseña
    if (req.user.rol !== 'admin' && req.user.idUsuario !== parseInt(id)) {
        return res.status(403).json({ error: 'No tienes permiso para modificar este usuario' });
    }

    try {
        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const result = await db.query(
            'UPDATE Usuario SET contrasena = $1, nombre = $2 WHERE idUsuario = $3',
            [hashedPassword, nombre, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//=================== Login =========================

// Login con jwt 
app.post('/api/login', async (req, res) => {
  console.log('Petición login recibida');           // <-- Log para indicar que entró la petición
  console.log('Datos recibidos:', req.body);        // <-- Log para mostrar qué datos recibiste
  
 const { correo, email, contrasena, password } = req.body;

// Normalizamos
const userEmail = correo || email;
const userPass = contrasena || password;

try {
  const result = await db.query(
    'SELECT * FROM Usuario WHERE correo = $1',
    [userEmail]
  );

  console.log('Usuario encontrado:', result.rows[0]);

  if (result.rows.length === 0) {
    return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(userPass, user.contrasena);
  console.log('¿Contraseña válida?', match);

  if (!match) {
    return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
  }

  const token = jwt.sign(
    { idUsuario: user.idusuario, correo: user.correo, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ success: true, token });
} catch (err) {
  console.error('Error en login:', err);
  res.status(500).json({ error: err.message });
}
});
//========================Singup===================
app.post('/api/signup', async (req, res) => {
  console.log('Petición de registro recibida:', req.body);

  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el correo ya existe
    const existing = await db.query('SELECT * FROM Usuario WHERE correo = $1', [correo]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar usuario
    const result = await db.query(
      'INSERT INTO Usuario (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING idUsuario, nombre, correo, rol',
      [nombre, correo, hashedPassword, 'user']
    );

    const newUser = result.rows[0];

    // Crear token
    const token = jwt.sign(
      { idUsuario: newUser.idusuario, correo: newUser.correo, rol: newUser.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Health Check
app.get('/ping', (req, res) => res.send('pong'));
module.exports = app;