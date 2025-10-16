-- Migration: 010_agregar_cliente_fecha_a_venta
-- Description: Conectar ventas con clientes y agregar fecha de venta
-- Date: 2025-10-15
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - AGREGAR CLIENTE Y FECHA A VENTA
-- ============================================

-- 1. Agregar columna idcliente (nullable por ahora)
ALTER TABLE venta 
ADD COLUMN idcliente INT;

-- 2. Agregar columna fecha con valor por defecto
ALTER TABLE venta 
ADD COLUMN fecha TIMESTAMP DEFAULT NOW();

-- 3. Poblar fechas para registros existentes
UPDATE venta SET fecha = NOW() WHERE fecha IS NULL;

-- 4. Agregar clave foránea con SET NULL (si se borra cliente, venta queda sin cliente)
ALTER TABLE venta 
ADD CONSTRAINT fk_venta_cliente 
FOREIGN KEY (idcliente) REFERENCES clientes(idcliente) ON DELETE SET NULL;

-- Nota: idcliente es nullable porque pueden existir ventas sin cliente registrado
