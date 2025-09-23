-- Rollback: 002_agregarindiceemailusuarios
-- Description: Rollback for agregarindiceemailusuarios
-- Date: 2025-09-23
-- Author: PharmaCenter Team

-- ============================================
-- ROLLBACK (REVERTIR CAMBIOS)
-- ============================================

-- Revertir los cambios de la migración 002
-- IMPORTANTE: Escribir estos comandos en orden INVERSO a la migración

-- Ejemplo (inverso de la migración):
-- DROP INDEX IF EXISTS idx_nueva_tabla_nombre;
-- ALTER TABLE tabla_existente DROP COLUMN IF EXISTS nueva_columna;
-- DROP TABLE IF EXISTS nueva_tabla;

-- ============================================
-- NOTAS DE ROLLBACK
-- ============================================
-- ATENCIÓN:
-- 1. Este rollback puede causar pérdida de datos
-- 2. Asegúrate de hacer backup antes de ejecutar
-- 3. Verificar dependencias antes de eliminar objetos
-- 4. Testear el rollback en entorno de desarrollo

-- Remover registro de migración (esto se hace automáticamente por el script)