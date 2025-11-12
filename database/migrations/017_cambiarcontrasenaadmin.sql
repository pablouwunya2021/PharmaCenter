-- Migration: 017_cambiarcontrasenaadmin
-- Description: cambiarcontrasenaadmin
-- Date: 2025-11-12
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP
-- ============================================

-- Actualizar la contraseña del usuario administrador
-- Hash bcrypt: $2b$10$D.uGG2ghp/sDuL44zUl0G.3o3ljJmF6jgOadGEIlO8C3Prac1n67m
UPDATE usuario 
SET contrasena = '$2b$10$D.uGG2ghp/sDuL44zUl0G.3o3ljJmF6jgOadGEIlO8C3Prac1n67m',
    updated_at = CURRENT_TIMESTAMP
WHERE rol = 'admin' AND nombre = 'Administrador Sistema';

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
VALUES ('017', 'cambiarcontrasenaadmin', 'pendiente', '017_rollback_cambiarcontrasenaadmin.sql')
ON CONFLICT (version) DO NOTHING;