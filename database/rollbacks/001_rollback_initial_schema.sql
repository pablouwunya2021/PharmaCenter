-- Rollback: 001_initial_schema
-- Description: Rollback for initial schema
-- Date: 2025-09-22
-- Author: PharmaCenter Team

-- ============================================
-- ROLLBACK - ELIMINAR ESQUEMA INICIAL
-- ============================================

-- ATENCIÓN: Este rollback eliminará TODOS los datos y estructura
-- Asegúrate de hacer backup antes de ejecutar

-- Eliminar triggers
DROP TRIGGER IF EXISTS update_proveedores_updated_at ON proveedores;
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
DROP TRIGGER IF EXISTS update_medicamentos_updated_at ON medicamentos;
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;

-- Eliminar función de triggers
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Eliminar índices (se eliminan automáticamente con las tablas, pero por claridad)
DROP INDEX IF EXISTS idx_compras_proveedor;
DROP INDEX IF EXISTS idx_compras_fecha;
DROP INDEX IF EXISTS idx_usuarios_email;
DROP INDEX IF EXISTS idx_usuarios_username;
DROP INDEX IF EXISTS idx_clientes_telefono;
DROP INDEX IF EXISTS idx_clientes_nombre;
DROP INDEX IF EXISTS idx_ventas_usuario;
DROP INDEX IF EXISTS idx_ventas_cliente;
DROP INDEX IF EXISTS idx_ventas_fecha;
DROP INDEX IF EXISTS idx_medicamentos_inventario;
DROP INDEX IF EXISTS idx_medicamentos_vencimiento;
DROP INDEX IF EXISTS idx_medicamentos_categoria;
DROP INDEX IF EXISTS idx_medicamentos_nombre;

-- Eliminar tablas en orden correcto (dependencias)
DROP TABLE IF EXISTS detallecompras;
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS detalleventas;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS medicamentos;
DROP TABLE IF EXISTS usuarios;

-- ============================================
-- NOTAS DE ROLLBACK
-- ============================================
-- ATENCIÓN:
-- 1. Este rollback eliminará TODOS los datos del sistema
-- 2. Asegúrate de hacer backup completo antes de ejecutar
-- 3. Después del rollback, la base de datos quedará vacía excepto por schema_migrations
-- 4. Para restaurar, deberás ejecutar las migraciones y re-poblar los datos