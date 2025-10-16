-- Migration: 016_agregar_timestamps_tablas_principales
-- Description: Agregar campos created_at y updated_at a tablas sin auditoría
-- Date: 2025-10-15
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - AGREGAR TIMESTAMPS PARA AUDITORÍA
-- ============================================

-- 1. Usuario - agregar timestamps
ALTER TABLE usuario 
ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- 2. Medicamento - agregar timestamps
ALTER TABLE medicamento 
ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- 3. Venta - agregar created_at (updated_at no es necesario, ventas no se editan)
ALTER TABLE venta 
ADD COLUMN created_at TIMESTAMP DEFAULT NOW();

-- 4. Actualizar timestamps existentes a NOW() para registros actuales
UPDATE usuario SET created_at = NOW(), updated_at = NOW() WHERE created_at IS NULL;
UPDATE medicamento SET created_at = NOW(), updated_at = NOW() WHERE created_at IS NULL;
UPDATE venta SET created_at = NOW() WHERE created_at IS NULL;

-- 5. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Crear triggers para actualizar automáticamente
CREATE TRIGGER update_usuario_updated_at 
BEFORE UPDATE ON usuario 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medicamento_updated_at 
BEFORE UPDATE ON medicamento 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ahora todas las tablas principales tienen auditoría de cambios
