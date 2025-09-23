-- Migration: 005_creartablacategorias
-- Description: creartablacategorias
-- Date: 2025-09-23
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP
-- ============================================

-- Agregar tus cambios de esquema aquí
-- Ejemplo:
-- CREATE TABLE nueva_tabla (
--     id SERIAL PRIMARY KEY,
--     nombre VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- ALTER TABLE tabla_existente 
-- ADD COLUMN nueva_columna VARCHAR(50);

-- CREATE INDEX idx_nueva_tabla_nombre ON nueva_tabla(nombre);

-- ============================================
-- NOTAS
-- ============================================
-- Recuerda:
-- 1. Crear el archivo de rollback correspondiente
-- 2. Probar la migración en entorno de desarrollo
-- 3. Verificar que los cambios sean compatibles hacia atrás si es posible
-- 4. Documentar cualquier cambio que afecte la aplicación

-- Insertar registro de migración
INSERT INTO schema_migrations (version, description, checksum, rollback_file) 
VALUES ('005', 'creartablacategorias', 'pendiente', '005_rollback_creartablacategorias.sql')
ON CONFLICT (version) DO NOTHING;