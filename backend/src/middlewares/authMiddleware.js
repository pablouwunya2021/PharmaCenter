const jwt = require('jsonwebtoken');

const authMiddleware = (rolesPermitidos = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ msg: 'No hay token en la petición.' });
      }
      const token = authHeader.split(' ')[1];

      // Verificar token
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // { idUsuario, rol, iat, exp }

      // Verificar rol si se definieron roles permitidos
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ msg: 'No tienes permiso para acceder a esta ruta.' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Token inválido o expirado.' });
    }
  };
};

module.exports = authMiddleware;
