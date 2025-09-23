-- Agregar campo rol a la tabla Usuario
ALTER TABLE Usuario ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'user';

-- Actualizar usuarios existentes para que tengan rol 'user'
UPDATE Usuario SET rol = 'user' WHERE rol IS NULL;

-- Hacer el campo rol NOT NULL
ALTER TABLE Usuario ALTER COLUMN rol SET NOT NULL;

-- Crear un usuario admin por defecto (contraseña: admin123)
INSERT INTO Usuario (nombre, correo, contrasena, rol) 
VALUES ('Administrador', 'admin@pharmacenter.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (correo) DO NOTHING;