-- Migration: 002_agregar_rol_usuario
-- Description: agregar rol usuario
-- Date: 2025-09-23
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP
-- ============================================

-- Agregar columna rol
ALTER TABLE Usuario ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'user';

-- Hacer correo único
ALTER TABLE Usuario ADD CONSTRAINT usuario_correo_unique UNIQUE (correo);

-- Actualizar usuarios existentes
UPDATE Usuario SET rol = 'user' WHERE rol IS NULL;

-- Hacer rol NOT NULL
ALTER TABLE Usuario ALTER COLUMN rol SET NOT NULL;

-- Crear usuario admin
INSERT INTO Usuario (nombre, correo, contrasena, rol) 
VALUES ('Administrador', 'admin@pharmacenter.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (correo) DO UPDATE SET rol = 'admin';

-- Insertar registro de migración
INSERT INTO schema_migrations (version, description, checksum, rollback_file) 
VALUES ('002', 'agregar rol usuario', 'pendiente', '002_rollback_agregar_rol_usuario.sql')
ON CONFLICT (version) DO NOTHING;