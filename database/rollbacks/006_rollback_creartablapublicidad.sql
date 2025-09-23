-- Rollback: 006_crear_tabla_publicidad
-- Description: Rollback for crear tabla publicidad
-- Date: 2025-09-23
-- Author: PharmaCenter Team

-- ============================================
-- ROLLBACK - ELIMINAR TABLA PUBLICIDAD
-- ============================================

-- ATENCIÓN: Este rollback eliminará TODOS los datos de publicidad
-- Asegúrate de hacer backup antes de ejecutar

-- Eliminar función auxiliar
DROP FUNCTION IF EXISTS obtener_publicidad_vigente(VARCHAR);

-- Eliminar trigger
DROP TRIGGER IF EXISTS update_publicidad_updated_at ON publicidad;

-- Eliminar índices (se eliminan automáticamente con la tabla, pero por claridad)
DROP INDEX IF EXISTS idx_publicidad_titulo;
DROP INDEX IF EXISTS idx_publicidad_codigo;
DROP INDEX IF EXISTS idx_publicidad_posicion;
DROP INDEX IF EXISTS idx_publicidad_fechas;
DROP INDEX IF EXISTS idx_publicidad_activo;
DROP INDEX IF EXISTS idx_publicidad_tipo;

-- Eliminar tabla de publicidad
DROP TABLE IF EXISTS publicidad;

-- ============================================
-- NOTAS DE ROLLBACK
-- ============================================
-- ATENCIÓN:
-- 1. Este rollback eliminará TODOS los datos de publicidad
-- 2. Asegúrate de hacer backup antes de ejecutar
-- 3. Verificar que no hay dependencias en otras tablas
-- 4. Testear el rollback en entorno de desarrollo
-- 5. Después del rollback, se perderán todas las promociones y anuncios

-- Remover registro de migración (esto se hace automáticamente por el script)