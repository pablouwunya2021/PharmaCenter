-- Migration: 007_eliminar_tablas_duplicadas
-- Description: Elimina las tablas duplicadas (usuarios, medicamentos, ventas) del esquema
-- Date: 2025-10-08
-- Author: PharmaCenter Team
-- Reason: Conflicto entre init.sql (Usuario, Medicamento, Venta) y migrations (usuarios, medicamentos, ventas)

-- ============================================
-- MIGRATION UP - ELIMINAR TABLAS DUPLICADAS
-- ============================================

-- Eliminar tablas duplicadas si existen
DROP TABLE IF EXISTS detalleventas CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;
DROP TABLE IF EXISTS detallecompras CASCADE;
DROP TABLE IF EXISTS compras CASCADE;
DROP TABLE IF EXISTS medicamentos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Nota: Las tablas correctas son:
-- - Usuario (singular, PascalCase)
-- - Medicamento (singular, PascalCase)
-- - Venta (singular, PascalCase)
-- Estas son las que usa init.sql y el código del backend
