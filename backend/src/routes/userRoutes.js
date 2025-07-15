const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Registro de usuario
router.post('/registro', userController.register);

// Login de usuario
router.post('/login', userController.login);

// Obtener usuarios (sólo permitido para 'doctora', por ejemplo)
router.get('/all', authMiddleware(['doctora']), userController.getAllUsers);

module.exports = router;
